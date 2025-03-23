import { FC, useMemo, useRef, useState } from 'react';

import { useCursor, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Texture,
  Uint16BufferAttribute,
  Vector3,
} from 'three';

import { easing } from 'maath';
import { degToRad } from 'three/src/math/MathUtils.js';

import { setPage, useAppDispatch, useAppSelector } from '../store';

import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  SEGMENT_WIDTH,
  EASING_FACTOR,
  EASING_FACTOR_FOLD,
  INSIDE_CURVE_STRENGTH,
  OUTSIDE_CURVE_STRENGTH,
  TURNING_CURVE_STRENGTH,
} from '../configs/book.config';

function generateBones() {
  const bones = Array.from({ length: PAGE_SEGMENTS + 1 }, (_, i) => {
    const bone = new Bone();
    bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
    return bone;
  });

  bones.forEach((bone, i) => i > 0 && bones[i - 1].add(bone));

  return bones;
}

function generateMaterials(frontTexture: Texture, backTexture: Texture) {
  return [
    new MeshStandardMaterial({
      color: new Color('white'),
    }),
    new MeshStandardMaterial({
      color: '#111',
    }),
    new MeshStandardMaterial({
      color: new Color('white'),
    }),
    new MeshStandardMaterial({
      color: new Color('white'),
    }),
    new MeshStandardMaterial({
      color: new Color('white'),
      map: frontTexture,
      emissive: new Color('orange'),
      emissiveIntensity: 0,
    }),
    new MeshStandardMaterial({
      color: new Color('white'),
      map: backTexture,
      emissive: new Color('orange'),
      emissiveIntensity: 0,
    }),
  ];
}

function generateGeometry() {
  const geometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2,
  );

  geometry.translate(PAGE_WIDTH / 2, 0, 0);

  const position = geometry.attributes.position;
  const vertex = new Vector3();
  const skinIndexes = [];
  const skinWeights = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;

    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
  geometry.setAttribute(
    'skinWeight',
    new Float32BufferAttribute(skinWeights, 4),
  );

  return geometry;
}

interface PageProps {
  number: number;
  front: string;
  back: string;
}

export const Page: FC<PageProps> = ({ number, front, back }) => {
  /**
   * States
   */
  const isPageOpened = useAppSelector((state) => state.book.page > number);
  const isBookClosed = useAppSelector(
    (state) => state.book.total === state.book.page || state.book.page === 0,
  );
  const zPosition = useAppSelector(
    (state) => -number * PAGE_DEPTH + state.book.page * PAGE_DEPTH,
  );

  const [frontTexture, backTexture] = useTexture([front, back]);

  frontTexture.colorSpace = SRGBColorSpace;
  backTexture.colorSpace = SRGBColorSpace;

  const [turnedAt, setTurnedAt] = useState<number>(0);
  const [lastOpened, setLastOpened] = useState<boolean>(isPageOpened);
  const [highlighted, setHighlighted] = useState<boolean>(false);

  /**
   * Refs
   */
  const groupRef = useRef(null);
  const meshRef = useRef<Mesh>(null);

  useCursor(highlighted);

  /**
   * Event handlers
   */
  const dispatch = useAppDispatch();

  const onPageChange = () => {
    const nextPageIndex = isPageOpened ? number : number + 1;
    dispatch(setPage(nextPageIndex));
  };

  /**
   * Animations
   */
  const skinnedMesh = useMemo(() => {
    const geometry = generateGeometry();
    const materials = generateMaterials(frontTexture, backTexture);

    const mesh = new SkinnedMesh(geometry, materials);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;

    const skeleton = new Skeleton(generateBones());
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);

    return mesh;
  }, []);

  useFrame((_, delta) => {
    const mesh: SkinnedMesh = meshRef.current as any;
    if (!mesh) {
      return;
    }

    // emissive intensity
    const materials: MeshStandardMaterial[] = mesh.material as any;
    const emissiveIntensity = MathUtils.lerp(
      materials[4].emissiveIntensity,
      highlighted ? 0.22 : 0,
      0.1,
    );

    materials[4].emissiveIntensity = emissiveIntensity;
    materials[5].emissiveIntensity = emissiveIntensity;

    // turning
    if (lastOpened !== isPageOpened) {
      setTurnedAt(+new Date());
      setLastOpened(isPageOpened);
    }

    const turningTime = Math.sin(
      (Math.min(400, +new Date() - turnedAt) / 400) * Math.PI,
    );

    const targetRotation =
      (isPageOpened ? -Math.PI / 2 : Math.PI / 2) +
      (!isBookClosed ? degToRad(number * 0.8) : 0);

    const group = groupRef.current as any;
    const bones = mesh.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        INSIDE_CURVE_STRENGTH * insideCurveIntensity * targetRotation -
        OUTSIDE_CURVE_STRENGTH * outsideCurveIntensity * targetRotation +
        TURNING_CURVE_STRENGTH * turningIntensity * targetRotation;

      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      if (isBookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      easing.dampAngle(
        target.rotation,
        'y',
        rotationAngle,
        EASING_FACTOR,
        delta,
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      easing.dampAngle(
        target.rotation,
        'x',
        foldRotationAngle * foldIntensity,
        EASING_FACTOR_FOLD,
        delta,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setHighlighted(false);
        onPageChange();
      }}
    >
      <primitive ref={meshRef} object={skinnedMesh} position-z={zPosition} />
    </group>
  );
};
