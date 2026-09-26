"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import {
  Box3,
  BufferAttribute,
  ClampToEdgeWrapping,
  Color,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  VideoTexture,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import "./game-console-3d.css";

const MODEL_PATH = "/models/game-console.glb";

/** Play in order, then loop the playlist. */
const VIDEO_PLAYLIST = [
  "/videos/fight-console-game.mp4",
  "/videos/game-console-screen.mp4",
] as const;

/** One shared HTMLVideoElement + VideoTexture for the console playlist. */
const videoCache = new Map<
  string,
  {
    video: HTMLVideoElement;
    texture: VideoTexture;
    users: number;
    index: number;
    warmer: HTMLVideoElement | null;
  }
>();

function acquireConsoleVideo(playlist: readonly string[]) {
  const key = playlist.join("|");
  let entry = videoCache.get(key);
  if (!entry) {
    const video = document.createElement("video");
    video.src = playlist[0]!;
    video.crossOrigin = "anonymous";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    // metadata only — avoid pulling full 5MB+ on mount
    video.preload = "metadata";

    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;

    // Second clip warmer is created lazily near end of current clip
    entry = { video, texture, users: 0, index: 0, warmer: null };
    videoCache.set(key, entry);
  }
  entry.users += 1;
  return entry;
}

function warmNextConsoleClip(
  entry: {
    warmer: HTMLVideoElement | null;
  },
  playlist: readonly string[],
  currentIndex: number,
) {
  const nextSrc = playlist[(currentIndex + 1) % playlist.length];
  if (!nextSrc || playlist.length < 2) return;
  if (entry.warmer) {
    if (entry.warmer.getAttribute("src") === nextSrc) return;
    entry.warmer.pause();
    entry.warmer.removeAttribute("src");
    entry.warmer.load();
  }
  const warmer = document.createElement("video");
  warmer.preload = "auto";
  warmer.muted = true;
  warmer.playsInline = true;
  warmer.src = nextSrc;
  warmer.load();
  entry.warmer = warmer;
}

function releaseConsoleVideo(key: string) {
  const entry = videoCache.get(key);
  if (!entry) return;
  entry.users -= 1;
  if (entry.users > 0) return;
  entry.video.pause();
  entry.video.removeAttribute("src");
  entry.video.load();
  entry.texture.dispose();
  if (entry.warmer) {
    entry.warmer.pause();
    entry.warmer.removeAttribute("src");
    entry.warmer.load();
    entry.warmer = null;
  }
  videoCache.delete(key);
}

/** Decorative GLB must never crash the About section. */
class ConsoleErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Swallow — Pet / dialogue stay usable
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/** Flat 4-vert LCD quad in the GLB (Mesh001). */
function isLcdMesh(obj: Mesh): boolean {
  const count = obj.geometry?.attributes?.position?.count;
  if (count !== 4) return false;
  const box = new Box3().setFromObject(obj);
  const size = new Vector3();
  box.getSize(size);
  return size.z < 0.02 && size.x > 0.4 && size.y > 0.3;
}

/**
 * GLB screen quad has no UVs — generate planar UVs from local XY.
 * `mirrorU` compensates for console scale.x = -1 (EN). FA uses scale.x = +1 → mirrorU false.
 * Never flip via negative texture.repeat — ClampToEdge + VideoTexture breaks that.
 */
function ensureLcdUvs(mesh: Mesh, mirrorU: boolean) {
  const geom = mesh.geometry;
  // Always rewrite — orientation can change with lang without a new GLB clone source
  const pos = geom.attributes.position;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const spanX = Math.max(maxX - minX, 1e-6);
  const spanY = Math.max(maxY - minY, 1e-6);
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) - minX) / spanX;
    uvs[i * 2] = mirrorU ? 1 - u : u;
    uvs[i * 2 + 1] = (pos.getY(i) - minY) / spanY;
  }
  geom.setAttribute("uv", new BufferAttribute(uvs, 2));
  geom.attributes.uv.needsUpdate = true;
}

