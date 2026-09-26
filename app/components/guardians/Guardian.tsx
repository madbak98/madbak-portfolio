"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Object3D, type AnimationClip } from "three";

import {
  GUARDIAN,
  LEAN_PITCH_MAX,
  LEAN_ROLL_MAX,
  LOOK_PITCH_MAX,
  LOOK_YAW_MAX,
  MOVE_PITCH_MAX,
  MOVE_ROLL_MAX,
  MOVE_YAW_MAX,
  clamp,
  clampToZone,
  damp,
  pickMicroAction,
  pickNearbyTarget,
  seededRange,
  seededUnit,
  softNoise,
  smoothstep,
  type BehaviorPhase,
  type GuardianConfig,
  type MicroAction,
  type SectionMood,
} from "./guardian-motion";
import { prepareGuardianRoot } from "./prepareGuardian";

export type SharedGuardianInput = {
  pointerX: number;
  pointerY: number;
  hasPointer: number;
  scrollVel: number;
  scrollDir: number;
  mood: SectionMood;
  reducedMotion: boolean;
  time: number;
  /** Viewport scale: 1 desktop → ~0.7 mobile */
  sizeScale: number;
  isMobile: boolean;
};

type GuardianProps = {
  source: Object3D;
  animations?: AnimationClip[];
  config?: GuardianConfig;
  inputRef: React.MutableRefObject<SharedGuardianInput>;
  visible: boolean;
};

type PatrolState = {
  phase: BehaviorPhase;
  phaseEndsAt: number;
  seed: number;
  pos: [number, number, number];
  from: [number, number, number];
  target: [number, number, number];
  moveStart: number;
  moveDur: number;
  actionYaw: number;
  actionPitch: number;
  actionYawTarget: number;
  actionPitchTarget: number;
  leanRollTarget: number;
  leanPitchTarget: number;
  micro: MicroAction | null;
  scanDir: number;
  retreatActive: boolean;
};

/**
 * Single autonomous Guardian.
 *
 * Hierarchy (additive layers — never fight clip tracks on the mesh):
 *   flight (position)
 *     → lean (accel response)
 *       → look (attention / scan)
 *         → stabilize (micro mechanical)
 *           → sizeScale
 *             → prepared mesh (+ optional AnimationMixer)
 *
 * Source FBX: rigid mesh, Take 001 has no usable keyframe channels.
 * Procedural motion provides the living character behavior.
 */
