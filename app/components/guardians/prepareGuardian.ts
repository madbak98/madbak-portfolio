import {
  AnimationClip,
  AnimationMixer,
  Box3,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from "three";

/**
 * ~62% of previous TARGET_HEIGHT (0.95) → ~60–65% of prior visual size.
 * Small autonomous sentry — does not compete with MADBAK / sphere.
 */
const TARGET_HEIGHT = 0.59;

export type PreparedGuardian = {
  root: Group;
  size: Vector3;
  scale: number;
  mixer: AnimationMixer | null;
  clips: AnimationClip[];
};

/**
 * Clone + sanitize the Guardian asset:
 * - drop cameras / lights from export
 * - wrap + recenter from geometry bounds (FBX verts are far from origin)
 * - normalize height
 *
 * FBX reality (inspected):
 * - Single rigid Mesh — no bones / Skin / LimbNode
 * - AnimationStack "Take 001" has CurveNodes (Lcl Translation) but
 *   zero KeyTime/KeyValueFloat channels → Three.js yields no usable clips
 * - Procedural layered motion is the only viable body animation path
 *
 * Still wires AnimationMixer if any clips are present on the source.
 */
export function prepareGuardianRoot(
  source: Object3D,
  animations: AnimationClip[] = [],
): PreparedGuardian {
  const cloned = source.clone(true);

  const remove: Object3D[] = [];
  cloned.traverse((obj) => {
    if (
      obj.type === "PerspectiveCamera" ||
      obj.type === "OrthographicCamera" ||
      obj.type === "Camera" ||
      obj.type.includes("Light")
    ) {
      remove.push(obj);
    }
  });
  remove.forEach((obj) => obj.parent?.remove(obj));

  cloned.updateMatrixWorld(true);
  const rawBox = new Box3().setFromObject(cloned);
  const rawSize = new Vector3();
  const rawCenter = new Vector3();
  rawBox.getSize(rawSize);
  rawBox.getCenter(rawCenter);

  const inner = new Group();
  inner.name = "guardian-inner";
  inner.add(cloned);
  cloned.position.set(-rawCenter.x, -rawCenter.y, -rawCenter.z);

  const height = Math.max(rawSize.y, 0.001);
  const scale = TARGET_HEIGHT / height;
  inner.scale.setScalar(scale);
  inner.updateMatrixWorld(true);

  const scaledBox = new Box3().setFromObject(inner);
  inner.position.y -= scaledBox.min.y;
  // Hovering sentry: slight lift
  inner.position.y += TARGET_HEIGHT * 0.1;
  inner.updateMatrixWorld(true);

  inner.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.castShadow = false;
    obj.receiveShadow = false;
    obj.frustumCulled = false;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((mat, index) => {
      if (!mat) return;
      if (mat instanceof MeshStandardMaterial) {
        const next = mat.clone();
        next.side = DoubleSide;
        next.envMapIntensity = 0.45;
        next.metalness = Math.min(next.metalness ?? 0.2, 0.35);
        next.roughness = Math.max(next.roughness ?? 0.55, 0.38);
        next.emissive = new Color("#241c16");
        next.emissiveIntensity = 0.18;
        if (next.map) {
          next.map = next.map.clone();
          next.map.colorSpace = SRGBColorSpace;
          next.map.needsUpdate = true;
        }
        next.needsUpdate = true;
        if (Array.isArray(obj.material)) obj.material[index] = next;
        else obj.material = next;
      } else if ("color" in mat && mat.color instanceof Color) {
        const mapped = mat as MeshStandardMaterial;
        const next = new MeshStandardMaterial({
          color: mat.color.clone(),
          map: mapped.map ?? null,
          metalness: 0.15,
          roughness: 0.5,
          emissive: new Color("#241c16"),
          emissiveIntensity: 0.18,
          side: DoubleSide,
        });
        if (next.map) next.map.colorSpace = SRGBColorSpace;
        if (Array.isArray(obj.material)) obj.material[index] = next;
        else obj.material = next;
      }
    });
  });

  const finalBox = new Box3().setFromObject(inner);
  const finalSize = new Vector3();
  finalBox.getSize(finalSize);

  // Prefer usable clips only (any track with real motion)
  const usable = animations.filter((clip) =>
    clip.tracks.some((track) => {
      const v = track.values;
      if (!v?.length) return false;
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < v.length; i++) {
        const n = v[i]!;
        if (n < min) min = n;
        if (n > max) max = n;
      }
      return max - min > 1e-5;
    }),
  );

  let mixer: AnimationMixer | null = null;
  if (usable.length > 0) {
    mixer = new AnimationMixer(inner);
    const action = mixer.clipAction(usable[0]!);
    action.reset().fadeIn(0.4).play();
    action.setEffectiveWeight(1);
  }

  return { root: inner, size: finalSize, scale, mixer, clips: usable };
}