function applyCoverUv(texture: VideoTexture, screenAspect: number) {
  const video = texture.image as HTMLVideoElement | undefined;
  const vw = video?.videoWidth || 16;
  const vh = video?.videoHeight || 9;
  const videoAspect = vw / Math.max(vh, 1);

  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  // Reset any prior negative-repeat flip from older FA builds
  texture.center.set(0, 0);
  texture.rotation = 0;

  if (videoAspect > screenAspect) {
    const s = screenAspect / videoAspect;
    texture.repeat.set(s, 1);
    texture.offset.set((1 - s) / 2, 0);
  } else {
    const s = videoAspect / screenAspect;
    texture.repeat.set(1, s);
    texture.offset.set(0, (1 - s) / 2);
  }

  texture.needsUpdate = true;
}

function prepareConsole(
  scene: Object3D,
  texture: VideoTexture,
  /** true when console group scale.x is -1 (EN). */
  mirrorU: boolean,
) {
  const root = scene.clone(true);
  let screenAspect = 16 / 9;

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.castShadow = false;
    obj.receiveShadow = false;

    if (isLcdMesh(obj)) {
      obj.geometry = obj.geometry.clone();
      ensureLcdUvs(obj, mirrorU);
      const box = new Box3().setFromObject(obj);
      const size = new Vector3();
      box.getSize(size);
      screenAspect = size.x / Math.max(size.y, 0.001);
      obj.material = new MeshBasicMaterial({
        map: texture,
        toneMapped: false,
        side: DoubleSide,
      });
      return;
    }

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((mat, index) => {
      if (!mat) return;
      const next = new MeshStandardMaterial({
        color: mat.color?.clone?.() ?? new Color("#c8c4bc"),
        metalness: 0.12,
        roughness: 0.55,
        side: DoubleSide,
      });
      if (Array.isArray(obj.material)) obj.material[index] = next;
      else obj.material = next;
    });
  });

  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  root.scale.setScalar(3.4 / maxDim);
  root.updateMatrixWorld(true);

  return { root, screenAspect };
}

function useConsoleVideo(playlist: readonly string[]) {
  const [soundOn, setSoundOn] = useState(false);
  const [generation, setGeneration] = useState(0);
  const key = playlist.join("|");

  useEffect(() => {
    const entry = acquireConsoleVideo(playlist);
    const { video } = entry;

    const playAt = (index: number) => {
      entry.index = index;
      const nextSrc = playlist[index]!;
      const current = video.getAttribute("src") || video.currentSrc || "";
      if (!current.endsWith(nextSrc)) {
        video.src = nextSrc;
        video.preload = "auto";
        const onReady = () => {
          void video.play().catch(() => {});
        };
        video.addEventListener("loadeddata", onReady, { once: true });
        video.load();
        return;
      }
      void video.play().catch(() => {});
    };

    const onEnded = () => {
      playAt((entry.index + 1) % playlist.length);
    };

    // Warm next clip only when current is nearly finished (~2s left)
    const onTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (video.duration - video.currentTime > 2.5) return;
      warmNextConsoleClip(entry, playlist, entry.index);
    };

    video.loop = false;
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);

    const tryPlay = () => {
      if (document.hidden) return;
      video.preload = "auto";
      void video.play().catch(() => {});
    };
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("loadeddata", tryPlay, { once: true });

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    queueMicrotask(() => setGeneration((g) => g + 1));

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      document.removeEventListener("visibilitychange", onVisibility);
      releaseConsoleVideo(key);
    };
  }, [key, playlist]);

  useEffect(() => {
    const entry = videoCache.get(key);
    if (!entry) return;
    entry.video.muted = !soundOn;
    if (soundOn && !document.hidden) void entry.video.play().catch(() => {});
  }, [key, soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => !on);
  }, []);

  const entry = generation > 0 ? videoCache.get(key) : undefined;

  return {
    texture: entry?.texture ?? null,
    video: entry?.video ?? null,
    soundOn,
    toggleSound,
    ready: Boolean(entry),
    generation,
  };
}

