"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Canvas, useLoader } from "@react-three/fiber";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Bone, Euler, Group, SkeletonHelper, Vector3 } from "three";

type DexterModelProps = {
  path: string;
  compact: boolean;
  debugSkeleton: boolean;
  onHoverChange: (hovered: boolean) => void;
};

type DexterRig = {
  upperArm: Bone;
  forearm: Bone;
  hand: Bone;
  bones: Bone[];
  originalRotations: Map<Bone, Euler>;
  timeline: gsap.core.Timeline | null;
};

const DEXTER_ARM_BONES = {
  upperArm: "Bone_26_027",
  forearm: "Bone_28_029",
  hand: "Bone_29_030",
} as const;

function DexterModel({ path, compact, debugSkeleton, onHoverChange }: DexterModelProps) {
  const model = useLoader(GLTFLoader, path);
  const groupRef = useRef<Group>(null);
  const rigRef = useRef<DexterRig | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const bones: Bone[] = [];
    model.scene.traverse((object) => {
      if (object instanceof Bone) bones.push(object);
    });

    if (debugSkeleton && process.env.NODE_ENV !== "production") {
      console.groupCollapsed(`[MADLAB] ${path} bone hierarchy (${bones.length} bones)`);
      bones.forEach((bone) => {
        const position = bone.getWorldPosition(new Vector3());
        console.log({
          name: bone.name,
          parent: bone.parent?.name ?? null,
          children: bone.children.map((child) => child.name),
          worldPosition: [position.x, position.y, position.z].map((value) => Number(value.toFixed(3))),
        });
      });
      console.groupEnd();
    }

    const bonesByName = new Map(bones.map((bone) => [bone.name, bone]));
    const upperArm = bonesByName.get(DEXTER_ARM_BONES.upperArm);
    const forearm = bonesByName.get(DEXTER_ARM_BONES.forearm);
    const hand = bonesByName.get(DEXTER_ARM_BONES.hand);

    if (!upperArm || !forearm || !hand) {
      rigRef.current = null;
      if (debugSkeleton && process.env.NODE_ENV !== "production") {
        console.warn("[MADLAB] Dexter wave rig was not found for this model path.", {
          path,
          expected: DEXTER_ARM_BONES,
        });
      }
      return;
    }

    const helper = debugSkeleton && process.env.NODE_ENV !== "production" ? new SkeletonHelper(model.scene) : null;
    if (helper) {
      helper.name = "MADLAB Dexter skeleton debug";
      model.scene.add(helper);
    }

    rigRef.current = {
      upperArm,
      forearm,
      hand,
      bones,
      originalRotations: new Map(bones.map((bone) => [bone, bone.rotation.clone()])),
      timeline: null,
    };

    return () => {
      const rig = rigRef.current;
      rig?.timeline?.kill();
      rig?.bones.forEach((bone) => {
        const original = rig.originalRotations.get(bone);
        if (original) bone.rotation.copy(original);
      });
      if (helper) {
        model.scene.remove(helper);
        helper.dispose();
      }
      rigRef.current = null;
    };
  }, [debugSkeleton, model.scene, path]);

  const wave = useCallback(() => {
    const rig = rigRef.current;
    if (!rig || reduceMotion || rig.timeline?.isActive()) return;

    const { upperArm, forearm, hand, originalRotations } = rig;
    const originalUpperArm = originalRotations.get(upperArm);
    const originalForearm = originalRotations.get(forearm);
    const originalHand = originalRotations.get(hand);
    if (!originalUpperArm || !originalForearm || !originalHand) return;

    rig.timeline?.kill();
    rig.bones.forEach((bone) => {
      const original = originalRotations.get(bone);
      if (original) bone.rotation.copy(original);
    });

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        upperArm.rotation.copy(originalUpperArm);
        forearm.rotation.copy(originalForearm);
        hand.rotation.copy(originalHand);
        rig.timeline = null;
      },
    });

    timeline
      .to(upperArm.rotation, {
        duration: 0.42,
        z: originalUpperArm.z + 1.72,
        y: originalUpperArm.y + 0.1,
      })
      .to(
        forearm.rotation,
        {
          duration: 0.34,
          z: originalForearm.z - 0.78,
          y: originalForearm.y + 0.08,
        },
        "<0.12",
      )
      .to(
        hand.rotation,
        {
          duration: 0.16,
          z: originalHand.z + 0.22,
          y: originalHand.y,
        },
        "<0.08",
      )
      .to(hand.rotation, {
        duration: 0.16,
        y: originalHand.y + 0.52,
        ease: "sine.inOut",
        repeat: 5,
        yoyo: true,
      })
      .to(hand.rotation, {
        duration: 0.14,
        z: originalHand.z,
        y: originalHand.y,
      })
      .to(
        forearm.rotation,
        {
          duration: 0.3,
          z: originalForearm.z,
          y: originalForearm.y,
        },
        "<0.06",
      )
      .to(
        upperArm.rotation,
        {
          duration: 0.38,
          z: originalUpperArm.z,
          y: originalUpperArm.y,
        },
        "<0.12",
      );

    rig.timeline = timeline;
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(wave, 2000);
    return () => window.clearInterval(interval);
  }, [reduceMotion, wave]);

  return (
    <group ref={groupRef} position={compact ? [0.75, -0.1, 0] : [0, -0.85, 0]} scale={compact ? 3.5 : 1.65}>
      <primitive
        object={model.scene}
        onPointerDown={(event: { stopPropagation: () => void }) => {
          event.stopPropagation();
          wave();
        }}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
      />
    </group>
  );
}

