"use client";

import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PortfolioImage } from "./components/PortfolioImage";
import { ModalImageGallery } from "./components/ModalImageGallery";

import {
  ABOUT_OPERATOR_IMAGE_SRC,
  NFT_ITEMS,
  PROJECTS,
  TRANSLATIONS,
  type LangKey,
} from "./lib/portfolio-data";
import { MobileNavOverlay, SiteNav } from "./components/SiteNav";
import {
  bodyProse,
  brandUppercase,
  displayStackLeading,
  htmlLangAttr,
  leadProse,
  localeCase,
  modalBody,
  nftDisplayLeading,
  rootLocaleClasses,
  trackHeading,
  trackKickerEm,
  trackMeta,
  heroSubTracking,
  nftSub1Track,
  nftSub2Track,
  nftTitleTracking,
  nftSpanTracking,
  nftCardTitleTrack,
  nftDtTrack,
  nftLinkTrack,
} from "./lib/locale-ui";
import { ContactSection } from "./components/ContactSection";
import { MiniGame } from "./components/MiniGame";
import { WorksScroll } from "./components/WorksScroll";

/* ==========================================
   2. 3D SCENE (Vanilla Three.js)
========================================== */
const ThreeScene = ({
  scrollProgress,
  introReady,
  reduceMotion,
}: {
  scrollProgress: number;
  introReady: boolean;
  reduceMotion: boolean;
}) => {
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
    const geoDetail = w < 768 ? 12 : isMobile ? 16 : 32;

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
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, 1024, 512);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(100, 150, 824, 20);
      ctx.fillRect(100, 350, 824, 20);

      ctx.shadowColor = "#ff2a2a";
      ctx.fillStyle = "#ff2a2a";
      ctx.fillRect(400, 50, 50, 412);
      ctx.fillRect(800, 100, 20, 312);
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

    const dustCount = isMobile ? 420 : 800;
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

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const chromaticPass = new ShaderPass(ChromaticAberrationShader);
    composer.addPass(chromaticPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composer.setSize(window.innerWidth, window.innerHeight);

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
      chromaticPass.uniforms.amount.value = rgbGlitch;

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
        geometry.computeVertexNormals();
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

      composer.render();
    };

    animate();

    const handleResize = () => {
      const mob = window.innerWidth < 1024;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mob ? 1.5 : 2));
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
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
      chromaticPass.material.dispose();
      outputPass.material.dispose();
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
      renderer.dispose();
      envTexture.dispose();
    };
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

/* ==========================================
   3. UI COMPONENTS
========================================== */

const LoadingScreen = ({
  onComplete,
  lang,
}: {
  onComplete: () => void;
  lang: LangKey;
}) => {
  const [progress, setProgress] = useState(0);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setFlicker(true), 200);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return p + Math.floor(Math.random() * 8);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#EBE8E1] font-mono transition-opacity duration-700 ${
        flicker ? "scale-105 opacity-0 blur-md" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-20" />
      <div className="w-full max-w-sm px-6">
        <div
          className={`mb-2 flex items-end justify-between text-[10px] ${brandUppercase()} ${trackMeta(lang)} text-black`}
        >
          <span>Sys_Boot</span>
          <span className="tabular-nums">
            {progress.toString().padStart(3, "0")}%
          </span>
        </div>
        <div className="relative h-[1px] w-full overflow-hidden bg-black/10">
          <div
            className="absolute top-0 start-0 h-full bg-[#ff2a2a] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          className={`fa-wordmark-latin mt-8 text-center font-sans text-4xl font-black ${brandUppercase()} ${trackHeading(lang)} text-black/5`}
        >
          MADBAK
        </div>
      </div>
    </div>
  );
};

type Project = (typeof PROJECTS)[number];