function ConsoleModel({
  texture,
  video,
  generation,
  /** Persian/RTL: horizontal mirror of the EN console orientation. */
  mirrorHorizontal,
}: {
  texture: VideoTexture;
  video: HTMLVideoElement;
  generation: number;
  mirrorHorizontal: boolean;
}) {
  const gltf = useLoader(GLTFLoader, MODEL_PATH);
  const invalidate = useThree((s) => s.invalidate);

  // EN: scale.x = -1 → bake mirrored U. FA: scale.x = +1 → bake normal U.
  const scaleX = mirrorHorizontal ? 1 : -1;
  const mirrorU = !mirrorHorizontal;

  const prepared = useMemo(
    () => prepareConsole(gltf.scene, texture, mirrorU),
    // generation forces remount after Strict Mode video reacquire
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
    [gltf, texture, generation, mirrorU],
  );

  useLayoutEffect(() => {
    const apply = () => {
      applyCoverUv(texture, prepared.screenAspect);
      invalidate();
    };

    if (video.videoWidth > 0) apply();
    // Re-fit when playlist advances (landscape → portrait, etc.)
    video.addEventListener("loadedmetadata", apply);

    // Demand frameloop: drive frames from video playback only
    let raf = 0;
    let running = true;
    const tick = () => {
      if (!running) return;
      if (!video.paused && !video.ended && video.readyState >= 2) {
        texture.needsUpdate = true;
        invalidate();
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    invalidate();

    return () => {
      running = false;
      video.removeEventListener("loadedmetadata", apply);
      window.cancelAnimationFrame(raf);
    };
  }, [prepared.screenAspect, texture, video, invalidate, generation, mirrorU]);

  return (
    <group rotation={[0.1, 0.18, 0]} scale={[scaleX, 1, 1]}>
      <primitive object={prepared.root} />
    </group>
  );
}

type GameConsole3DProps = {
  className?: string;
  lang?: "en" | "fa";
};

/**
 * Static handheld game-console with LCD VideoTexture (+ sound toggle).
 * Video/audio are independent of Pet dialogue.
 */
export function GameConsole3D({ className = "", lang = "en" }: GameConsole3DProps) {
  const { texture, video, soundOn, toggleSound, ready, generation } =
    useConsoleVideo(VIDEO_PLAYLIST);

  const soundLabel =
    lang === "fa"
      ? soundOn
        ? "قطع صدای کنسول"
        : "روشن کردن صدای کنسول"
      : soundOn
        ? "Turn console sound off"
        : "Turn console sound on";

  const soundText =
    lang === "fa"
      ? soundOn
        ? "صدا روشن"
        : "صدا خاموش"
      : soundOn
        ? "SOUND ON"
        : "SOUND OFF";

  return (
    <div className={["game-console-3d", className].filter(Boolean).join(" ")}>
      <div className="game-console-3d__viewport" aria-hidden="true">
        <ConsoleErrorBoundary>
          <Canvas
            className="game-console-3d__canvas"
            dpr={[1, 1.5]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
              premultipliedAlpha: false,
              failIfMajorPerformanceCaveat: false,
            }}
            camera={{ position: [0.32, 0.16, 7.6], fov: 36, near: 0.05, far: 100 }}
            frameloop="demand"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <ambientLight intensity={1.4} />
            <hemisphereLight args={["#ffffff", "#8a8680", 0.9]} />
            <directionalLight position={[3, 4, 2.5]} intensity={1.7} />
            <directionalLight position={[-2.5, 1.5, -2]} intensity={0.5} />
            <Suspense fallback={null}>
              {ready && texture && video ? (
                <ConsoleModel
                  texture={texture}
                  video={video}
                  generation={generation}
                  mirrorHorizontal={lang === "fa"}
                />
              ) : null}
            </Suspense>
          </Canvas>
        </ConsoleErrorBoundary>
      </div>

      <button
        type="button"
        className={[
          "game-console-3d__sound",
          soundOn ? "is-on" : "is-off",
        ].join(" ")}
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundLabel}
      >
        {soundText}
      </button>
    </div>
  );
}