export function MadlabDexterModel({
  modelPath = "/dexter.glb",
  label = "Dexter laboratory",
  compact = false,
  debugSkeleton = false,
}: {
  modelPath?: string;
  label?: string;
  compact?: boolean;
  debugSkeleton?: boolean;
}) {
  const [isModelHovered, setIsModelHovered] = useState(false);
  const effectiveDebugSkeleton =
    debugSkeleton ||
    (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_MADLAB_DEBUG_SKELETON === "true");

  return (
    <div
      className={`relative overflow-hidden ${compact ? "aspect-square w-full max-w-[10rem]" : "border border-[#ff2a2a]/35 bg-[#0a0a0a] shadow-[0_0_70px_rgba(255,42,42,0.08)] aspect-[3/4] min-h-[19rem] lg:min-h-0"}`}
      style={{ cursor: isModelHovered ? "pointer" : "default" }}
    >
      {!compact && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,42,42,0.14),transparent_52%)]" />}
      {!compact && <div className="pointer-events-none absolute inset-3 border border-white/10" />}
      {!compact && (
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/38">
          <span>LAB OBJECT / 3D</span>
          <span>GLB / 001</span>
        </div>
      )}
      <Canvas
        camera={{ position: [0, compact ? 0 : 0.2, compact ? 3.8 : 4.3], fov: compact ? 35 : 32 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        aria-label="3D laboratory character with an automatic wave animation"
      >
        <ambientLight intensity={1.5} />
        <hemisphereLight args={["#ebe8e1", "#0a0a0a", 1.4]} />
        <directionalLight position={[2, 3, 4]} intensity={2.2} color="#ebe8e1" />
        <pointLight position={[-2, 0, 2]} intensity={14} distance={6} color="#ff2a2a" />
        <Suspense fallback={null}>
          <DexterModel
            path={modelPath}
            compact={compact}
            debugSkeleton={effectiveDebugSkeleton}
            onHoverChange={setIsModelHovered}
          />
        </Suspense>
      </Canvas>
      {!compact && (
        <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/35">
          <span>{label}</span>
          <span>interactive object</span>
        </div>
      )}
    </div>
  );
}
