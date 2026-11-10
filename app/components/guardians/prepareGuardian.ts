import {
  Box3,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  Vector3,
  type Material,
} from "three";

/**
 * Prepares the Gundam asset as a pointing cursor.
 *
 * Asset reality (inspected): one rigid mesh, no bones or usable clips, arms
 * hanging at the sides with closed fists. The pointing pose is therefore made
 * by rotating the right-arm parts (separate connected pieces in the mesh)
 * around the shoulder, so the fist becomes the pointer tip.
 *
 * The returned root has its origin exactly at that tip: any rotation or scale
 * applied to it pivots around the hotspot.
 */

/** Model height in scene units after normalisation. */
const MODEL_HEIGHT = 1;
/** Arm swing in the frontal plane: hanging down → reaching up and out. */
const ARM_RAISE = -2.3;
/** Share of the arm swing the shoulder armour follows. */
const PAD_FOLLOW = 0.3;
/** Slight reach toward the viewer so the fist reads in 3D. */
const ARM_REACH = 0.18;
/** Three-quarter view, turned toward the pointing arm. */
const BASE_YAW = -0.45;

export type PreparedGundamCursor = {
  /** Origin = pointer tip. */
  root: Group;
  /** Bounds of the posed model around the tip, for camera framing. */
  bounds: Box3;
  /** False when the arm could not be isolated (unposed fallback). */
  posed: boolean;
};

export function prepareGundamCursor(source: Object3D): PreparedGundamCursor {
  const cloned = source.clone(true);
  cloned.updateMatrixWorld(true);

  const meshes: Mesh[] = [];
  cloned.traverse((obj) => {
    if (obj instanceof Mesh) meshes.push(obj);
  });

  const baked = meshes.map((mesh) => {
    const geometry = (mesh.geometry as BufferGeometry).clone();
    geometry.applyMatrix4(mesh.matrixWorld);
    return { geometry, material: mesh.material as Material | Material[] };
  });

  const box = new Box3();
  baked.forEach(({ geometry }) => {
    geometry.computeBoundingBox();
    if (geometry.boundingBox) box.union(geometry.boundingBox);
  });
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  const scale = MODEL_HEIGHT / Math.max(size.y, 1e-6);
  const normalise = new Matrix4()
    .makeScale(scale, scale, scale)
    .multiply(new Matrix4().makeTranslation(-center.x, -center.y, -center.z));
  baked.forEach(({ geometry }) => geometry.applyMatrix4(normalise));

  const halfWidth = (size.x * scale) / 2;
  let tip: Vector3 | null = null;
  for (const { geometry } of baked) {
    tip = poseRightArm(geometry, halfWidth) ?? tip;
  }
  const posed = tip !== null;
  if (!tip) {
    // Unposed fallback: top-left corner of the head region.
    tip = new Vector3(-halfWidth * 0.2, MODEL_HEIGHT / 2, 0);
  }

  const model = new Group();
  model.name = "gundam-cursor-model";
  baked.forEach(({ geometry, material }) => {
    const mesh = new Mesh(geometry, prepareMaterial(material));
    mesh.frustumCulled = false;
    model.add(mesh);
  });
  model.position.copy(tip).multiplyScalar(-1);

  const base = new Group();
  base.name = "gundam-cursor-base";
  base.rotation.y = BASE_YAW;
  base.add(model);

  const root = new Group();
  root.name = "gundam-cursor";
  root.add(base);
  root.updateMatrixWorld(true);

  return { root, bounds: new Box3().setFromObject(root), posed };
}

/**
 * Splits the mesh into connected pieces and rotates the ones that make up the
 * figure's right arm (screen left when facing the viewer). Returns the
 * fist's outermost point, or null if the arm could not be found.
 */
