"use client";

interface PrivateCottageProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  lightIntensity?: number;
}

export function PrivateCottage({
  position,
  rotation = [0, 0, 0],
  lightIntensity = 0,
}: PrivateCottageProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone plinth */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4.4, 0.3, 3.8]} />
        <meshStandardMaterial color="#6a6058" roughness={0.95} />
      </mesh>
      {/* White walls */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 2.4, 3.5]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* Terracotta gable accent */}
      <mesh position={[0, 2.6, 1.76]}>
        <boxGeometry args={[4.2, 1.8, 0.15]} />
        <meshStandardMaterial color="#b85a38" roughness={0.8} />
      </mesh>
      {/* Gabled roof */}
      <mesh position={[0, 3.4, 0]}>
        <coneGeometry args={[3.2, 1.8, 4]} />
        <meshStandardMaterial color="#3a3835" roughness={0.85} flatShading />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.9, 1.76]}>
        <boxGeometry args={[0.9, 1.8, 0.1]} />
        <meshStandardMaterial color="#7a5840" roughness={0.7} />
      </mesh>
      {lightIntensity > 0 && (
        <pointLight
          position={[0, 2, 2]}
          intensity={lightIntensity * 4.8}
          color="#fadfc4"
          distance={8}
        />
      )}
    </group>
  );
}
