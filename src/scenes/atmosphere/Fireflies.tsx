"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { poolConfig } from "@/config/resort-layout.config";
import { snapToTerrain } from "@/utils/terrain-height";

interface FirefliesProps {
  count?: number;
  enabled?: boolean;
  scrollProgress?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function Fireflies({
  count = 40,
  enabled = true,
  scrollProgress = 0,
}: FirefliesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const nightFactor = Math.max(0, (scrollProgress - 0.65) / 0.35);

  const flies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (seededRandom(i) - 0.5) * 50,
        y: 2 + seededRandom(i + 1) * 12,
        z: -10 + (seededRandom(i + 2) - 0.5) * 50,
        phase: seededRandom(i + 3) * Math.PI * 2,
        speed: 0.3 + seededRandom(i + 4) * 0.5,
      })),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !enabled) return;
    const t = state.clock.elapsedTime;
    flies.forEach((fly, i) => {
      dummy.position.set(
        fly.x + Math.sin(t * fly.speed + fly.phase) * 1.5,
        fly.y + Math.cos(t * fly.speed * 0.7 + fly.phase) * 0.8,
        fly.z + Math.sin(t * fly.speed * 0.5 + fly.phase) * 1.2
      );
      dummy.scale.setScalar(0.08 + Math.sin(t * 3 + fly.phase) * 0.03);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!enabled || nightFactor <= 0.05) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#E8D878"
        transparent
        opacity={0.7 * nightFactor}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function WaterParticles({
  count = 25,
  enabled = true,
}: {
  count?: number;
  enabled?: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [px, , pz] = poolConfig.position;
  const poolPos = useMemo(() => snapToTerrain(px, pz, 0.2), [px, pz]);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        ox: (seededRandom(i) - 0.5) * 14,
        oz: (seededRandom(i + 1) - 0.5) * 6,
        phase: seededRandom(i + 2) * Math.PI * 2,
        speed: 0.5 + seededRandom(i + 3) * 0.8,
      })),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !enabled) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        poolPos[0] + p.ox,
        poolPos[1] + 0.15 + Math.abs(Math.sin(t * p.speed + p.phase)) * 0.3,
        poolPos[2] + p.oz
      );
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 3, 3]} />
      <meshBasicMaterial
        color="#a0e8ff"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
