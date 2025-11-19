
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, Stars, Environment, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// --- PARTICLES FOR CLUSTER SCENE ---
const ClusterParticles = ({ count = 40, color = "#C5A059", radius = 2 }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      temp.push({ position: [x, y, z] as [number, number, number], scale: Math.random() * 0.5 + 0.2 });
    }
    return temp;
  }, [count, radius]);

  return (
    <group>
      {particles.map((p, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
           <Sphere args={[0.1, 16, 16]} position={p.position} scale={p.scale}>
             <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
           </Sphere>
        </Float>
      ))}
    </group>
  );
};

const ConnectionLines = () => {
    // Abstract connections
    return (
        <group>
            <Line points={[[-2, 0, 0], [2, 1, -1]]} color="#stone-300" transparent opacity={0.2} lineWidth={1} />
            <Line points={[[-2, 0, 0], [-1, -2, 1]]} color="#stone-300" transparent opacity={0.2} lineWidth={1} />
            <Line points={[[2, 1, -1], [2, -2, 0]]} color="#stone-300" transparent opacity={0.2} lineWidth={1} />
        </group>
    )
}

export const ClusterHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Cluster 1 */}
        <group position={[-2, 0, 0]}>
            <ClusterParticles count={15} color="#4F46E5" radius={1.5} />
        </group>

        {/* Cluster 2 */}
        <group position={[2.5, 1.5, -1]}>
            <ClusterParticles count={10} color="#9333EA" radius={1.2} />
        </group>
        
        {/* Cluster 3 (The "Gold" Cluster) */}
        <group position={[1, -2, 1]}>
            <ClusterParticles count={12} color="#C5A059" radius={1.3} />
        </group>
        
        <ConnectionLines />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

// --- NETWORK BACKGROUND FOR RESULTS ---
function NeuralNodes({ count = 50 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
       const x = (Math.random() - 0.5) * 15;
       const y = (Math.random() - 0.5) * 10;
       const z = (Math.random() - 0.5) * 5;
       temp.push({ x, y, z, speed: Math.random() * 0.02 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
     if (!meshRef.current) return;
     particles.forEach((particle, i) => {
        // Simple floating animation
        particle.y += Math.sin(Date.now() * 0.001 * particle.speed) * 0.01;
        dummy.position.set(particle.x, particle.y, particle.z);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
     });
     meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#57534e" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export const NetworkBackgroundScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <NeuralNodes count={80} />
        <fog attach="fog" args={['#1c1917', 2, 10]} />
      </Canvas>
    </div>
  );
}
