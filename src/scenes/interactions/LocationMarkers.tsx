"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { interactionLocations } from "@/config/interactions.config";
import { snapToTerrain } from "@/utils/terrain-height";
import { setHoveredLocation } from "@/store/app-store";
import type { LocationId } from "@/store/app-store";

interface LocationMarkersProps {
  interactive?: boolean;
}

export function LocationMarkers({ interactive = true }: LocationMarkersProps) {
  const markers = useMemo(
    () =>
      interactionLocations.map((loc) => ({
        ...loc,
        position: snapToTerrain(loc.position[0], loc.position[2], 1.5),
      })),
    []
  );

  return (
    <group>
      {markers.map((loc) => (
        <LocationMarker key={loc.id} location={loc} interactive={interactive} />
      ))}
    </group>
  );
}

function LocationMarker({
  location,
  interactive,
}: {
  location: (typeof interactionLocations)[0] & {
    position: [number, number, number];
  };
  interactive: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = hovered.current ? 1.4 : 1;
    ref.current.scale.lerp(
      new THREE.Vector3(scale, scale, scale),
      0.08
    );
    ref.current.position.y =
      location.position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
  });

  return (
    <mesh
      ref={ref}
      position={location.position}
      onPointerOver={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        hovered.current = true;
        setHoveredLocation(location.id as LocationId);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (!interactive) return;
        hovered.current = false;
        setHoveredLocation(null);
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[0.25, 8, 8]} />
      <meshStandardMaterial
        color="#C9A962"
        emissive="#C9A962"
        emissiveIntensity={hovered.current ? 0.8 : 0.3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}
