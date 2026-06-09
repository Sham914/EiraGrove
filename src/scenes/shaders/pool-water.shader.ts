import * as THREE from "three";

export function createPoolWaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color("#1a6a80") },
      uShallowColor: { value: new THREE.Color("#4ab8d4") },
      uLightColor: { value: new THREE.Color("#80e8ff") },
      uLightIntensity: { value: 0 },
      uSunDirection: { value: new THREE.Vector3(0.5, 1, 0.3).normalize() },
      uReflectivity: { value: 0.65 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.x * 2.5 + uTime * 1.2) * 0.04
                   + sin(pos.y * 3.0 + uTime * 0.9) * 0.03
                   + sin((pos.x + pos.y) * 1.8 + uTime * 1.5) * 0.02;
        pos.z += wave;
        vec4 world = modelMatrix * vec4(pos, 1.0);
        vWorldPos = world.xyz;
        vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 uLightColor;
      uniform float uLightIntensity;
      uniform vec3 uSunDirection;
      uniform float uReflectivity;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        float ripple = sin(vUv.x * 30.0 + uTime * 1.5) * sin(vUv.y * 25.0 + uTime * 1.2) * 0.5 + 0.5;
        vec3 waterColor = mix(uDeepColor, uShallowColor, ripple * 0.4 + 0.3);

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        vec3 normal = normalize(vNormal + vec3(
          sin(vUv.x * 40.0 + uTime) * 0.08,
          sin(vUv.y * 35.0 + uTime * 0.8) * 0.08,
          1.0
        ));
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
        float sunSpec = pow(max(dot(reflect(-viewDir, normal), uSunDirection), 0.0), 64.0);

        vec3 skyReflect = mix(vec3(0.4, 0.6, 0.8), vec3(1.0, 0.7, 0.4), fresnel);
        vec3 color = mix(waterColor, skyReflect, fresnel * uReflectivity);
        color += sunSpec * vec3(1.0, 0.95, 0.85) * 0.6;

        // Underwater glow lights
        float glow = sin(vUv.x * 8.0 + uTime) * sin(vUv.y * 6.0 + uTime * 0.7);
        color += uLightColor * uLightIntensity * max(glow, 0.0) * 0.35;

        gl_FragColor = vec4(color, 0.92);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
