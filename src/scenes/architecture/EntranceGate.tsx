"use client";

interface EntranceGateProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  lightIntensity?: number;
}

export function EntranceGate({
  position,
  rotation = [0, 0, 0],
  lightIntensity = 0,
}: EntranceGateProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone walls */}
      <mesh position={[-6, 1.5, 0]}>
        <boxGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#4a4a48" roughness={0.95} />
      </mesh>
      <mesh position={[6, 1.5, 0]}>
        <boxGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#4a4a48" roughness={0.95} />
      </mesh>
      {/* Metal gate */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.08, 2.4, 4]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {[ -1.2, 1.2 ].map((x) => (
        <mesh key={x} position={[x, 1.2, 0]}>
          <boxGeometry args={[0.04, 2.4, 4]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Purple agapanthus clusters */}
      {[-4, 4].flatMap((side) =>
        [-2, 0, 2].map((z, i) => (
          <group key={`${side}-${z}`} position={[side, 0.3, z]}>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.25, 6, 5]} />
              <meshStandardMaterial color="#6a48a0" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
              <meshStandardMaterial color="#3a6830" />
            </mesh>
          </group>
        ))
      )}
      {lightIntensity > 0 && (
        <>
          <pointLight position={[0, 2.5, 0]} intensity={lightIntensity} color="#C9A962" distance={12} />
          <mesh position={[3.5, 1.8, 1]}>
            <boxGeometry args={[0.8, 1.2, 0.15]} />
            <meshStandardMaterial
              color="#C9A962"
              emissive="#C9A962"
              emissiveIntensity={lightIntensity * 0.4}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
