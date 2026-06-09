"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pathsConfig } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "@/utils/terrain-height";

function buildPathGeometry(
  points: [number, number, number][],
  width: number
): THREE.BufferGeometry | null {
  if (points.length < 2) return null;

  const elevated = points.map(([x, , z]) => {
    const y = sampleTerrainHeight(x, z) + 0.08;
    return new THREE.Vector3(x, y, z);
  });

  const curve = new THREE.CatmullRomCurve3(elevated);
  return new THREE.TubeGeometry(curve, 48, width * 0.5, 6, false);
}

export function StonePaths() {
  const groupRef = useRef<THREE.Group>(null);

  const paths = useMemo(
    () =>
      pathsConfig
        .map((path) => ({
          id: path.id,
          geometry: buildPathGeometry(path.points, path.width),
        }))
        .filter((p) => p.geometry !== null),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {paths.map(({ id, geometry }) => (
        <mesh key={id} geometry={geometry!}>
          <meshStandardMaterial
            color="#8a8078"
            roughness={0.95}
            metalness={0.02}
          />
        </mesh>
      ))}
      {pathsConfig.map((path) =>
        path.points.map(([x, , z], i) => (
          <mesh
            key={`${path.id}-stone-${i}`}
            position={[x, sampleTerrainHeight(x, z) + 0.06, z]}
            rotation={[-Math.PI / 2, 0, i * 0.7]}
          >
            <planeGeometry args={[0.6, 0.6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#7a7068" : "#9a9088"}
              roughness={1}
            />
          </mesh>
        ))
      )}
    </group>
  );
}
