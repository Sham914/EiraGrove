"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vegetationZones } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "@/utils/terrain-height";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

interface GrassPatchesProps {
  capabilities: DeviceCapabilities;
  windStrength?: number;
}

export function GrassPatches({
  capabilities,
  windStrength = 1,
}: GrassPatchesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const blades = useMemo(() => {
    const list: { x: number; y: number; z: number; rot: number; h: number }[] =
      [];
    const lawnZones = vegetationZones.filter((z) => z.type === "lawn" || z.type === "garden");
    const total = capabilities.grassCount;

    for (let i = 0; i < total; i++) {
      const zone = lawnZones[i % lawnZones.length];
      const seed = i * 17;
      const angle = seededRandom(seed) * Math.PI * 2;
      const dist = seededRandom(seed + 1) * zone.radius;
      const x = zone.center[0] + Math.cos(angle) * dist;
      const z = zone.center[2] + Math.sin(angle) * dist;
      list.push({
        x,
        y: sampleTerrainHeight(x, z),
        z,
        rot: seededRandom(seed + 2) * Math.PI,
        h: 0.15 + seededRandom(seed + 3) * 0.25,
      });
    }
    return list;
  }, [capabilities.grassCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    blades.forEach((blade, i) => {
      dummy.position.set(blade.x, blade.y + blade.h / 2, blade.z);
      dummy.rotation.set(
        Math.sin(t * 2 + i) * 0.15 * windStrength,
        blade.rot,
        Math.cos(t * 1.5 + i * 0.3) * 0.1 * windStrength
      );
      dummy.scale.set(0.04, blade.h, 0.02);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (blades.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, blades.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4a7a38" roughness={0.9} flatShading />
    </instancedMesh>
  );
}
