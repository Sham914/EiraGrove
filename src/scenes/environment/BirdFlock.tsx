"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

interface BirdFlockProps {
  capabilities: DeviceCapabilities;
}

export function BirdFlock({ capabilities }: BirdFlockProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const birds = useMemo(() => {
    return Array.from({ length: capabilities.birdCount }, (_, i) => ({
      angle: (i / capabilities.birdCount) * Math.PI * 2,
      radius: 25 + (i % 4) * 8,
      height: 20 + (i % 3) * 5,
      speed: 0.3 + (i % 5) * 0.08,
      offset: i * 1.7,
    }));
  }, [capabilities.birdCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    birds.forEach((bird, i) => {
      const a = bird.angle + t * bird.speed * 0.1;
      dummy.position.set(
        Math.cos(a) * bird.radius,
        bird.height + Math.sin(t + bird.offset) * 2,
        -30 + Math.sin(a) * bird.radius * 0.5
      );
      dummy.rotation.set(0, -a + Math.PI / 2, Math.sin(t * 3 + bird.offset) * 0.3);
      dummy.scale.setScalar(0.3);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (birds.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, birds.length]}>
      <coneGeometry args={[0.3, 0.8, 3]} />
      <meshStandardMaterial color="#2a3040" roughness={0.8} flatShading />
    </instancedMesh>
  );
}