const ProjectTitleDisplay = memo(function ProjectTitleDisplay({
  project,
  lang,
  className = "",
}: {
  project: Project;
  lang: LangKey;
  className?: string;
}) {
  const title = project.langs[lang]?.title ?? "";
  const lines =
    "titleStack" in project && project.titleStack
      ? project.titleStack[lang]
      : undefined;

  if (lines?.length) {
    return (
      <span
        dir="auto"
        className={`flex flex-col ${lang === "fa" ? "gap-1.5 leading-[1.12] sm:gap-2 sm:leading-[1.1]" : "gap-0 leading-[0.9]"} ${className}`.trim()}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span dir="auto" className={className}>
      {title}
    </span>
  );
});

const Modal = ({
  project,
  onClose,
  t,
  lang,
}: {
  project: Project;
  onClose: () => void;
  t: (key: keyof (typeof TRANSLATIONS)["en"]) => string;
  lang: LangKey;
}) => {
  const reduce = useReducedMotion();
  const title = project.langs[lang]?.title;
  const category = project.langs[lang]?.cat;
  const description = project.langs[lang]?.desc;
  const role = project.langs[lang]?.role ?? "";
  const context = project.langs[lang]?.context ?? "";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 backdrop-blur-xl md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduce ? 0.12 : 0.26,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative flex h-full max-h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#0A0A0A] text-[#EBE8E1] md:h-[min(100dvh,85vh)] md:max-h-[85vh] md:flex-row"
        initial={{
          opacity: 0,
          y: reduce ? 0 : 32,
          scale: reduce ? 1 : 0.985,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: reduce ? 0 : 14,
          scale: reduce ? 1 : 0.992,
        }}
        transition={{
          duration: reduce ? 0.18 : 0.52,
          ease: [0.16, 1, 0.3, 1],
        }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ willChange: "transform, opacity" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="group absolute top-4 end-4 z-30 flex min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/20 bg-black/50 shadow-sm transition-[transform,colors,box-shadow] duration-200 hover:bg-white hover:text-black hover:shadow-md active:scale-[0.94] sm:top-6 sm:end-6 sm:h-12 sm:w-12"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-500 group-hover:rotate-90"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="z-10 flex h-full min-h-0 w-full flex-col border-b border-white/10 bg-[#0A0A0A] md:w-1/2 md:border-e md:border-b-0 md:border-white/10">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 pt-14 pb-6 sm:px-8 sm:pt-16 sm:pb-8 md:px-12 md:py-14 lg:p-16">
            <div
              className={`mb-8 flex shrink-0 items-center gap-3 font-mono text-[10px] text-[#ff2a2a] sm:mb-10 sm:gap-4 ${localeCase(lang)} ${trackKickerEm(lang, "0.2em")}`}
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#ff2a2a]" />
              <span className="min-w-0 break-words">
                {`${t("modal_active")} // ${project.sys}`}
              </span>
            </div>

            <h2
              className={`mb-6 break-words font-black sm:mb-8 sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl xl:text-8xl ${localeCase(lang)} ${trackHeading(lang)} ${
                lang === "fa"
                  ? "text-[clamp(1.75rem,7vw,3.75rem)] leading-[1.12]"
                  : "text-4xl leading-[0.88] sm:leading-[0.85]"
              }`}
            >
              <ProjectTitleDisplay project={project} lang={lang} />
            </h2>

            <p
              className={`max-w-xl text-start text-base font-light opacity-60 sm:text-lg ${modalBody(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
            >
              {description}
            </p>

            <div className="mt-10 w-full shrink-0 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10">
              <div
                className={`grid grid-cols-1 gap-x-6 gap-y-4 font-mono text-[10px] opacity-40 sm:grid-cols-2 ${localeCase(lang)} ${trackMeta(lang)}`}
              >
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_type")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {category}
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_year")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  <span className="tabular-nums">{project.year}</span>
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_role")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {role}
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_context")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {context}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative h-full min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#111] md:w-1/2">
          <div className="flex h-auto w-full flex-col">
            <ModalImageGallery
              key={project.id}
              project={project}
              title={title}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ==========================================
   4. MAIN PAGE
========================================== */
export default function Page() {
  const [lang, setLang] = useState<LangKey>("en");
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const navigateToHash = useCallback(
    (hash: string) => {
      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
      setWorksMenuOpen(false);
      if (hash === "hero") {
        window.scrollTo({ top: 0, behavior });
        setMobileNavOpen(false);
        return;
      }
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior, block: "start" });
      }
      setMobileNavOpen(false);
    },
    [reduceMotion],
  );

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (mobileNavOpen || selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen, selected]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLangAttr(lang);
    root.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileNavOpen(false);
      setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const baseInner =
      "h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out";

    const moveCursor = (e: MouseEvent) => {
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const overFlag = under?.closest("[data-cursor-no-difference]");
      const isHoverable = under?.closest("a, button, .cursor-pointer");

      if (cursorOuterRef.current) {
        cursorOuterRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorOuterRef.current.style.opacity = "1";
        cursorOuterRef.current.style.mixBlendMode = overFlag
          ? "normal"
          : "difference";
      }

      if (cursorInnerRef.current) {
        const el = cursorInnerRef.current;
        if (overFlag) {
          el.className = `${baseInner} bg-[#ff2a2a]`;
        } else if (isHoverable) {
          el.className = `${baseInner} scale-[3] bg-white`;
        } else {
          el.className = `${baseInner} bg-[#ff2a2a]`;
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let rafId: number;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const updateScroll = () => {
      currentScroll += (targetScroll - currentScroll) * 0.1;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0
          ? Math.max(0, Math.min(1, currentScroll / maxScroll))
          : 0;

      const prev = lastProgressRef.current;
      if (
        Math.abs(progress - prev) > 0.003 ||
        progress === 0 ||
        progress === 1
      ) {
        lastProgressRef.current = progress;
        setScrollProgress(progress);
      }
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      lang={htmlLangAttr(lang)}
      className={`min-h-screen overflow-x-hidden bg-[#EBE8E1] text-[#0A0A0A] selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
      dir={lang === "fa" ? "rtl" : "ltr"}
    >
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} lang={lang} />
      )}

      <div className="pointer-events-none fixed inset-0 z-[60] bg-noise opacity-[0.4] mix-blend-multiply" />

      <ThreeScene
        scrollProgress={scrollProgress}
        introReady={!loading}
        reduceMotion={reduceMotion}
      />

      <main className="relative z-10 overflow-x-hidden pt-14 sm:pt-[3.75rem]">
        <SiteNav
          lang={lang}
          setLang={setLang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          scrolled={navScrolled}
          onNavigate={navigateToHash}
          worksMenuOpen={worksMenuOpen}
          setWorksMenuOpen={setWorksMenuOpen}
        />
        <MobileNavOverlay
          lang={lang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          setLang={setLang}
          prefersReducedMotion={reduceMotion}
          onNavigate={navigateToHash}
          worksAccordionOpen={worksAccordionOpen}
          setWorksAccordionOpen={setWorksAccordionOpen}
        />

        <section
          id="hero"
          tabIndex={-1}
          className="pointer-events-none relative flex min-h-[min(92svh,40rem)] flex-col items-center justify-center overflow-x-hidden px-4 sm:min-h-[85vh] lg:h-[120vh] lg:min-h-0"
        >
          <div className="absolute inset-0 flex w-full flex-col items-center justify-center mix-blend-difference text-[#EBE8E1]">
            <div
              className="relative z-10"
              style={{ transform: `translateY(${scrollProgress * 200}px)` }}
            >
              <motion.h2
                className={`fa-wordmark-latin max-w-[100%] text-center font-sans text-[clamp(2.75rem,16vw,24rem)] leading-[0.75] font-black select-none sm:text-[18vw] lg:text-[20vw] lg:whitespace-nowrap ${brandUppercase()} ${trackHeading(lang)}`}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 56 }
                }
                animate={
                  loading
                    ? reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 56 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: reduceMotion ? 0.01 : 1.15,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduceMotion || loading ? 0 : 0.06,
                }}
                style={{ willChange: reduceMotion ? undefined : "transform, opacity" }}
              >
                MADBAK
              </motion.h2>
            </div>

            <div
              className="relative z-10 mt-6 max-w-[95vw] text-center sm:mt-8 md:mt-12"
              style={{ transform: `translateY(${scrollProgress * 350}px)` }}
            >
              <motion.p
                className="select-none mix-blend-normal"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 28 }
                }
                animate={
                  loading
                    ? reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 28 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: reduceMotion ? 0.01 : 0.95,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduceMotion || loading ? 0 : 0.38,
                }}
                style={{
                  willChange: reduceMotion ? undefined : "transform, opacity",
                }}
              >
                <span
                  className={`inline-block max-w-[min(100%,42rem)] rounded-full border border-[#ff2a2a]/40 bg-[#0A0A0A]/90 px-3 py-1.5 text-[10px] font-light text-[#ff2a2a] shadow-[0_0_24px_rgba(255,42,42,0.18)] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs md:px-6 md:py-2.5 md:text-xl ${localeCase(lang)} ${heroSubTracking(lang)}`}
                >
                  {t("hero_dev")}
                </span>
              </motion.p>
            </div>
          </div>

          <div className="absolute bottom-20 flex -translate-x-1/2 flex-col items-center mix-blend-difference text-[#EBE8E1] start-1/2 sm:bottom-28 lg:bottom-32">
            <span
              className={`mb-4 font-mono text-[9px] opacity-50 ${localeCase(lang)} ${trackMeta(lang)}`}
            >
              {t("hero_scroll")}
            </span>
            <div className="relative h-16 w-[1px] overflow-hidden bg-white/20">
              <div className="animate-scroll-line absolute top-0 start-0 h-full w-full bg-white" />
            </div>
          </div>
        </section>

        <section
          id="about"
          className="relative z-20 scroll-mt-[5.5rem] bg-[#EBE8E1] px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32 lg:px-12 lg:py-48"
        >
          <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-12 sm:gap-16 md:gap-20 lg:max-w-[90vw] lg:grid-cols-12 lg:gap-24">
            <div className="flex min-w-0 flex-col justify-between lg:col-span-4">
              <div className="min-w-0">
                <div
                  className={`mb-8 flex justify-between border-t-2 border-black pt-4 font-mono text-[10px] ${localeCase(lang)} ${trackMeta(lang)}`}
                >
                  <span>{t("about_op")}</span>
                  <span className="unicode-bidi-isolate tabular-nums">
                    ( ID: 001 )
                  </span>
                </div>
                <h2
                  className={`max-w-full break-words text-[clamp(1.875rem,8.5vw,3rem)] font-black sm:text-[clamp(1.875rem,7.5vw,2.85rem)] md:text-[clamp(1.75rem,6.25vw,2.65rem)] lg:text-[clamp(1.25rem,2.35vw,1.875rem)] xl:text-[clamp(1.35rem,2.55vw,2rem)] ${displayStackLeading(lang)} ${localeCase(lang)} ${trackHeading(lang)}`}
                >
                  {t("about_h1_1")}
                  <br />
                  {t("about_h1_2")}
                </h2>
                <figure className="group relative mt-6 w-full min-w-0 sm:mt-8">
                  <div className="relative aspect-[3/4] w-full max-w-full overflow-hidden border border-black/12 bg-[#0A0A0A]/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <PortfolioImage
                      src={ABOUT_OPERATOR_IMAGE_SRC}
                      alt={t("about_operator_image_alt")}
                      fill
                      sizes="(max-width: 640px) min(100vw - 2rem, 36rem), (max-width: 1023px) min(100vw - 3rem, 40rem), (max-width: 1536px) 30vw, 380px"
                      className="object-cover object-center transition-[filter,transform] duration-[480ms] ease-out group-hover:brightness-[1.025] group-hover:contrast-[1.02] motion-reduce:transition-none"
                    />
                  </div>
                </figure>
              </div>
              <div className="mt-24 hidden lg:flex">
                <svg
                  viewBox="0 0 100 100"
                  className="h-32 w-32 animate-orbit-20s"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    opacity="0.3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="#ff2a2a"
                    strokeWidth="2"
                  />
                  <circle cx="50" cy="50" r="10" fill="black" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-8">
              <p
                className={`mb-7 max-w-4xl text-xl font-black sm:mb-9 sm:text-3xl md:mb-10 md:text-5xl ${localeCase(lang)} ${leadProse(lang)} ${trackHeading(lang)}`}
              >
                {t("about_intro_before")}
                <span
                  className={`text-[#ff2a2a] drop-shadow-[0_0_24px_rgba(255,42,42,0.22)] ${brandUppercase()}`}
                >
                  MADBAK
                </span>
                {t("about_intro_after")}
              </p>
              <div
                className={`mb-12 max-w-3xl space-y-6 text-base font-light opacity-70 sm:mb-16 sm:space-y-7 sm:text-lg md:space-y-8 md:text-2xl ${bodyProse(lang)}`}
              >
                <p>{t("about_p2")}</p>
                <p>{t("about_p3")}</p>
                <p>{t("about_p4")}</p>
                <p>{t("about_p5")}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-black/10 pt-8 sm:grid-cols-2 sm:gap-8 sm:pt-10 lg:grid-cols-4 lg:pt-12">
                {(
                  [
                    { l: t("stat_role"), v: t("val_role") },
                    { l: t("stat_stack"), v: "React / Next" },
                    { l: t("stat_engine"), v: "Three.js / WebGL" },
                    { l: t("stat_loc"), v: t("val_loc") },
                  ] as const
                ).map((stat, idx) => (
                  <div key={idx}>
                    <div
                      className={`mb-2 font-mono text-[10px] opacity-40 ${localeCase(lang)} ${trackMeta(lang)}`}
                    >
                      {stat.l}
                    </div>
                    <div
                      className={`text-sm font-black ${localeCase(lang)} ${lang === "fa" ? "tracking-normal" : "tracking-tight"}`}
                    >
                      {stat.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WorksScroll lang={lang} />

        {false && (
        <section
          id="nfts"
          className="relative z-20 border-t border-black/10 bg-[#EBE8E1] px-4 py-16 text-[#0A0A0A] sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-16 lg:py-28"
        >
          <div className="relative mx-auto w-full max-w-[min(100%,80rem)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-[3px] shrink-0 bg-[#ff2a2a]" aria-hidden />
                <p
                  className={`text-xs font-semibold text-black/55 sm:text-[13px] ${lang !== "fa" ? "font-sans" : ""} ${localeCase(lang)} ${nftSub1Track(lang)}`}
                >
                  {t("nft_sub1")}
                </p>
              </div>
              <p
                className={`font-mono text-xs text-black/45 sm:text-[13px] ${localeCase(lang)} ${nftSub2Track(lang)}`}
              >
                {t("nft_sub2")}
              </p>
            </div>

            <div className="mt-8">
              <h2
                className={`max-w-full break-words text-[clamp(3.15rem,9.5vw,6.75rem)] font-black font-normal text-black sm:max-w-[20ch] ${nftDisplayLeading(lang)} ${localeCase(lang)} ${nftTitleTracking(lang)}`}
              >
                {t("nft_h1")}
                <span
                  className={`mt-1 block text-[0.42em] font-normal text-black/45 sm:mt-0 sm:inline sm:ps-4 sm:text-[0.5em] ${nftSpanTracking(lang)}`}
                >
                  {t("nft_h2")}
                </span>
              </h2>
            </div>

            <div className="mt-14 flex flex-col gap-12 sm:mt-16 sm:gap-14 md:gap-16">
              {NFT_ITEMS.map((nft, i) => {
                const alignRight = i % 2 === 1;
                const title = nft.langs[lang]?.title;
                const category = nft.langs[lang]?.cat;

                return (
                  <div
                    key={nft.id}
                    className={[
                      "flex w-full flex-col gap-5 md:flex-row md:items-stretch md:gap-8 lg:gap-12",
                      alignRight ? "md:flex-row-reverse" : "",
                    ].join(" ")}
                  >
                    <div className="w-full shrink-0 md:max-w-[min(100%,22rem)] lg:max-w-md">
                      <a
                        href={nft.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] focus-visible:ring-offset-2"
                      >
                        <div className="relative overflow-hidden transition-[filter] duration-300 group-hover:brightness-[1.03]">
                          <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
                            <PortfolioImage
                              src={nft.image}
                              alt={title ?? ""}
                              fill
                              sizes="(max-width: 768px) 100vw, 22rem"
                              className="transition duration-500 group-hover:scale-[1.04]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />
                          </div>
                        </div>
                      </a>
                    </div>

                    <aside
                      className="flex min-h-0 flex-1 flex-col justify-center px-0 py-2 text-start sm:px-2 sm:py-4 md:px-3"
                    >
                      <p
                        className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${trackKickerEm(lang, "0.28em")}`}
                      >
                        {`${nft.platform} // ${nft.sys}`}
                      </p>
                      <p
                        className={`mt-5 break-words text-[clamp(2rem,5vw,3.35rem)] font-black text-black ${lang === "fa" ? "leading-[1.14] sm:leading-[1.1]" : "leading-[1.02]"} ${localeCase(lang)} ${nftCardTitleTrack(lang)}`}
                      >
                        {title}
                      </p>
                      <dl className="mt-7 space-y-5 pt-1">
                        <div>
                          <dt
                            className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${nftDtTrack(lang)}`}
                          >
                            {t("modal_type")}
                          </dt>
                          <dd
                            className={`mt-2 text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem] ${lang !== "fa" ? "font-sans" : ""}`}
                          >
                            {category}
                          </dd>
                        </div>
                        <div>
                          <dt
                            className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${nftDtTrack(lang)}`}
                          >
                            {t("modal_year")}
                          </dt>
                          <dd
                            className={`mt-2 text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem] ${lang !== "fa" ? "font-sans" : ""}`}
                          >
                            {nft.year}
                          </dd>
                        </div>
                      </dl>
                      <a
                        href={nft.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-9 inline-flex w-fit min-w-0 max-w-full items-center gap-2 break-words font-mono text-sm text-[#ff2a2a] underline decoration-[#ff2a2a]/50 underline-offset-[7px] transition hover:text-black hover:decoration-[#ff2a2a] sm:text-[15px] ${localeCase(lang)} ${nftLinkTrack(lang)} ${lang === "fa" ? "flex-row-reverse" : ""}`}
                      >
                        {t("nft_view")}
                        <span aria-hidden>→</span>
                      </a>
                    </aside>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        )}

        <MiniGame
          t={t}
          lang={lang}
          onNavigateToProjects={() => navigateToHash("works")}
        />

        <ContactSection t={t} lang={lang} />

        <footer
          className={`bg-[#0A0A0A] px-4 py-6 text-center font-mono text-[10px] text-white/40 sm:p-6 ${brandUppercase()} ${trackMeta(lang)}`}
        >
          © 2026 MADBAK IND.
        </footer>
      </main>

      <div
        ref={cursorOuterRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          ref={cursorInnerRef}
          className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff2a2a] transition-all duration-300 ease-out"
        />
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <Modal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
            t={t}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
