"use client";

import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PortfolioImage } from "./components/PortfolioImage";
import { ModalImageGallery } from "./components/ModalImageGallery";

import {
  NFT_ITEMS,
  PROJECTS,
  TRANSLATIONS,
  type LangKey,
} from "./lib/portfolio-data";
import { MobileNavOverlay, SiteNav } from "./components/SiteNav";
import {
  bodyProse,
  brandUppercase,
  htmlLangAttr,
  leadProse,
  localeCase,
  modalBody,
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

/* ==========================================
   2. 3D SCENE (Vanilla Three.js)
========================================== */
const ThreeScene = ({ scrollProgress }: { scrollProgress: number }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const objectsRef = useRef<{
    camera?: THREE.PerspectiveCamera;
    star?: THREE.Mesh;
    geometry?: THREE.IcosahedronGeometry;
    originalPositions?: Float32Array | number[];
    scrollProgress?: number;
  }>({});

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
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.0,
      metalness: 1.0,
      envMapIntensity: 2.5,
    });

    const star = new THREE.Mesh(geometry, material);
    scene.add(star);

    objectsRef.current.star = star;
    objectsRef.current.geometry = geometry;
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

    const dustMat = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const currentScroll = objectsRef.current.scrollProgress || 0;

      mouse.x = THREE.MathUtils.lerp(mouse.x, targetMouse.x, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, targetMouse.y, 0.05);
      mouseLight.position.set(mouse.x * 5, mouse.y * 5, 2);

      const targetCamZ = 7 - currentScroll * 4;
      const targetCamY = currentScroll * 2 + mouse.y * 0.5;
      const targetCamX = mouse.x * 0.5;

      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
      camera.lookAt(0, currentScroll * 1.5, 0);

      star.rotation.y = time * 0.15 + currentScroll * 3 + mouse.x * 0.2;
      star.rotation.z = time * 0.1 + mouse.y * 0.2;

      const posAttribute = geometry.attributes.position;
      const original = objectsRef.current.originalPositions;
      const v = new THREE.Vector3();
      const distortAmt = 0.15 + currentScroll * 0.5;
      const frequency = 1.5;

      if (original) {
        for (let i = 0; i < posAttribute.count; i++) {
          v.fromArray(original, i * 3);
          const noise =
            Math.sin(time * frequency + v.x * 2.5) *
            Math.cos(time * frequency + v.y * 2.5) *
            Math.sin(time * frequency + v.z * 2.5);
          v.normalize().multiplyScalar(1.8 + noise * distortAmt);
          posAttribute.setXYZ(i, v.x, v.y, v.z);
        }
      }

      posAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      dust.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const mob = window.innerWidth < 1024;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mob ? 1.5 : 2));
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      mount.removeChild(renderer.domElement);

      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      envTexture.dispose();
    };
  }, []);

  useEffect(() => {
    objectsRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

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
          className={`mt-8 text-center text-4xl font-black ${brandUppercase()} ${trackHeading(lang)} text-black/5`}
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
        className={`flex flex-col gap-0 leading-[0.9] ${className}`.trim()}
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
              className={`max-w-xl text-start font-sans text-base font-light opacity-60 sm:text-lg ${modalBody(lang)}`}
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

const MiniGame = ({
  t,
  lang,
}: {
  t: (key: keyof (typeof TRANSLATIONS)["en"]) => string;
  lang: LangKey;
}) => {
  const [clickCount, setClickCount] = useState(0);
  const maxClicks = 50;

  const handleClick = () => {
    if (clickCount < maxClicks) {
      setClickCount((prev) => prev + 1);
    }
  };

  const percent = Math.floor((clickCount / maxClicks) * 100);

  return (
    <section className="relative z-20 overflow-hidden border-t border-black/10 bg-[#EBE8E1] px-4 py-16 text-[#0A0A0A] sm:px-6 sm:py-24 md:px-12 md:py-32">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-8 md:gap-16 lg:max-w-[90vw] lg:flex-row lg:gap-16">
        <div className="w-full md:w-1/2">
          <div
            className={`mb-8 border-s-2 border-[#ff2a2a] px-4 font-mono text-[10px] opacity-50 ${localeCase(lang)} ${trackMeta(lang)}`}
          >
            {t("game_proto")}
          </div>
          <h2
            className={`mb-6 text-3xl leading-[0.85] font-black sm:text-5xl md:text-7xl ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            {t("game_sys")}
            <br />
            <span className="text-[#ff2a2a]">{t("game_dec")}</span>
          </h2>
          <p className="text-base font-light opacity-60 sm:text-lg">
            {clickCount >= maxClicks ? t("game_desc2") : t("game_desc1")}
          </p>
        </div>

        <div className="flex w-full flex-col items-center md:w-1/2">
          <button
            type="button"
            onClick={handleClick}
            className={`relative flex h-44 min-h-[176px] w-44 min-w-[176px] cursor-pointer touch-manipulation flex-col items-center justify-center rounded-full border border-black transition-all duration-75 active:scale-95 sm:h-48 sm:w-48 md:h-64 md:w-64 ${
              clickCount >= maxClicks
                ? "scale-105 border-[#ff2a2a] bg-[#ff2a2a] text-[#EBE8E1] shadow-[0_0_50px_rgba(255,42,42,0.5)]"
                : "hover:scale-105 hover:bg-black hover:text-[#EBE8E1] active:scale-95"
            }`}
          >
            <span
              className={`px-4 text-center font-black ${trackHeading(lang)} ${
                clickCount >= maxClicks
                  ? "text-sm leading-tight normal-case md:text-lg"
                  : `text-3xl md:text-5xl ${localeCase(lang)}`
              }`}
            >
              {clickCount >= maxClicks ? t("game_btn2") : t("game_btn1")}
            </span>
            {clickCount < maxClicks && (
              <span
                className={`mt-2 font-mono text-[10px] opacity-50 ${localeCase(lang)} ${trackMeta(lang)}`}
              >
                {t("game_tap")}
              </span>
            )}
          </button>

          <div className="mt-12 w-full max-w-sm">
            <div
              className={`mb-2 flex justify-between font-mono text-[10px] font-bold ${localeCase(lang)} ${trackMeta(lang)}`}
            >
              <span>{t("game_prog")}</span>
              <span>{percent}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden bg-black/10">
              <div
                className="absolute top-0 start-0 h-full bg-[#ff2a2a] transition-all duration-200"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const navigateToHash = useCallback(
    (hash: string) => {
      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
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
    const moveCursor = (e: MouseEvent) => {
      if (cursorOuterRef.current) {
        cursorOuterRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isHoverable = target?.closest("a, button, .cursor-pointer");
      if (cursorInnerRef.current) {
        if (isHoverable) {
          cursorInnerRef.current.classList.add("scale-[3]", "bg-white");
          cursorInnerRef.current.classList.remove("bg-[#ff2a2a]");
        } else {
          cursorInnerRef.current.classList.remove("scale-[3]", "bg-white");
          cursorInnerRef.current.classList.add("bg-[#ff2a2a]");
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
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

      <ThreeScene scrollProgress={scrollProgress} />

      <main className="relative z-10 overflow-x-hidden pt-14 sm:pt-[3.75rem]">
        <SiteNav
          lang={lang}
          setLang={setLang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          scrolled={navScrolled}
          onNavigate={navigateToHash}
        />
        <MobileNavOverlay
          lang={lang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          setLang={setLang}
          prefersReducedMotion={reduceMotion}
          onNavigate={navigateToHash}
        />

        <section
          id="hero"
          tabIndex={-1}
          className="pointer-events-none relative flex min-h-[min(92svh,40rem)] flex-col items-center justify-center overflow-x-hidden px-4 sm:min-h-[85vh] lg:h-[120vh] lg:min-h-0"
        >
          <div className="absolute inset-0 flex w-full flex-col items-center justify-center mix-blend-difference text-[#EBE8E1]">
            <h2
              className={`relative z-10 max-w-[100%] text-center text-[clamp(2.75rem,16vw,24rem)] leading-[0.75] font-black select-none sm:text-[18vw] lg:text-[20vw] lg:whitespace-nowrap ${brandUppercase()} ${trackHeading(lang)}`}
              style={{ transform: `translateY(${scrollProgress * 200}px)` }}
            >
              MADBAK
            </h2>

            <p
              className="relative z-10 mt-6 max-w-[95vw] text-center select-none mix-blend-normal sm:mt-8 md:mt-12"
              style={{ transform: `translateY(${scrollProgress * 350}px)` }}
            >
              <span
                className={`inline-block max-w-[min(100%,42rem)] rounded-full border border-[#ff2a2a]/40 bg-[#0A0A0A]/90 px-3 py-1.5 text-[10px] font-light text-[#ff2a2a] shadow-[0_0_24px_rgba(255,42,42,0.18)] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs md:px-6 md:py-2.5 md:text-xl ${localeCase(lang)} ${heroSubTracking(lang)}`}
              >
                {t("hero_dev")}
              </span>
            </p>
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
                  className={`max-w-full break-words text-[clamp(1.875rem,8.5vw,3rem)] leading-[0.88] font-black sm:text-[clamp(1.875rem,7.5vw,2.85rem)] md:text-[clamp(1.75rem,6.25vw,2.65rem)] lg:text-[clamp(1.25rem,2.35vw,1.875rem)] xl:text-[clamp(1.35rem,2.55vw,2rem)] ${localeCase(lang)} ${trackHeading(lang)}`}
                >
                  {t("about_h1_1")}
                  <br />
                  {t("about_h1_2")}
                </h2>
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

        <section
          id="works"
          className="relative z-20 scroll-mt-[5.5rem] border-t border-black/10 bg-[#EBE8E1] py-16 sm:py-24 md:py-32"
        >
          <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 md:px-8 lg:max-w-[90vw]">
            <div
              className={`mb-8 flex justify-between border-t-2 border-black pt-4 font-mono text-[10px] sm:mb-12 md:mb-16 ${localeCase(lang)} ${trackMeta(lang)}`}
            >
              <span>{t("work_title")}</span>
              <span>({String(PROJECTS.length).padStart(2, "0")})</span>
            </div>

            <div className="flex flex-col">
              {PROJECTS.map((project) => {
                const title = project.langs[lang]?.title;
                const category = project.langs[lang]?.cat;
                const role = project.langs[lang]?.role;
                const context = project.langs[lang]?.context;

                return (
                  <div
                    key={project.id}
                    className="group relative cursor-pointer overflow-hidden border-b border-black/10 py-6 touch-manipulation transition-[filter] duration-200 [-webkit-tap-highlight-color:transparent] active:brightness-[0.97] sm:py-8 md:py-12 md:active:brightness-100"
                    onClick={() => setSelected(project)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(project);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="absolute inset-0 origin-bottom translate-y-full bg-[#0A0A0A] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                    <div className="relative z-10 flex flex-col items-start justify-between gap-4 transition-colors duration-300 group-hover:text-[#EBE8E1] md:flex-row md:items-center md:gap-10 lg:gap-12">
                      <div className="flex min-w-0 flex-1 items-center gap-6 sm:gap-8 md:w-2/3 md:gap-12 lg:gap-16">
                        <span className="hidden text-sm font-mono opacity-30 transition-opacity group-hover:opacity-100 md:block">
                          {project.id}
                        </span>

                        <div className="relative hidden h-16 w-16 shrink-0 origin-center overflow-hidden rounded-full border border-white/20 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 md:block md:h-24 md:w-24 md:scale-0">
                          <PortfolioImage
                            src={project.image}
                            alt={title ?? ""}
                            fill
                            sizes="128px"
                            className="h-full w-full"
                          />
                        </div>

                        <div className="relative min-w-0 flex-1">
                          <h3
                            className={`relative text-2xl leading-none font-black sm:text-4xl md:text-6xl lg:text-7xl ${localeCase(lang)} ${trackHeading(lang)}`}
                          >
                            <span className="relative z-10">
                              <ProjectTitleDisplay
                                project={project}
                                lang={lang}
                              />
                            </span>
                            <div
                              className={`absolute top-1/2 z-20 h-1 w-[110%] -translate-y-1/2 bg-[#ff2a2a] transition-transform duration-500 ease-out group-hover:scale-x-100 md:h-2 ${lang === "fa" ? "right-[-5%] origin-right" : "left-[-5%] origin-left"} scale-x-0`}
                            />
                          </h3>
                          <p
                            className={`mt-2 max-w-3xl font-mono text-[9px] leading-relaxed opacity-45 sm:text-[10px] ${localeCase(lang)} ${trackMeta(lang)}`}
                          >
                            <span className="tabular-nums">{project.year}</span>
                            <span className="mx-1.5 text-black/30">·</span>
                            {role}
                            <span className="mx-1.5 text-black/30">·</span>
                            {context}
                          </p>
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between gap-3 md:w-1/3 md:max-w-md md:gap-4 lg:max-w-lg">
                        <p
                          className={`min-w-0 flex-1 break-words text-end rtl:text-start font-mono text-[10px] opacity-50 group-hover:opacity-100 md:text-xs ${localeCase(lang)} ${trackMeta(lang)}`}
                        >
                          {category}
                        </p>
                        <div
                          className={`flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full border border-current transition-all duration-500 group-hover:rotate-0 group-hover:border-[#ff2a2a] group-hover:bg-[#ff2a2a] md:h-10 md:min-h-0 md:w-10 md:min-w-0 ${lang === "fa" ? "rotate-45" : "-rotate-45"}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 fill-none stroke-current stroke-2 ${lang === "fa" ? "rotate-180" : ""}`}
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="nfts"
          className="relative z-20 border-t border-black/10 bg-[#EBE8E1] px-4 py-16 text-[#0A0A0A] sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-16 lg:py-28"
        >
          <div className="relative mx-auto w-full max-w-[min(100%,80rem)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-[3px] shrink-0 bg-[#ff2a2a]" aria-hidden />
                <p
                  className={`font-sans text-xs font-semibold text-black/55 sm:text-[13px] ${localeCase(lang)} ${nftSub1Track(lang)}`}
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
                className={`max-w-full break-words text-[clamp(3.15rem,9.5vw,6.75rem)] leading-[0.88] font-black font-normal text-black sm:max-w-[20ch] ${localeCase(lang)} ${nftTitleTracking(lang)}`}
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
                        className={`mt-5 break-words text-[clamp(2rem,5vw,3.35rem)] leading-[1.02] font-black text-black ${localeCase(lang)} ${nftCardTitleTrack(lang)}`}
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
                          <dd className="mt-2 font-sans text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem]">
                            {category}
                          </dd>
                        </div>
                        <div>
                          <dt
                            className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${nftDtTrack(lang)}`}
                          >
                            {t("modal_year")}
                          </dt>
                          <dd className="mt-2 font-sans text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem]">
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

        <MiniGame t={t} lang={lang} />

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
