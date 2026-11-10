"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { GundamCursor } from "./GundamCursor";
import {
  CURSOR_MEDIA,
  EDITABLE_SELECTOR,
  INTERACTIVE_SELECTOR,
  type CursorInput,
} from "./cursor-motion";
import "./guardians.css";

const MODEL_PATH = "/models/gundam-guardian.glb";
/** Square canvas around the figure; leaves room for tilt and click motion. */
const SHELL_PX = 168;
/** MADLAB experiment pages run their own cursor-driven demos. */
const HIDDEN_ROUTE = /^\/lab\/(?!tutorials(?:\/|$))[^/]+/;

const ACTIVE_ATTR = "data-gundam-cursor";
const TEXT_ATTR = "data-gundam-text";

class CursorErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function CursorScene({
  inputRef,
  shellRef,
  onReady,
}: {
  inputRef: React.RefObject<CursorInput>;
  shellRef: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
}) {
  const gltf = useLoader(GLTFLoader, MODEL_PATH);
  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#fff8f0", "#0c0c0c", 0.75]} />
      <directionalLight position={[3.5, 5.5, 2.5]} intensity={1.55} />
      <directionalLight position={[-4, 2.5, 3]} intensity={0.55} color="#ffd7c2" />
      <directionalLight position={[0, 1, 5]} intensity={0.4} />
      <GundamCursor
        source={gltf.scene}
        inputRef={inputRef}
        shellRef={shellRef}
        onReady={onReady}
      />
    </>
  );
}

/**
 * The Gundam as a site-wide 3D cursor. Visual layer only: pointer-events none,
 * pointer state lives in refs, and the native/dot cursor behaviour is only
 * changed while the model is actually rendering.
 */
export function GuardianSystem() {
  const pathname = usePathname() || "/";
  const hiddenRoute = HIDDEN_ROUTE.test(pathname);
  const [supported, setSupported] = useState(true);
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<CursorInput>({
    x: 0,
    y: 0,
    snap: true,
    hover: false,
    pressed: false,
    released: false,
  });

  const enabled = supported && !failed && !hiddenRoute;
  const fail = useCallback(() => setFailed(true), []);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const fine = window.matchMedia(CURSOR_MEDIA);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSupported(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const input = inputRef.current;
    let inside = false;
    let editable = false;

    const syncVisible = () => {
      const shell = shellRef.current;
      if (shell) shell.dataset.visible = inside && !editable ? "true" : "false";
      root.toggleAttribute(TEXT_ATTR, inside && editable);
    };

    const classify = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      editable = Boolean(el?.closest(EDITABLE_SELECTOR));
      input.hover = !editable && Boolean(el?.closest(INTERACTIVE_SELECTOR));
      syncVisible();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      input.x = e.clientX;
      input.y = e.clientY;
      if (!inside) {
        inside = true;
        input.snap = true;
        classify(e.target);
        setRunning(document.visibilityState === "visible");
      }
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "mouse") classify(e.target);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) input.pressed = true;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !input.pressed) return;
      input.pressed = false;
      input.released = true;
    };
    const onLeave = () => {
      inside = false;
      input.pressed = false;
      syncVisible();
      setRunning(false);
    };
    const onVisibility = () => {
      setRunning(inside && document.visibilityState === "visible");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeAttribute(TEXT_ATTR);
      input.hover = false;
      input.pressed = false;
      input.snap = true;
      setRunning(false);
      setReady(false);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready) return;
    const root = document.documentElement;
    root.setAttribute(ACTIVE_ATTR, "");
    return () => root.removeAttribute(ACTIVE_ATTR);
  }, [enabled, ready]);

  if (!enabled) return null;

  return (
    <div
      ref={shellRef}
      className="gundam-cursor"
      aria-hidden="true"
      data-visible="false"
      style={{ width: SHELL_PX, height: SHELL_PX }}
    >
      <CursorErrorBoundary onError={fail}>
        <Canvas
          className="gundam-cursor__canvas"
          dpr={[1, 2]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ fov: 22, near: 0.01, far: 50, position: [0, 0, 6] }}
          frameloop={running ? "always" : "never"}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.domElement.addEventListener("webglcontextlost", fail, { once: true });
          }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Suspense fallback={null}>
            <CursorScene inputRef={inputRef} shellRef={shellRef} onReady={markReady} />
          </Suspense>
        </Canvas>
      </CursorErrorBoundary>
    </div>
  );
}
