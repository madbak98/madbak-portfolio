"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Mesh, PerspectiveCamera, Vector3, type Group, type Object3D } from "three";

import {
  FIGURE_PX,
  FOLLOW_LAMBDA,
  clamp,
  damp,
  smoothstep,
  type CursorInput,
} from "./cursor-motion";
import { prepareGundamCursor } from "./prepareGuardian";

const FOV = 22;

type GundamCursorProps = {
  source: Object3D;
  inputRef: React.RefObject<CursorInput>;
  shellRef: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
};

/**
 * The Gundam as the pointer. The prepared root's origin is the fist tip, so
 * every rotation and scale here pivots around the hotspot; the shell element
 * is then translated so that tip lands exactly on the smoothed pointer.
 */
export function GundamCursor({ source, inputRef, shellRef, onReady }: GundamCursorProps) {
  const prepared = useMemo(() => prepareGundamCursor(source), [source]);
  const rootRef = useRef<Group>(null);
  const getThree = useThree((s) => s.get);
  const size = useThree((s) => s.size);

  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    still: 0,
    hover: 0,
    press: 0,
    tap: 0,
    ready: false,
  });
  const tip = useMemo(() => new Vector3(), []);

  useEffect(
    () => () => {
      prepared.root.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          (m as { map?: { dispose: () => void } | null }).map?.dispose();
          m.dispose();
        });
      });
    },
    [prepared],
  );

  // Frame the posed figure: FIGURE_PX tall, centred, tip off-centre toward the top-left.
  useLayoutEffect(() => {
    const camera = getThree().camera;
    if (!(camera instanceof PerspectiveCamera) || size.height === 0) return;
    const bounds = prepared.bounds;
    const center = bounds.getCenter(new Vector3());
    const height = Math.max(bounds.max.y - bounds.min.y, 1e-3);
    const unitsPerPx = height / FIGURE_PX;
    const viewHeight = size.height * unitsPerPx;
    const distance = viewHeight / (2 * Math.tan((FOV * Math.PI) / 360));
    camera.fov = FOV;
    camera.aspect = size.width / size.height;
    camera.near = Math.max(distance - 4, 0.01);
    camera.far = distance + 4;
    camera.position.set(center.x, center.y, distance);
    camera.lookAt(center.x, center.y, 0);
    camera.updateProjectionMatrix();
  }, [getThree, size.width, size.height, prepared]);

  useFrame((frame, rawDt) => {
    const root = rootRef.current;
    const shell = shellRef.current;
    const input = inputRef.current;
    if (!root || !shell || !input) return;

    const dt = Math.min(rawDt, 1 / 20);
    const s = state.current;

    if (input.snap) {
      s.x = input.x;
      s.y = input.y;
      s.vx = 0;
      s.vy = 0;
      input.snap = false;
    }

    const prevX = s.x;
    const prevY = s.y;
    s.x = damp(s.x, input.x, FOLLOW_LAMBDA, dt);
    s.y = damp(s.y, input.y, FOLLOW_LAMBDA, dt);
    const step = Math.max(dt, 1 / 240);
    s.vx = damp(s.vx, (s.x - prevX) / step, 9, dt);
    s.vy = damp(s.vy, (s.y - prevY) / step, 9, dt);

    const speed = Math.hypot(s.vx, s.vy);
    s.still = speed < 24 ? s.still + dt : 0;
    const idle = smoothstep(0.35, 1.4, s.still);

    if (input.released) {
      input.released = false;
      s.tap = 1;
    }
    s.hover = damp(s.hover, input.hover ? 1 : 0, 10, dt);
    s.press = damp(s.press, input.pressed ? 1 : 0, 22, dt);
    s.tap = damp(s.tap, 0, 7.5, dt);
    // Overshoot shape for the release: quick forward jab, then settle.
    const jab = Math.sin(s.tap * Math.PI) * s.tap;

    const t = frame.clock.elapsedTime;
    const breathe = Math.sin(t * 1.6);
    const sway = Math.sin(t * 0.55);

    // Body hangs below-right of the fist and trails the motion like a pendulum.
    const roll =
      clamp(-s.vx * 0.00032, -0.32, 0.32) +
      clamp(s.vy * 0.00012, -0.1, 0.1) +
      sway * 0.035 * idle;
    const yaw =
      clamp(s.vx * 0.00045, -0.38, 0.38) +
      s.hover * 0.3 +
      Math.sin(t * 0.37) * 0.07 * idle;
    const pitch =
      clamp(-s.vy * 0.0002, -0.16, 0.16) +
      s.hover * 0.08 -
      s.press * 0.16 +
      jab * 0.26 +
      breathe * 0.02 * idle;
    const scale = 1 + s.hover * 0.08 - s.press * 0.1 + jab * 0.06 + breathe * 0.008 * idle;

    root.rotation.set(pitch, yaw, roll);
    root.scale.setScalar(scale);
    root.updateMatrixWorld();

    // Keep the fist tip glued to the pointer, whatever the pose.
    tip.set(0, 0, 0);
    root.localToWorld(tip);
    tip.project(frame.camera);
    const tipX = ((tip.x + 1) / 2) * size.width;
    const tipY = ((1 - tip.y) / 2) * size.height;
    shell.style.transform = `translate3d(${(s.x - tipX).toFixed(2)}px, ${(s.y - tipY).toFixed(2)}px, 0)`;

    if (!s.ready) {
      s.ready = true;
      onReady();
    }
  });

  return (
    <group ref={rootRef}>
      <primitive object={prepared.root} />
    </group>
  );
}
