"use client";

interface ReceptionPavilionProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  lightIntensity?: number;
}

export function ReceptionPavilion({
  position,
  rotation = [0, 0, 0],
  lightIntensity = 0,
}: ReceptionPavilionProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone base platform */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[10, 0.6, 8]} />
        <meshStandardMaterial color="#6a6058" roughness={0.9} />
      </mesh>
      {/* Pillars */}
      {[[-4, -3], [-4, 3], [4, -3], [4, 3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.2, z]}>
          <boxGeometry args={[0.4, 5, 0.4]} />
          <meshStandardMaterial color="#5a5048" roughness={0.85} />
        </mesh>
      ))}
      {/* Hipped roof */}
      <mesh position={[0, 5.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[7, 2.5, 4]} />
        <meshStandardMaterial color="#3a3835" roughness={0.8} flatShading />
      </mesh>
      {/* Roof underside warm wood */}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[9, 0.15, 7]} />
        <meshStandardMaterial color="#8a6848" roughness={0.7} />
      </mesh>
      {/* Iron fence */}
      <mesh position={[0, 0.8, -4.2]}>
        <boxGeometry args={[10, 1.2, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      {lightIntensity > 0 && (
        <>
          {[0, 1, 2].map((i) => (
            <pointLight
              key={i}
              position={[(i - 1) * 3, 3, 0]}
              intensity={lightIntensity * 12.8}
              color="#FFD8A0"
              distance={20}
            />
          ))}
        </>
      )}
    </group>
  );
}
