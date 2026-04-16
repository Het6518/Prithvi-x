"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(
    () =>
      [
        [0.68, 0.22, 0.55],
        [-0.48, 0.41, 0.75],
        [0.25, -0.18, 0.93],
        [-0.78, -0.3, 0.44],
        [0.54, 0.62, -0.22],
        [-0.12, -0.56, -0.84]
      ] as const,
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.24) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[1.28, 64, 64]}>
        <meshStandardMaterial
          color="#234936"
          roughness={0.62}
          metalness={0.14}
          emissive="#183726"
          emissiveIntensity={0.48}
        />
      </Sphere>

      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#D4A853" : "#EBF8F0"} />
        </mesh>
      ))}
    </group>
  );
}

export function GlobeScene() {
  return (
    <div className="relative flex h-full min-h-[320px] w-full overflow-hidden rounded-[2rem] border border-white/35 bg-[radial-gradient(circle_at_top,rgba(212,168,83,0.12),transparent_28%),linear-gradient(145deg,rgba(14,26,20,1),rgba(21,47,35,0.95))] shadow-ambient">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 3.6], fov: 42 }}>
          <ambientLight intensity={0.8} color="#dff5e5" />
          <directionalLight position={[2, 3, 2]} intensity={1.2} color="#9cc79c" />
          <pointLight position={[-2, -1, 3]} intensity={2.2} color="#D4A853" />
          <Stars radius={60} depth={40} count={1500} factor={2.8} saturation={0} fade speed={0.65} />
          
          <Float speed={1.1} rotationIntensity={0.24} floatIntensity={0.4}>
            <GlobeMesh />
          </Float>
          
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.45} />
        </Canvas>
      </div>
    </div>
  );
}
