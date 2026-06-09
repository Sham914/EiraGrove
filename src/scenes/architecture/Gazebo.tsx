"use client";

interface GazeboProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Gazebo({
  position,
  rotation = [0, 0, 0],
}: GazeboProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Deck */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4, 0.3, 4]} />
        <meshStandardMaterial color="#7a5840" roughness={0.7} />
      </mesh>
      {/* Pillars */}
      {[[-1.6, -1.6], [-1.6, 1.6], [1.6, -1.6], [1.6, 1.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.5, z]}>
          <cylinderGeometry args={[0.12, 0.15, 3, 6]} />
          <meshStandardMaterial color="#6a4830" roughness={0.75} />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[3, 1.5, 6]} />
        <meshStandardMaterial color="#4a4038" roughness={0.85} flatShading />
      </mesh>
      {/* Table */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 12]} />
        <meshStandardMaterial color="#5a4030" roughness={0.8} />
      </mesh>
    </group>
  );
}