function poseRightArm(geometry: BufferGeometry, halfWidth: number): Vector3 | null {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const index = geometry.getIndex();
  if (!position || !index) return null;

  const count = position.count;
  const H = MODEL_HEIGHT;

  // Weld duplicated vertices (UV seams) so pieces connect, then union-find.
  const weld = new Int32Array(count);
  const seen = new Map<string, number>();
  for (let i = 0; i < count; i++) {
    const key = `${Math.round(position.getX(i) * 1e4)},${Math.round(position.getY(i) * 1e4)},${Math.round(position.getZ(i) * 1e4)}`;
    const first = seen.get(key);
    if (first === undefined) {
      seen.set(key, i);
      weld[i] = i;
    } else {
      weld[i] = first;
    }
  }
  const parent = new Int32Array(count);
  for (let i = 0; i < count; i++) parent[i] = i;
  const find = (x: number) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!;
      x = parent[x]!;
    }
    return x;
  };
  for (let t = 0; t < index.count; t += 3) {
    const a = find(weld[index.getX(t)]!);
    const b = find(weld[index.getX(t + 1)]!);
    const c = find(weld[index.getX(t + 2)]!);
    if (a !== b) parent[a] = b;
    const rb = find(b);
    if (find(c) !== rb) parent[find(c)] = rb;
  }

  type Piece = { n: number; sx: number; sz: number; minX: number; maxX: number; minY: number; maxY: number };
  const pieces = new Map<number, Piece>();
  const pieceOf = new Int32Array(count);
  for (let i = 0; i < count; i++) {
    const id = find(weld[i]!);
    pieceOf[i] = id;
    let p = pieces.get(id);
    if (!p) {
      p = { n: 0, sx: 0, sz: 0, minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
      pieces.set(id, p);
    }
    const x = position.getX(i);
    const y = position.getY(i);
    p.n++;
    p.sx += x;
    p.sz += position.getZ(i);
    p.minX = Math.min(p.minX, x);
    p.maxX = Math.max(p.maxX, x);
    p.minY = Math.min(p.minY, y);
    p.maxY = Math.max(p.maxY, y);
  }

  // Thresholds are proportions of the normalised figure (height 1, centred).
  const role = new Map<number, "arm" | "pad">();
  let fistId = -1;
  let fistMinY = Infinity;
  pieces.forEach((p, id) => {
    const cx = p.sx / p.n;
    const cz = p.sz / p.n;
    if (cx > -0.48 * halfWidth || p.minY < -0.03 * H || Math.abs(cz) > 0.04 * H) return;
    if (p.minY > 0.27 * H) {
      role.set(id, "pad");
      return;
    }
    // Side skirt armour sits next to the forearm; it stays with the hips.
    if (p.maxX > -0.45 * halfWidth && p.minY > 0.05 * H && p.maxY < 0.2 * H) return;
    role.set(id, "arm");
    if (p.minY < fistMinY) {
      fistMinY = p.minY;
      fistId = id;
    }
  });
  if (fistId < 0 || role.size < 3) return null;

  const pivot = new Vector3(-0.66 * halfWidth, 0.312 * H, 0);
  const armMatrix = new Matrix4()
    .makeRotationX(ARM_REACH)
    .multiply(new Matrix4().makeRotationZ(ARM_RAISE));
  const padMatrix = new Matrix4().makeRotationZ(ARM_RAISE * PAD_FOLLOW);
  const reach = new Vector3(0, -1, 0).transformDirection(armMatrix);

  const posedPoint = new Vector3();
  const offset = new Vector3();
  const n = new Vector3();
  const tip = new Vector3();
  let best = -Infinity;
  for (let i = 0; i < count; i++) {
    const r = role.get(pieceOf[i]!);
    if (!r) continue;
    const m = r === "arm" ? armMatrix : padMatrix;
    posedPoint.fromBufferAttribute(position, i).sub(pivot).applyMatrix4(m).add(pivot);
    position.setXYZ(i, posedPoint.x, posedPoint.y, posedPoint.z);
    if (normal) {
      n.fromBufferAttribute(normal, i).transformDirection(m);
      normal.setXYZ(i, n.x, n.y, n.z);
    }
    if (pieceOf[i] === fistId) {
      const d = offset.copy(posedPoint).sub(pivot).dot(reach);
      if (d > best) {
        best = d;
        tip.copy(posedPoint);
      }
    }
  }
  position.needsUpdate = true;
  if (normal) normal.needsUpdate = true;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return tip;
}

function prepareMaterial(material: Material | Material[]): Material | Material[] {
  if (Array.isArray(material)) return material.map((m) => prepareOne(m));
  return prepareOne(material);
}

function prepareOne(mat: Material): Material {
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
    return next;
  }
  const source = mat as MeshStandardMaterial;
  const next = new MeshStandardMaterial({
    color: source.color instanceof Color ? source.color.clone() : new Color("#d8d8d8"),
    map: source.map ?? null,
    metalness: 0.15,
    roughness: 0.5,
    emissive: new Color("#241c16"),
    emissiveIntensity: 0.18,
    side: DoubleSide,
  });
  if (next.map) next.map.colorSpace = SRGBColorSpace;
  return next;
}
