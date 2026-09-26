"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/* ==========================================
   2. 3D SCENE (Vanilla Three.js)
========================================== */
function prefersConservativeGpu() {
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari =
    /safari/i.test(ua) && !/chrome|chromium|android|crios|fxios|edg\//i.test(ua);
  return iOS || safari;
}

export function HomeThreeScene({
  scrollProgressRef,
  introReady,
  reduceMotion,
  onBootstrapped,
  onReady,
  onUnavailable,
  onContextLost,
}: {
  scrollProgressRef: RefObject<number>;
  introReady: boolean;
  reduceMotion: boolean;
  onBootstrapped?: () => void;
  onReady?: () => void;
  onUnavailable?: () => void;
  onContextLost?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onBootstrapped, onReady, onUnavailable, onContextLost });
  useEffect(() => {
    callbacksRef.current = { onBootstrapped, onReady, onUnavailable, onContextLost };
  }, [onBootstrapped, onReady, onUnavailable, onContextLost]);
  const objectsRef = useRef<{
    camera?: THREE.PerspectiveCamera;
    star?: THREE.Mesh;
    geometry?: THREE.IcosahedronGeometry;
    originalPositions?: Float32Array | number[];
    scrollProgress?: number;
    _dustScroll?: number;
    introReady?: boolean;
    reduceMotion?: boolean;
    introProgress?: number;
    _reducedGeomRestored?: boolean;
  }>({
    introReady,
    reduceMotion,
    introProgress: reduceMotion ? 1 : 0,
    scrollProgress: 0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030303");
    scene.fog = new THREE.FogExp2("#030303", 0.05);

    const w = window.innerWidth;
    const isMobile = w < 1024;
    const isPhone = w < 768;
    const conservativeGpu = prefersConservativeGpu();
    const geoDetail = isPhone || conservativeGpu ? 6 : isMobile ? 8 : 12;
    const usePostFx = !isMobile && !reduceMotion;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 7;
    objectsRef.current.camera = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile && !conservativeGpu,
        alpha: true,
        powerPreference: conservativeGpu ? "default" : "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      callbacksRef.current.onUnavailable?.();
      return;
    }
    if (!renderer.getContext()) {
      renderer.dispose();
      callbacksRef.current.onUnavailable?.();
      return;
    }
    callbacksRef.current.onBootstrapped?.();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isPhone ? 1.25 : isMobile ? 1.5 : 2),
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const envCanvas = document.createElement("canvas");
    const envW = isMobile ? 512 : 1024;
    const envH = isMobile ? 256 : 512;
    envCanvas.width = envW;
    envCanvas.height = envH;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, envW, envH);

      ctx.shadowBlur = isMobile ? 10 : 20;
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(envW * 0.1, envH * 0.29, envW * 0.8, envH * 0.04);
      ctx.fillRect(envW * 0.1, envH * 0.68, envW * 0.8, envH * 0.04);

      ctx.shadowColor = "#ff2a2a";
      ctx.fillStyle = "#ff2a2a";
      ctx.fillRect(envW * 0.39, envH * 0.1, envW * 0.05, envH * 0.8);
      ctx.fillRect(envW * 0.78, envH * 0.2, envW * 0.02, envH * 0.61);
    }

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mouseLight = new THREE.PointLight(0xff2a2a, 5, 10);
    scene.add(mouseLight);

    const geometry = new THREE.IcosahedronGeometry(1.8, geoDetail);
    /** High-end minimal chrome with anisotropic highlights */
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.14,
      envMapIntensity: 1.1,
      clearcoat: 0.08,
      clearcoatRoughness: 0.26,
      anisotropy: 0.62,
      anisotropyRotation: Math.PI * 0.22,
    });

    const displaceUniforms = {
      uTime: { value: 0 },
      uDistort: { value: reduceMotion ? 0 : 0.15 },
    };
    chromeMaterial.customProgramCacheKey = () => "madbak-chrome-displace";
    chromeMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = displaceUniforms.uTime;
      shader.uniforms.uDistort = displaceUniforms.uDistort;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform float uTime;\nuniform float uDistort;",
        )
        .replace(
          "#include <begin_vertex>",
          `
          float madNoise = sin(uTime * 1.5 + position.x * 2.5) * cos(uTime * 1.5 + position.y * 2.5) * sin(uTime * 1.5 + position.z * 2.5);
          vec3 transformed = normalize(position) * (1.8 + madNoise * uDistort);
          `,
        );
    };

    const star = new THREE.Mesh(geometry, chromeMaterial);
    const startReduced = Boolean(objectsRef.current.reduceMotion);
    star.scale.setScalar(startReduced ? 1 : 0.86);
    scene.add(star);

    objectsRef.current.star = star;
    objectsRef.current.geometry = geometry;
    objectsRef.current.introProgress = startReduced ? 1 : 0;
    objectsRef.current.originalPositions = new Float32Array(
      geometry.attributes.position.array,
    );

    const dustCount = isPhone ? 220 : isMobile ? 360 : 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPos[i] = (Math.random() - 0.5) * 25;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));

    const baseDustSize = isMobile ? 0.014 : 0.016;
    const dustMat = new THREE.PointsMaterial({
      size: baseDustSize,
      color: 0xe8e4dc,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    let composer: EffectComposer | null = null;
    let chromaticPass: ShaderPass | null = null;
    let outputPass: OutputPass | null = null;

    let composerFailed = false;
    if (usePostFx) {
      const ChromaticAberrationShader = {
        uniforms: {
          tDiffuse: { value: null },
          amount: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tDiffuse;
          uniform float amount;
          varying vec2 vUv;
          void main() {
            vec2 shift = vec2(amount * 0.0055, amount * 0.0021);
            float r = texture2D(tDiffuse, vUv + shift).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - shift).b;
            vec4 base = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(r, g, b, base.a);
          }
        `,
      };

      try {
        let composerTarget: THREE.WebGLRenderTarget | undefined;
        if (conservativeGpu) {
          const size = renderer.getSize(new THREE.Vector2());
          const pixelRatio = renderer.getPixelRatio();
          composerTarget = new THREE.WebGLRenderTarget(
            Math.max(1, Math.floor(size.width * pixelRatio)),
            Math.max(1, Math.floor(size.height * pixelRatio)),
            { type: THREE.UnsignedByteType },
          );
        }
        composer = new EffectComposer(renderer, composerTarget);
        composer.addPass(new RenderPass(scene, camera));
        chromaticPass = new ShaderPass(ChromaticAberrationShader);
        composer.addPass(chromaticPass);
        outputPass = new OutputPass();
        composer.addPass(outputPass);
        composer.setSize(window.innerWidth, window.innerHeight);
      } catch {
        composer = null;
        chromaticPass = null;
        composerFailed = true;
      }
    }

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId = 0;
    let contextLost = false;
    let reportedReady = false;
    let lostTimer = 0;
    const clock = new THREE.Clock();
    /** Scroll velocity (0–1 progress / sec) — spike = fast wheel/trackpad */
    let prevScrollProg = 0;
    let rgbGlitch = 0;
    const SCROLL_GLITCH_VEL = 0.42;

    let loopOn = false;
    const animate = () => {
      if (contextLost || document.hidden) {
        loopOn = false;
        return;
      }
      loopOn = true;
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const dtSafe = Math.min(Math.max(dt, 1e-5), 0.08);
      const time = clock.getElapsedTime();
      const currentScroll = scrollProgressRef.current || 0;
      objectsRef.current.scrollProgress = currentScroll;

      const scrollVelocity =
        Math.abs(currentScroll - prevScrollProg) / dtSafe;
      prevScrollProg = currentScroll;

      if (scrollVelocity > SCROLL_GLITCH_VEL) {
        rgbGlitch = Math.min(1, Math.max(rgbGlitch, 0.92));
      }
      rgbGlitch *= 0.84;
      if (chromaticPass) {
        chromaticPass.uniforms.amount.value = rgbGlitch;
      }

      mouse.x = THREE.MathUtils.lerp(mouse.x, targetMouse.x, 0.055);
      mouse.y = THREE.MathUtils.lerp(mouse.y, targetMouse.y, 0.055);
      mouseLight.position.set(mouse.x * 5.2, mouse.y * 5.2, 2.2);

      /** Immersive entry: extra zoom for scrollProgress ∈ [0, 0.2] */
      const entryPhase = Math.min(1, currentScroll / 0.2);
      const entryZoom = (1 - entryPhase) * 1.28;

      const targetCamZ = 7 - currentScroll * 4 - entryZoom;
      const targetCamY = currentScroll * 2 + mouse.y * 0.52;
      const targetCamX = mouse.x * 0.52;

      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetCamZ,
        0.052,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetCamY,
        0.052,
      );
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetCamX,
        0.052,
      );

      const lookX = mouse.x * 0.62;
      const lookY = currentScroll * 1.52 + mouse.y * 0.14;
      const lookZ = mouse.x * -0.16;
      camera.lookAt(lookX, lookY, lookZ);

      /** Soft cinematic intro scale (structure unchanged; gated by reduced motion) */
      const reduce = Boolean(objectsRef.current.reduceMotion);
      let intro = objectsRef.current.introProgress ?? 0;
      if (reduce) {
        intro = 1;
      } else if (objectsRef.current.introReady) {
        intro = Math.min(1, intro + dtSafe * 0.42);
      }
      objectsRef.current.introProgress = intro;
      const introEase = 1 - (1 - intro) ** 3;
      star.scale.setScalar(THREE.MathUtils.lerp(0.86, 1, introEase));
      const cinemaFloat = reduce ? 0 : Math.sin(time * 0.28) * 0.055 * introEase;
      star.position.y = cinemaFloat;

      /** Liquid-like chrome response as scroll progresses */
      const liq = THREE.MathUtils.smoothstep(currentScroll, 0, 1);
      chromeMaterial.envMapIntensity = 1.08 + liq * 2.35;
      chromeMaterial.roughness = THREE.MathUtils.lerp(0.18, 0.1, liq);

      const rotMul = reduce ? 0 : introEase;
      star.rotation.y =
        time * 0.11 * rotMul + currentScroll * 3 + mouse.x * 0.2;
      star.rotation.z = time * 0.075 * rotMul + mouse.y * 0.2;

      displaceUniforms.uTime.value = reduce ? 0 : time;
      displaceUniforms.uDistort.value = reduce ? 0 : 0.15 + currentScroll * 0.5;

      /** Parallax dust: drift opposite scroll direction */
      const lastDustScroll = objectsRef.current._dustScroll ?? currentScroll;
      const dScroll = currentScroll - lastDustScroll;
      objectsRef.current._dustScroll = currentScroll;
      dust.position.y -= dScroll * 78;
      dust.position.z += dScroll * 42;

      dust.rotation.y = time * 0.038;

      const flicker = 0.5 + 0.5 * Math.sin(time * 4.1);
      const twinkle = 0.5 + 0.5 * Math.sin(time * 6.3 + 0.7);
      dustMat.opacity = 0.11 + 0.09 * flicker;
      dustMat.size = baseDustSize * (1 + 0.055 * twinkle);

      try {
        if (composer && !composerFailed) {
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
      } catch {
        composerFailed = true;
        try {
          renderer.render(scene, camera);
        } catch {
          contextLost = true;
          cancelAnimationFrame(animationFrameId);
          callbacksRef.current.onUnavailable?.();
          return;
        }
      }

      if (!reportedReady) {
        reportedReady = true;
        callbacksRef.current.onReady?.();
      }
    };

    const canvas = renderer.domElement;
    const onContextLostEvent = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(lostTimer);
      lostTimer = window.setTimeout(() => {
        callbacksRef.current.onUnavailable?.();
      }, 1500);
    };
    const onContextRestoredEvent = () => {
      window.clearTimeout(lostTimer);
      callbacksRef.current.onContextLost?.();
    };
    canvas.addEventListener("webglcontextlost", onContextLostEvent);
    canvas.addEventListener("webglcontextrestored", onContextRestoredEvent);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
        loopOn = false;
        return;
      }
      if (!contextLost && !loopOn) {
        clock.getDelta();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    animate();

    const handleResize = () => {
      const mob = window.innerWidth < 1024;
      const phone = window.innerWidth < 768;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, phone ? 1.25 : mob ? 1.5 : 2),
      );
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer?.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(lostTimer);
      canvas.removeEventListener("webglcontextlost", onContextLostEvent);
      canvas.removeEventListener("webglcontextrestored", onContextRestoredEvent);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      geometry.dispose();
      chromeMaterial.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      chromaticPass?.material.dispose();
      outputPass?.material.dispose();
      composer?.renderTarget1.dispose();
      composer?.renderTarget2.dispose();
      renderer.dispose();
      envTexture.dispose();
    };
    // Scene is intentionally mount-once; reduceMotion is read via objectsRef after init.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- WebGL bootstrap
  }, []);

  useEffect(() => {
    objectsRef.current.introReady = introReady;
  }, [introReady]);

  useEffect(() => {
    objectsRef.current.reduceMotion = reduceMotion;
    if (reduceMotion) {
      objectsRef.current.introProgress = 1;
      const star = objectsRef.current.star;
      if (star) {
        star.scale.setScalar(1);
        star.position.y = 0;
      }
    }
  }, [reduceMotion]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
};
