"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { SmartBinModel } from "./SmartBinModel";

/**
 * Product-style render of the SmartBin — soft studio lighting, realistic
 * environment, no bloom / no holographic effects. Looks like a 3D product
 * shot rather than a sci-fi animation.
 */

function StudioLights() {
  return (
    <>
      {/* low ambient so PBR materials read correctly */}
      <ambientLight intensity={0.55} />

      {/* warm key light — front-right, like a softbox */}
      <directionalLight
        position={[3.5, 4, 3.5]}
        intensity={1.5}
        color="#fff4d6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* cool rim light — back-left */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#cfe8d6"
      />

      {/* gentle fill from below */}
      <pointLight position={[0, -2, 1]} intensity={0.25} color="#d6e4d8" />
    </>
  );
}

interface BinSceneProps {
  fillLevel?: number;
  height?: string;
  interactive?: boolean;
}

export default function BinScene({
  fillLevel = 65,
  height = "560px",
  interactive = true,
}: BinSceneProps) {
  return (
    <div style={{ height }} className="w-full">
      <Canvas
        camera={{ position: [3.2, 0.9, 4.4], fov: 38 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <StudioLights />

          <SmartBinModel fillLevel={fillLevel} />

          {/* soft contact shadow under the bin */}
          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.5}
            scale={5}
            blur={2.6}
            far={2.5}
            color="#0a0e0c"
          />

          {/* outdoor / city HDRI for realistic reflections on plastic + lid */}
          <Environment preset="park" environmentIntensity={0.85} />

          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3.2}
              maxPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={0.4}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