export function Guardian({
  source,
  animations = [],
  config = GUARDIAN,
  inputRef,
  visible,
}: GuardianProps) {
  const flightRef = useRef<Group>(null);
  const leanRef = useRef<Group>(null);
  const lookRef = useRef<Group>(null);
  const stabilizeRef = useRef<Group>(null);
  const scaleRef = useRef<Group>(null);

  const prepared = useMemo(
    () => prepareGuardianRoot(source, animations),
    [source, animations],
  );

  const delayed = useRef({
    lookYaw: config.baseYaw,
    lookPitch: 0,
    queue: [] as Array<{ t: number; yaw: number; pitch: number }>,
  });

  const patrol = useRef<PatrolState>({
    phase: "hover",
    phaseEndsAt: 1.4 + config.idlePhase,
    seed: 19 + config.idlePhase * 13,
    pos: [...config.home],
    from: [...config.home],
    target: [...config.home],
    moveStart: 0,
    moveDur: 3.5,
    actionYaw: 0,
    actionPitch: 0,
    actionYawTarget: 0,
    actionPitchTarget: 0,
    leanRollTarget: 0,
    leanPitchTarget: 0,
    micro: null,
    scanDir: 1,
    retreatActive: false,
  });

  const motion = useRef({
    yaw: config.baseYaw,
    pitch: 0,
    roll: 0,
    leanRoll: 0,
    leanPitch: 0,
    flightYaw: 0,
    flightPitch: 0,
    flightRoll: 0,
    breathe: 0,
    scrollLean: 0,
    velX: 0,
    velY: 0,
    prevX: config.home[0],
    prevY: config.home[1],
  });

  useFrame((_, rawDt) => {
    if (
      !visible ||
      !flightRef.current ||
      !leanRef.current ||
      !lookRef.current ||
      !stabilizeRef.current ||
      !scaleRef.current
    ) {
      return;
    }

    const dt = Math.min(rawDt, 0.05);
    const input = inputRef.current;
    const st = patrol.current;
    const m = motion.current;
    const t = input.time + config.idlePhase;

    prepared.mixer?.update(dt);
    scaleRef.current.scale.setScalar(input.sizeScale);

    if (input.reducedMotion) {
      flightRef.current.position.set(
        config.home[0],
        config.home[1],
        config.home[2],
      );
      leanRef.current.rotation.set(0, 0, 0);
      lookRef.current.rotation.set(0, config.baseYaw, 0);
      stabilizeRef.current.position.set(0, 0, 0);
      stabilizeRef.current.rotation.set(0, 0, 0);
      return;
    }

    // ——— Cursor attention (orientation only) ———
    const px = input.pointerX;
    const py = input.pointerY;
    const sideX = config.ambientSide;
    const dist = Math.hypot(px - sideX * 0.55, py * 0.5);
    const nearFactor = input.isMobile
      ? 0
      : 1 - softSmooth(dist, 0.1, 1.2);
    const attentionRaw =
      input.hasPointer *
      nearFactor *
      config.attentionStrength *
      input.mood.attention;

    // Occasional look toward hero center when idle
    const centerPull =
      st.phase === "hover" || st.phase === "idle"
        ? softNoise(t * 0.11, 4.2) * 0.04
        : 0;

    const cursorYaw =
      config.baseYaw +
      input.mood.yawBias * 0.08 +
      centerPull +
      clamp(px * LOOK_YAW_MAX * config.trackingStrength, -LOOK_YAW_MAX, LOOK_YAW_MAX) *
        attentionRaw +
      config.ambientSide * 0.025 * (1 - attentionRaw);

    const cursorPitch =
      clamp(-py * LOOK_PITCH_MAX * config.trackingStrength, -LOOK_PITCH_MAX, LOOK_PITCH_MAX) *
        attentionRaw +
      softNoise(t * 0.09, 7.1) * 0.012 * (1 - attentionRaw * 0.5);

    delayed.current.queue.push({
      t: input.time + config.reactionDelay,
      yaw: cursorYaw,
      pitch: cursorPitch,
    });
    if (delayed.current.queue.length > 24) {
      delayed.current.queue.splice(0, delayed.current.queue.length - 24);
    }
    while (
      delayed.current.queue.length &&
      delayed.current.queue[0]!.t <= input.time
    ) {
      const next = delayed.current.queue.shift()!;
      delayed.current.lookYaw = next.yaw;
      delayed.current.lookPitch = next.pitch;
    }

    // Enter attention phase when cursor is close
    if (
      attentionRaw > 0.55 &&
      (st.phase === "hover" || st.phase === "idle") &&
      input.time > st.phaseEndsAt - 0.2
    ) {
      enterPhase(st, config, "attention", input.time, 1.4 + seededRange(st.seed, 0, 0.8));
    }

    // ——— Scroll reaction ———
    const scrollStrength = clamp(input.scrollVel, 0, 1.2);
    const scrollTarget =
      scrollStrength *
      input.scrollDir *
      0.045 *
      input.mood.alert *
      config.attentionStrength;
    m.scrollLean = damp(m.scrollLean, scrollTarget, 2.8, dt);

    // Fast scroll → temporary edge retreat (not display:none)
    if (scrollStrength > 0.55 && !st.retreatActive && st.phase !== "retreat") {
      st.retreatActive = true;
      enterPhase(
        st,
        config,
        "retreat",
        input.time,
        1.6 + seededRange(st.seed, 0, 0.9),
      );
    }
    if (scrollStrength < 0.08 && st.retreatActive && st.phase !== "retreat") {
      st.retreatActive = false;
    }
    if (
      scrollStrength > 0.35 &&
      st.phase !== "retreat" &&
      st.phase !== "reaction" &&
      seededUnit(st.seed + Math.floor(input.time * 2)) < 0.04
    ) {
      enterPhase(
        st,
        config,
        "reaction",
        input.time,
        0.7 + seededRange(st.seed, 0, 0.5),
      );
    }

    // ——— Patrol / flight state machine ———
    advancePatrol(st, config, input.time);

    const activeZone = st.phase === "retreat" ? config.retreatZone : config.zone;
    const [tx, ty, tz] = clampToZone(st.pos[0], st.pos[1], st.pos[2], activeZone);

    // Extra positional damp for mass feel
    const posLambda = st.phase === "patrol" ? 3.6 : 4.4;
    flightRef.current.position.x = damp(
      flightRef.current.position.x,
      tx,
      posLambda,
      dt,
    );
    flightRef.current.position.y = damp(
      flightRef.current.position.y,
      ty + m.breathe * 0.35 - Math.abs(m.scrollLean) * 0.025,
      posLambda,
      dt,
    );
    flightRef.current.position.z = damp(
      flightRef.current.position.z,
      tz,
      posLambda,
      dt,
    );

    // Velocity for lean
    const vx =
      (flightRef.current.position.x - m.prevX) / Math.max(dt, 1 / 120);
    const vy =
      (flightRef.current.position.y - m.prevY) / Math.max(dt, 1 / 120);
    m.velX = damp(m.velX, vx, 6, dt);
    m.velY = damp(m.velY, vy, 6, dt);
    m.prevX = flightRef.current.position.x;
    m.prevY = flightRef.current.position.y;

    // Flight facing + body lean from acceleration
    const flightYawT = clamp(m.velX * 0.55, -MOVE_YAW_MAX, MOVE_YAW_MAX);
    const flightPitchT = clamp(m.velY * 0.4, -MOVE_PITCH_MAX, MOVE_PITCH_MAX);
    const flightRollT = clamp(-m.velX * 0.35, -MOVE_ROLL_MAX, MOVE_ROLL_MAX);
    m.flightYaw = damp(m.flightYaw, flightYawT, 2.5, dt);
    m.flightPitch = damp(m.flightPitch, flightPitchT, 2.6, dt);
    m.flightRoll = damp(m.flightRoll, flightRollT, 2.3, dt);

    const leanRollT = clamp(-m.velX * 0.5, -LEAN_ROLL_MAX, LEAN_ROLL_MAX);
    const leanPitchT = clamp(m.velY * 0.35, -LEAN_PITCH_MAX, LEAN_PITCH_MAX);
    // Settle returns upright
    const leanMul =
      st.phase === "settle" || st.phase === "idle" ? 0.15 : 1;
    m.leanRoll = damp(m.leanRoll, leanRollT * leanMul, 2.2, dt);
    m.leanPitch = damp(m.leanPitch, leanPitchT * leanMul, 2.2, dt);
    leanRef.current.rotation.set(m.leanPitch, 0, m.leanRoll);

    // Action orientation (scan / look / micro)
    let actionYawT = st.actionYawTarget;
    let actionPitchT = st.actionPitchTarget;
    if (st.phase === "scan") {
      const u =
        1 -
        Math.max(0, (st.phaseEndsAt - input.time) / Math.max(st.moveDur, 0.01));
      const wave = Math.sin(u * Math.PI * 2) * st.scanDir;
      actionYawT = wave * 0.16;
      actionPitchT = Math.sin(u * Math.PI) * 0.03;
    } else if (st.phase === "reaction") {
      actionYawT = input.scrollDir * 0.08;
      actionPitchT = -0.035 * Math.sign(input.scrollDir || 1);
    } else if (st.phase === "attention") {
      actionYawT = 0;
      actionPitchT = 0;
    } else if (st.phase !== "micro") {
      actionYawT = damp(st.actionYawTarget, 0, 1.2, dt);
      actionPitchT = damp(st.actionPitchTarget, 0, 1.2, dt);
      st.actionYawTarget = actionYawT;
      st.actionPitchTarget = actionPitchT;
    }

    st.actionYaw = damp(st.actionYaw, actionYawT, 2.9, dt);
    st.actionPitch = damp(st.actionPitch, actionPitchT, 2.9, dt);

    const lookYawT =
      delayed.current.lookYaw +
      m.flightYaw +
      st.actionYaw +
      m.scrollLean * 0.18;
    const lookPitchT =
      delayed.current.lookPitch +
      m.flightPitch +
      st.actionPitch +
      m.scrollLean * 0.22;

    m.yaw = damp(m.yaw, lookYawT, 3.1, dt);
    m.pitch = damp(m.pitch, lookPitchT, 3.2, dt);
    m.roll = damp(m.roll, m.flightRoll * 0.5, 2.4, dt);
    lookRef.current.rotation.set(m.pitch, m.yaw, m.roll);

    // Micro mechanical stabilization (asynchronous, subtle)
    const amp = config.idleAmplitude * input.mood.idle;
    const hoverMul =
      st.phase === "patrol"
        ? 0.3
        : st.phase === "retreat"
          ? 0.4
          : st.phase === "idle"
            ? 0.7
            : 1;
    const breatheT =
      Math.sin(t * Math.PI * 2 * 0.26) * 0.009 * amp * hoverMul;
    m.breathe = damp(m.breathe, breatheT, 4.0, dt);

    // Staggered soft noise — not all axes in sync
    const nHead = softNoise(t * 0.37, config.idlePhase + 1);
    const nShoulder = softNoise(t * 0.29, config.idlePhase + 3.5);
    const nTorso = softNoise(t * 0.21, config.idlePhase + 6);
    const nDepth = softNoise(t * 0.33, config.idlePhase + 8.5);

    stabilizeRef.current.position.set(
      nShoulder * 0.006 * amp * hoverMul,
      m.breathe + nTorso * 0.004 * amp * hoverMul,
      nDepth * 0.005 * amp * hoverMul,
    );
    stabilizeRef.current.rotation.set(
      nHead * 0.016 * amp * hoverMul,
      nShoulder * 0.014 * amp * hoverMul,
      nTorso * 0.012 * amp * hoverMul,
    );
  });

  return (
    <group ref={flightRef} position={config.home}>
      <group ref={leanRef}>
        <group ref={lookRef}>
          <group ref={stabilizeRef}>
            <group ref={scaleRef}>
              <primitive object={prepared.root} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function softSmooth(x: number, edge0: number, edge1: number) {
  return smoothstep(edge0, edge1, x);
}

function applyMicroTargets(st: PatrolState, action: MicroAction) {
  st.micro = action;
  switch (action) {
    case "look_left":
      st.actionYawTarget = 0.12;
      st.actionPitchTarget = 0.01;
      break;
    case "look_right":
      st.actionYawTarget = -0.12;
      st.actionPitchTarget = 0.01;
      break;
    case "look_center":
      st.actionYawTarget = 0;
      st.actionPitchTarget = -0.02;
      break;
    case "head_adjust":
      st.actionYawTarget = seededRange(st.seed, -0.06, 0.06);
      st.actionPitchTarget = seededRange(st.seed + 1, -0.04, 0.03);
      break;
    case "body_shift":
      st.actionYawTarget = seededRange(st.seed, -0.05, 0.05);
      st.leanRollTarget = seededRange(st.seed + 2, -0.03, 0.03);
      break;
    case "flight_correction":
      st.actionYawTarget = seededRange(st.seed, -0.08, 0.08);
      st.actionPitchTarget = seededRange(st.seed + 3, -0.03, 0.03);
      break;
    case "posture_reset":
      st.actionYawTarget = 0;
      st.actionPitchTarget = 0;
      st.leanRollTarget = 0;
      st.leanPitchTarget = 0;
      break;
    case "pause":
    default:
      break;
  }
}

function enterPhase(
  st: PatrolState,
  config: GuardianConfig,
  phase: BehaviorPhase,
  now: number,
  duration: number,
) {
  st.phase = phase;
  st.phaseEndsAt = now + duration;
  st.seed += 1.618;

  if (phase === "patrol") {
    st.from = [...st.pos];
    st.target = pickNearbyTarget(
      st.pos,
      config.zone,
      config.maxStep,
      st.seed,
    );
    st.moveStart = now;
    st.moveDur = duration;
  }

  if (phase === "retreat") {
    st.from = [...st.pos];
    st.target = pickNearbyTarget(
      st.pos,
      config.retreatZone,
      config.maxStep * 0.9,
      st.seed,
    );
    // Bias toward outer/upper retreat
    st.target[0] = clamp(
      Math.max(st.target[0], config.retreatZone.xMin + 0.15),
      config.retreatZone.xMin,
      config.retreatZone.xMax,
    );
    st.target[1] = clamp(
      Math.max(st.target[1], config.home[1] + 0.15),
      config.retreatZone.yMin,
      config.retreatZone.yMax,
    );
    st.moveStart = now;
    st.moveDur = duration;
  }

  if (phase === "scan") {
    st.scanDir = seededUnit(st.seed) > 0.5 ? 1 : -1;
    st.moveDur = duration;
  }

  if (phase === "micro") {
    applyMicroTargets(st, pickMicroAction(st.seed));
  }

  if (phase === "settle") {
    st.actionYawTarget = 0;
    st.actionPitchTarget = 0;
  }
}

function advancePatrol(st: PatrolState, config: GuardianConfig, now: number) {
  if (st.phase === "patrol" || st.phase === "retreat") {
    const u = clamp((now - st.moveStart) / Math.max(st.moveDur, 0.01), 0, 1);
    // Smooth accel → cruise → decel
    const e = smoothstep(0, 1, smoothstep(0, 1, u));
    st.pos[0] = st.from[0] + (st.target[0] - st.from[0]) * e;
    st.pos[1] = st.from[1] + (st.target[1] - st.from[1]) * e;
    st.pos[2] = st.from[2] + (st.target[2] - st.from[2]) * e;
    const zone = st.phase === "retreat" ? config.retreatZone : config.zone;
    const clamped = clampToZone(st.pos[0], st.pos[1], st.pos[2], zone);
    st.pos[0] = clamped[0];
    st.pos[1] = clamped[1];
    st.pos[2] = clamped[2];

    if (u >= 1) {
      if (st.phase === "retreat") {
        st.retreatActive = false;
        enterPhase(
          st,
          config,
          "settle",
          now,
          seededRange(st.seed, 0.8, 1.5),
        );
      } else {
        const roll = seededUnit(st.seed + 0.3);
        if (roll < 0.22) {
          enterPhase(st, config, "scan", now, seededRange(st.seed, 1.2, 2.2));
        } else if (roll < 0.4) {
          enterPhase(st, config, "micro", now, seededRange(st.seed, 0.9, 1.8));
        } else if (roll < 0.55) {
          enterPhase(st, config, "idle", now, seededRange(st.seed, 1.0, 2.4));
        } else {
          enterPhase(
            st,
            config,
            "hover",
            now,
            seededRange(
              st.seed,
              config.hoverDuration[0],
              config.hoverDuration[1],
            ),
          );
        }
      }
    }
    return;
  }

  if (now < st.phaseEndsAt) {
    if (st.phase === "hover") {
      // Soft drift toward home — calm personality
      st.pos[0] = damp(st.pos[0], config.home[0], 0.28, 1 / 60);
      st.pos[1] = damp(st.pos[1], config.home[1], 0.28, 1 / 60);
    }
    return;
  }

  // Phase ended — choose next (weighted, unsynced)
  st.seed += 2.399;
  const nextRoll = seededUnit(st.seed);

  if (
    st.phase === "hover" ||
    st.phase === "idle" ||
    st.phase === "settle" ||
    st.phase === "attention"
  ) {
    if (nextRoll < 0.16) {
      enterPhase(st, config, "scan", now, seededRange(st.seed, 1.1, 2.0));
    } else if (nextRoll < 0.34) {
      enterPhase(st, config, "micro", now, seededRange(st.seed, 0.8, 1.7));
    } else if (nextRoll < 0.48) {
      enterPhase(st, config, "idle", now, seededRange(st.seed, 1.2, 2.8));
    } else {
      enterPhase(
        st,
        config,
        "patrol",
        now,
        seededRange(st.seed, config.moveDuration[0], config.moveDuration[1]),
      );
    }
    return;
  }

  if (st.phase === "scan" || st.phase === "micro" || st.phase === "reaction") {
    if (nextRoll < 0.4) {
      enterPhase(
        st,
        config,
        "hover",
        now,
        seededRange(st.seed, config.hoverDuration[0], config.hoverDuration[1]),
      );
    } else if (nextRoll < 0.55) {
      enterPhase(st, config, "settle", now, seededRange(st.seed, 0.7, 1.4));
    } else {
      enterPhase(
        st,
        config,
        "patrol",
        now,
        seededRange(st.seed, config.moveDuration[0], config.moveDuration[1]),
      );
    }
    return;
  }

  enterPhase(
    st,
    config,
    "patrol",
    now,
    seededRange(st.seed, config.moveDuration[0], config.moveDuration[1]),
  );
}
