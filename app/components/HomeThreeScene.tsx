"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/* ==========================================
   2. 3D SCENE (Vanilla Three.js)
========================================== */
export function HomeThreeScene({
  scrollProgress,
  introReady,
  reduceMotion,
}: {
  scrollProgress: number;
  introReady: boolean;
  reduceMotion: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
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
    scrollProgress,
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
    const geoDetail = isPhone ? 8 : isMobile ? 12 : 28;
    const usePostFx = !isMobile && !reduceMotion;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 7;
    objectsRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
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

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      chromaticPass = new ShaderPass(ChromaticAberrationShader);
      composer.addPass(chromaticPass);
      outputPass = new OutputPass();
      composer.addPass(outputPass);
      composer.setSize(window.innerWidth, window.innerHeight);
    }

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    const clock = new THREE.Clock();
    /** Scroll velocity (0–1 progress / sec) — spike = fast wheel/trackpad */
    let prevScrollProg = 0;
    let rgbGlitch = 0;
    const SCROLL_GLITCH_VEL = 0.42;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const dtSafe = Math.min(Math.max(dt, 1e-5), 0.08);
      const time = clock.getElapsedTime();
      const currentScroll = objectsRef.current.scrollProgress || 0;

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

      const posAttribute = geometry.attributes.position;
      const original = objectsRef.current.originalPositions;
      const v = new THREE.Vector3();
      const distortAmt = 0.15 + currentScroll * 0.5;
      const frequency = 1.5;

      if (original && !reduce) {
        objectsRef.current._reducedGeomRestored = false;
        const updateNormals = !isMobile || Math.floor(time * 30) % 2 === 0;
        for (let i = 0; i < posAttribute.count; i++) {
          v.fromArray(original, i * 3);
          const noise =
            Math.sin(time * frequency + v.x * 2.5) *
            Math.cos(time * frequency + v.y * 2.5) *
            Math.sin(time * frequency + v.z * 2.5);
          v.normalize().multiplyScalar(1.8 + noise * distortAmt);
          posAttribute.setXYZ(i, v.x, v.y, v.z);
        }
        posAttribute.needsUpdate = true;
        if (updateNormals) {
          geometry.computeVertexNormals();
        }
      } else if (
        original &&
        reduce &&
        !objectsRef.current._reducedGeomRestored
      ) {
        posAttribute.array.set(original);
        posAttribute.needsUpdate = true;
        geometry.computeVertexNormals();
        objectsRef.current._reducedGeomRestored = true;
      }

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

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      mount.removeChild(renderer.domElement);

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
    objectsRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

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
