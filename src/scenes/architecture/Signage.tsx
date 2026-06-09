"use client";

import { Text } from "@react-three/drei";
import { siteConfig } from "@/config/site.config";

interface SignageProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  lightIntensity?: number;
}

export function Signage({
  position,
  rotation = [0, 0, 0],
  lightIntensity = 0,
}: SignageProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.5, -1.2]}>
        <boxGeometry args={[2.5, 3, 0.3]} />
        <meshStandardMaterial color="#8a8078" roughness={0.85} />
      </mesh>
      <Text
        position={[0, 2, -1]}
        fontSize={0.45}
        color="#C9A962"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {siteConfig.name}
      </Text>
      {lightIntensity > 0 && (
        <pointLight
          position={[0, 2.5, 1]}
          intensity={lightIntensity * 1.2}
          color="#C9A962"
          distance={8}
        />
      )}
    </group>
  );
}
