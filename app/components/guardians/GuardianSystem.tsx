"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Guardian, type SharedGuardianInput } from "./Guardian";
import { GUARDIAN, moodForRoute, SECTION_MOODS, type SectionMood } from "./guardian-motion";
import "./guardians.css";

const MODEL_PATH = "/models/gundam-guardian.glb";

const HOME_SECTION_IDS = [
  "hero",
  "about",
  "websites",
  "madlab",
  "contact",
] as const;

function mapHomeSectionToMoodKey(sectionId: string | null): string | null {
  if (!sectionId) return null;
  if (sectionId === "hero") return "home";
  if (sectionId === "websites") return "works";
  if (sectionId === "madlab") return "lab";
  return sectionId;
}

class GuardianErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Decorative only — never crash the page
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function GuardianWorld({
  inputRef,
  visible,
}: {
  inputRef: React.MutableRefObject<SharedGuardianInput>;
  visible: boolean;
}) {
  const gltf = useLoader(GLTFLoader, MODEL_PATH);
  const invalidate = useThree((s) => s.invalidate);
  const source = useMemo(() => gltf.scene, [gltf]);
  const animations = useMemo(() => gltf.animations ?? [], [gltf]);

  useFrame((state) => {
    inputRef.current.time = state.clock.elapsedTime;
    if (visible && !inputRef.current.reducedMotion) {
      invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#fff8f0", "#0c0c0c", 0.75]} />
      <directionalLight position={[3.5, 5.5, 2.5]} intensity={1.55} />
      <directionalLight position={[-4, 2.5, 3]} intensity={0.55} color="#ffd7c2" />
      <directionalLight position={[0, 1, 5]} intensity={0.4} />
      <Guardian
        source={source}
        animations={animations}
        config={GUARDIAN}
        inputRef={inputRef}
        visible={visible}
      />
    </>
  );
}

/**
 * Single Guardian — one model, one motion system.
 * Pointer-events none; never blocks Pet / nav / console.
 */
export function GuardianSystem() {
  const pathname = usePathname() || "/";
  const prefersReduced = useReducedMotion();
  const reducedMotion = Boolean(prefersReduced);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<SharedGuardianInput>({
    pointerX: 0,
    pointerY: 0,
    hasPointer: 0,
    scrollVel: 0,
    scrollDir: 0,
    mood: SECTION_MOODS.home,
    reducedMotion: false,
    time: 0,
    sizeScale: 1,
    isMobile: false,
  });

  const moodRef = useRef<SectionMood>(SECTION_MOODS.home);
  const scrollRef = useRef({ lastY: 0, lastT: 0, vel: 0, dir: 0 });

  useEffect(() => {
    inputRef.current.reducedMotion = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const syncSize = () => {
      const w = window.innerWidth;
      // Desktop 1 → tablet ~0.85 → mobile ~0.68 of already-reduced model
      if (w < 480) {
        inputRef.current.sizeScale = 0.65;
        inputRef.current.isMobile = true;
      } else if (w < 768) {
        inputRef.current.sizeScale = 0.75;
        inputRef.current.isMobile = true;
      } else if (w < 1024) {
        inputRef.current.sizeScale = 0.88;
        inputRef.current.isMobile = false;
      } else {
        inputRef.current.sizeScale = 1;
        inputRef.current.isMobile = false;
      }
    };
    syncSize();
    window.addEventListener("resize", syncSize, { passive: true });
    return () => window.removeEventListener("resize", syncSize);
  }, []);

  useEffect(() => {
    const syncMood = (sectionId: string | null) => {
      const mood = moodForRoute(pathname, sectionId);
      moodRef.current = mood;
      inputRef.current.mood = mood;
    };

    syncMood(null);

    if (pathname !== "/" && pathname !== "") return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let best: string | null = null;
        let bestR = 0;
        ratios.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            best = id;
          }
        });
        syncMood(mapHomeSectionToMoodKey(best));
      },
      { threshold: [0.12, 0.28, 0.45, 0.6], rootMargin: "-10% 0px -18% 0px" },
    );

    HOME_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const onScrollSections = () => {
      let best: string | null = null;
      let bestScore = -1;
      HOME_SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const visible =
          Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (visible > bestScore) {
          bestScore = visible;
          best = id;
        }
      });
      syncMood(mapHomeSectionToMoodKey(best));
    };
    window.addEventListener("scroll", onScrollSections, { passive: true });
    onScrollSections();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScrollSections);
    };
  }, [pathname]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncPointerCapability = () => {
      if (!fine.matches) {
        inputRef.current.hasPointer = 0;
        inputRef.current.pointerX = 0;
        inputRef.current.pointerY = 0;
      }
    };
    syncPointerCapability();
    fine.addEventListener("change", syncPointerCapability);

    const onPointer = (e: PointerEvent) => {
      if (!fine.matches) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      inputRef.current.pointerX = (e.clientX / w) * 2 - 1;
      inputRef.current.pointerY = -((e.clientY / h) * 2 - 1);
      inputRef.current.hasPointer = 1;
    };
    const onLeave = () => {
      inputRef.current.hasPointer = 0;
    };

    scrollRef.current.lastY = window.scrollY;
    scrollRef.current.lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max((now - scrollRef.current.lastT) / 1000, 1 / 120);
      const dy = y - scrollRef.current.lastY;
      const raw = Math.abs(dy) / dt / 1800;
      scrollRef.current.vel =
        scrollRef.current.vel * 0.72 + Math.min(raw, 1.4) * 0.28;
      scrollRef.current.dir = dy === 0 ? 0 : dy > 0 ? 1 : -1;
      scrollRef.current.lastY = y;
      scrollRef.current.lastT = now;
      inputRef.current.scrollVel = scrollRef.current.vel;
      inputRef.current.scrollDir = scrollRef.current.dir;
    };

    let raf = 0;
    const decay = () => {
      scrollRef.current.vel *= 0.92;
      if (scrollRef.current.vel < 0.02) {
        scrollRef.current.vel = 0;
        scrollRef.current.dir = 0;
      }
      inputRef.current.scrollVel = scrollRef.current.vel;
      inputRef.current.scrollDir = scrollRef.current.dir;
      raf = window.requestAnimationFrame(decay);
    };
    raf = window.requestAnimationFrame(decay);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      fine.removeEventListener("change", syncPointerCapability);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);

    const el = shellRef.current;
    let io: IntersectionObserver | null = null;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => setInView(Boolean(entry?.isIntersecting)),
        { threshold: 0.01 },
      );
      io.observe(el);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const hideOnRoute = /^\/lab\/(?!tutorials(?:\/|$))[^/]+/.test(pathname);
  if (hideOnRoute) return null;

  const active = inView && tabVisible;

  return (
    <div
      ref={shellRef}
      className="site-guardians"
      aria-hidden="true"
      data-reduced={reducedMotion ? "true" : "false"}
    >
      <GuardianErrorBoundary>
        <Canvas
          className="site-guardians__canvas"
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ position: [0, 0.35, 5.6], fov: 36, near: 0.1, far: 40 }}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Suspense fallback={null}>
            <GuardianWorld inputRef={inputRef} visible={active} />
          </Suspense>
        </Canvas>
      </GuardianErrorBoundary>
    </div>
  );
}
