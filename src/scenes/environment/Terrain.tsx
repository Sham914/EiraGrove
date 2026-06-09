"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { terrainConfig, mountainBackdropConfig } from "@/config/resort-layout.config";
import { sampleTerrainHeight } from "@/utils/terrain-height";
import * as heightmap from "@/utils/heightmap";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapability";

interface TerrainProps {
  capabilities: DeviceCapabilities;
}

export function Terrain({ capabilities }: TerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = capabilities.terrainSegments;
  const [hmReady, setHmReady] = useState<boolean>(heightmap.isReady());

  useEffect(() => {
    const cb = () => setHmReady(true);
    heightmap.onReady(cb);
    return () => {
      // no-op: onReady does not return unsubscribe in this minimal API
    };
  }, []);

  const geometry = useMemo(() => {
    const [w, h] = terrainConfig.size;
    const geo = new THREE.PlaneGeometry(w, h, segments, segments);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + terrainConfig.center[0];
      const z = pos.getZ(i) + terrainConfig.center[2];
      const y = sampleTerrainHeight(x, z);
      pos.setY(i, y);

      const t = Math.min(1, Math.max(0, y / 22));
      const r = THREE.MathUtils.lerp(0.14, 0.22, t);
      const g = THREE.MathUtils.lerp(0.28, 0.36, t);
      const b = THREE.MathUtils.lerp(0.1, 0.14, t);
      colors.push(r, g, b);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [segments, hmReady]);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.88}
        metalness={0.01}
        flatShading={false}
      />
    </mesh>
  );
}

export function MountainBackdrop() {
  const peaks = useMemo(() => mountainBackdropConfig.peaks, []);

  return (
    <group>
      {peaks.map((peak, i) => {
        const baseY = sampleTerrainHeight(peak.position[0], peak.position[2]);
        return (
          <group
            key={i}
            position={[peak.position[0], baseY + peak.scale[1] * 0.3, peak.position[2]]}
          >
            <mesh scale={peak.scale}>
              <coneGeometry args={[1, 1, 8]} />
              <meshStandardMaterial
                color={i === 1 ? "#526878" : "#3d5060"}
                transparent
                opacity={0.8 - i * 0.1}
                flatShading
                roughness={0.95}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
