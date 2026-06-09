"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vegetationZones } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "@/utils/terrain-height";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

interface VegetationProps {
  capabilities: DeviceCapabilities;
  windStrength?: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

interface InstanceData {
  position: THREE.Vector3;
  rotationY: number;
  scale: number;
}

export function Vegetation({
  capabilities,
  windStrength = 1,
}: VegetationProps) {
  const treesRef = useRef<THREE.InstancedMesh>(null);
  const trunksRef = useRef<THREE.InstancedMesh>(null);
  const bushesRef = useRef<THREE.InstancedMesh>(null);
  const bambooRef = useRef<THREE.InstancedMesh>(null);

  const { trees, bushes, bamboos } = useMemo(() => {
    const treeList: InstanceData[] = [];
    const bushList: InstanceData[] = [];
    const bambooList: InstanceData[] = [];

    for (const zone of vegetationZones) {
      const count = Math.max(
        2,
        Math.floor(zone.density * (capabilities.treeCount / 100))
      );
      for (let i = 0; i < count; i++) {
        const seed = treeList.length + bushList.length + bambooList.length + i;
        const angle = seededRandom(seed) * Math.PI * 2;
        const dist = seededRandom(seed + 1 ) * zone.radius;
        const x = zone.center[0] + Math.cos(angle) * dist + 3 ;
        const z = zone.center[2] + Math.sin(angle) * dist + 3;
        const y = sampleTerrainHeight(x, z);
        const scale =
          0.8 + seededRandom(seed + 2) * (zone.type === "forest" ? 2.5 : 1.2);
        const rotY = seededRandom(seed + 3) * Math.PI * 2;
        const entry = {
          position: new THREE.Vector3(x, y, z),
          rotationY: rotY,
          scale,
        };

        if (zone.type === "bamboo" && bambooList.length < 40) {
          bambooList.push(entry);
        } else if (
          (zone.type === "garden" || zone.type === "lawn") &&
          bushList.length < capabilities.bushCount
        ) {
          bushList.push(entry);
        } else if (treeList.length < capabilities.treeCount) {
          treeList.push(entry);
        }
      }
    }

    return { trees: treeList, bushes: bushList, bamboos: bambooList };
  }, [capabilities]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const applyInstances = (
    mesh: THREE.InstancedMesh | null,
    data: InstanceData[],
    windOffset = 0,
    yOffset = 0
  ) => {
    if (!mesh) return;
    data.forEach((item, i) => {
      dummy.position.set(
        item.position.x,
        item.position.y + yOffset * item.scale,
        item.position.z
      );
      dummy.rotation.set(
        0,
        item.rotationY,
        Math.sin(windOffset + i * 0.5) * 0.04 * windStrength
      );
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    applyInstances(treesRef.current, trees, t, 1.4);
    applyInstances(trunksRef.current, trees, t, 0.4);
    applyInstances(bushesRef.current, bushes, t * 1.3, 0.5);
    applyInstances(bambooRef.current, bamboos, t * 1.5, 1.75);
  });

  return (
    <group>
      {trees.length > 0 && (
        <>
          <instancedMesh
            ref={treesRef}
            args={[undefined, undefined, trees.length]}
          >
            <coneGeometry args={[0.6, 2.8, 6]} />
            <meshStandardMaterial
              color="#2a5030"
              roughness={0.9}
              flatShading
            />
          </instancedMesh>
          <instancedMesh
            ref={trunksRef}
            args={[undefined, undefined, trees.length]}
          >
            <cylinderGeometry args={[0.12, 0.18, 0.8, 5]} />
            <meshStandardMaterial color="#4a3528" roughness={1} />
          </instancedMesh>
        </>
      )}
      {bushes.length > 0 && (
        <instancedMesh
          ref={bushesRef}
          args={[undefined, undefined, bushes.length]}
        >
          <sphereGeometry args={[0.5, 6, 5]} />
          <meshStandardMaterial color="#3d6838" roughness={0.95} flatShading />
        </instancedMesh>
      )}
      {bamboos.length > 0 && (
        <instancedMesh
          ref={bambooRef}
          args={[undefined, undefined, bamboos.length]}
        >
          <cylinderGeometry args={[0.06, 0.08, 3.5, 5]} />
          <meshStandardMaterial color="#6a9a48" roughness={0.6} />
        </instancedMesh>
      )}
    </group>
  );
}
