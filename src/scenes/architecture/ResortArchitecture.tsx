"use client";

import { useMemo } from "react";
import { buildingsConfig } from "@/config/resort-layout.config";
import type { BuildingConfig } from "@/config/resort-layout.config";
import {
  snapToTerrain,
  getGroundedRotation,
  sampleTerrainHeight,
} from "@/utils/terrain-height";
import { EntranceGate } from "./EntranceGate";
import { ReceptionPavilion } from "./ReceptionPavilion";
import { PrivateCottage } from "./PrivateCottage";
import { LuxuryVilla } from "./LuxuryVilla";
import { Gazebo } from "./Gazebo";
import { Signage } from "./Signage";

interface ResortArchitectureProps {
  architecturalLightIntensity: number;
}

function FoundationPad({
  x,
  z,
  width,
  depth,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
}) {
  const y = sampleTerrainHeight(x, z);
  return (
    <mesh position={[x, y + 0.08, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#6a6058" roughness={0.95} />
    </mesh>
  );
}

function BuildingInstance({
  building,
  lightIntensity,
}: {
  building: BuildingConfig;
  lightIntensity: number;
}) {
  const [bx, , bz] = building.position;
  const userRotY = building.rotation?.[1] ?? 0;

  const grounded = useMemo(() => {
    const pos = snapToTerrain(bx, bz, 0);
    const tilt = getGroundedRotation(bx, bz);
    return {
      position: pos,
      rotation: [tilt[0], userRotY, tilt[2]] as [number, number, number],
    };
  }, [bx, bz, userRotY]);

  const props = {
    position: grounded.position,
    rotation: grounded.rotation,
    lightIntensity,
  };

  switch (building.type) {
    case "entrance-gate":
      return (
        <>
          <FoundationPad x={bx} z={bz} width={14} depth={10} />
          <EntranceGate {...props} />
        </>
      );
    case "reception-pavilion":
      return (
        <>
          <FoundationPad x={bx} z={bz} width={12} depth={10} />
          <ReceptionPavilion {...props} />
        </>
      );
    case "private-cottage":
      return (
        <>
          <FoundationPad x={bx} z={bz} width={6} depth={5} />
          <PrivateCottage {...props} />
        </>
      );
    case "luxury-villa":
      return <LuxuryVilla {...props} />;
    case "gazebo":
      return (
        <>
          <FoundationPad x={bx} z={bz} width={5} depth={5} />
          <Gazebo position={grounded.position} rotation={grounded.rotation} />
        </>
      );
    case "signage":
      return <Signage {...props} />;
    default:
      return null;
  }
}

export function ResortArchitecture({
  architecturalLightIntensity,
}: ResortArchitectureProps) {
  return (
    <group>
      {buildingsConfig.map((building) => (
        <BuildingInstance
          key={building.id}
          building={building}
          lightIntensity={architecturalLightIntensity }
        />
      ))}
    </group>
  );
}
