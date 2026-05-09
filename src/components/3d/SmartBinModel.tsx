"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic outdoor SmartBin — modeled after public smart waste bins.
 * Rectangular cabinet, sage-green plastic body, charcoal lid with hinge,
 * solar panel on top, branded plate, foot pedal, integrated sensor.
 *
 * No glowing rings / sci-fi HUD — just product geometry with PBR materials.
 */

/* ------------------------------------------------------------------ */
/* materials                                                           */
/* ------------------------------------------------------------------ */

const COLORS = {
  body: "#3f5b46",       // sage / muted forest green plastic
  bodyDark: "#2a3f31",
  lid: "#262b2a",        // charcoal lid
  lidLight: "#3a3f3d",
  metal: "#1a1d1b",      // dark metal
  trim: "#84a98c",       // soft sage trim
  pedal: "#1d211e",
  glass: "#0f1614",
  solar: "#0c1838",      // deep blue solar panel
  decal: "#e8efe6",       // off-white sticker
  amber: "#d97706",       // status indicator
};

/* ------------------------------------------------------------------ */
/* parts                                                               */
/* ------------------------------------------------------------------ */

function Body() {
  return (
    <group>
      {/* main cabinet — rounded rectangular box */}
      <RoundedBox
        args={[1.4, 1.9, 1.0]}
        radius={0.08}
        smoothness={6}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={COLORS.body}
          roughness={0.78}
          metalness={0.05}
        />
      </RoundedBox>

      {/* darker recessed front panel */}
      <mesh position={[0, 0.05, 0.502]}>
        <planeGeometry args={[1.15, 1.5]} />
        <meshStandardMaterial
          color={COLORS.bodyDark}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>

      {/* horizontal trim strips on body sides */}
      {[0.75, -0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.503]}>
          <planeGeometry args={[1.18, 0.012]} />
          <meshStandardMaterial color={COLORS.bodyDark} roughness={0.7} />
        </mesh>
      ))}

      {/* opening flap at top of cabinet */}
      <mesh position={[0, 0.65, 0.51]}>
        <planeGeometry args={[0.7, 0.18]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* flap handle */}
      <mesh position={[0, 0.66, 0.515]}>
        <boxGeometry args={[0.18, 0.015, 0.015]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* SmartBin nameplate */}
      <mesh position={[0, 0.32, 0.504]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial color={COLORS.decal} roughness={0.6} />
      </mesh>
      {/* recycling icon block */}
      <mesh position={[0, -0.05, 0.504]}>
        <planeGeometry args={[0.22, 0.22]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.7} />
      </mesh>
      {/* decal: 3 leaf-arrows (stylized as rotated triangles) */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle - Math.PI / 2) * 0.06, -0.05 + Math.sin(angle - Math.PI / 2) * 0.06, 0.505]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.06, 0.025]} />
            <meshStandardMaterial color={COLORS.trim} roughness={0.6} />
          </mesh>
        );
      })}

      {/* "FILL %" small status panel */}
      <mesh position={[-0.42, 0.32, 0.504]}>
        <planeGeometry args={[0.18, 0.08]} />
        <meshStandardMaterial color={COLORS.glass} roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Lid({ lidRef }: { lidRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={lidRef} position={[0, 1.05, 0]}>
      {/* angled top — slight wedge so rain runs off */}
      <RoundedBox
        args={[1.42, 0.18, 1.05]}
        radius={0.04}
        smoothness={5}
        rotation={[-0.05, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={COLORS.lid}
          roughness={0.55}
          metalness={0.25}
        />
      </RoundedBox>

      {/* lid edge highlight */}
      <mesh position={[0, -0.085, 0]}>
        <boxGeometry args={[1.43, 0.01, 1.06]} />
        <meshStandardMaterial color={COLORS.lidLight} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* solar panel inset on top */}
      <mesh position={[0, 0.092, 0.05]} rotation={[-0.05, 0, 0]}>
        <planeGeometry args={[0.95, 0.7]} />
        <meshStandardMaterial
          color={COLORS.solar}
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
      {/* solar grid lines */}
      {[-0.3, 0, 0.3].map((x) => (
        <mesh key={`v-${x}`} position={[x, 0.093, 0.05]} rotation={[-0.05, 0, 0]}>
          <planeGeometry args={[0.005, 0.7]} />
          <meshStandardMaterial color="#1a2547" roughness={0.4} />
        </mesh>
      ))}
      {[-0.25, 0, 0.25].map((z) => (
        <mesh key={`h-${z}`} position={[0, 0.093, 0.05 + z]} rotation={[-0.05, 0, 0]}>
          <planeGeometry args={[0.95, 0.005]} />
          <meshStandardMaterial color="#1a2547" roughness={0.4} />
        </mesh>
      ))}

      {/* hinge at the back */}
      <mesh position={[0, -0.04, -0.5]}>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 16]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.3} metalness={0.85} />
      </mesh>
    </group>
  );
}

function Pedal() {
  return (
    <group>
      {/* foot pedal at front bottom */}
      <mesh position={[0, -1.0, 0.55]}>
        <boxGeometry args={[0.55, 0.04, 0.18]} />
        <meshStandardMaterial color={COLORS.pedal} roughness={0.65} metalness={0.55} />
      </mesh>
      {/* pedal hinge */}
      <mesh position={[0, -1.02, 0.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}

function Base() {
  return (
    <group>
      {/* footing */}
      <mesh position={[0, -1.02, 0]} receiveShadow>
        <boxGeometry args={[1.45, 0.05, 1.05]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* ground shadow disc handled by ContactShadows */}
    </group>
  );
}

function SensorModule({ ledRef }: { ledRef: React.RefObject<THREE.Mesh | null> }) {
  return (
    <group position={[0.5, 0.78, 0.45]}>
      {/* small sensor housing on the lid corner */}
      <RoundedBox args={[0.18, 0.08, 0.12]} radius={0.012} smoothness={4}>
        <meshStandardMaterial color={COLORS.lidLight} roughness={0.4} metalness={0.6} />
      </RoundedBox>
      {/* tiny status LED — subtle blink, not a glow halo */}
      <mesh ref={ledRef} position={[0.06, 0.01, 0.062]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshStandardMaterial
          color={COLORS.amber}
          emissive={COLORS.amber}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      {/* sensor lens (ultrasonic) */}
      <mesh position={[-0.04, 0, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.005, 16]} />
        <meshStandardMaterial color={COLORS.glass} roughness={0.15} metalness={0.6} />
      </mesh>
    </group>
  );
}

function FillIndicator({ level }: { level: number }) {
  const fillRef = useRef<THREE.Mesh>(null);
  const target = level / 100;

  useFrame((_, delta) => {
    if (fillRef.current) {
      fillRef.current.scale.y = THREE.MathUtils.lerp(
        fillRef.current.scale.y,
        Math.max(target, 0.001),
        delta * 2,
      );
    }
  });

  // Status panel front of the bin (top-left), shows fill bar
  const color =
    level >= 80 ? "#dc2626" : level >= 60 ? "#d97706" : "#65a30d";

  return (
    <group position={[-0.42, 0.32, 0.505]}>
      {/* track */}
      <mesh position={[0, -0.02, 0]}>
        <planeGeometry args={[0.14, 0.018]} />
        <meshStandardMaterial color="#0a0e0c" roughness={0.5} />
      </mesh>
      {/* fill bar (origin-left scale) */}
      <mesh ref={fillRef} position={[-0.07, -0.02, 0.001]} scale={[0.001, 1, 1]}>
        <planeGeometry args={[0.14, 0.014]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
      {/* a small "%" text plane (white on dark) */}
      <mesh position={[0, 0.02, 0.001]}>
        <planeGeometry args={[0.07, 0.018]} />
        <meshStandardMaterial color={COLORS.decal} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* main exports                                                        */
/* ------------------------------------------------------------------ */

export function SmartBinModel({ fillLevel = 65 }: { fillLevel?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;

    if (groupRef.current) {
      // gentle parallax — subtle, not aggressive
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.18,
        0.04,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.y * 0.06,
        0.04,
      );
    }
    if (lidRef.current) {
      // very subtle lid breathing
      lidRef.current.rotation.x = Math.sin(t * 0.6) * 0.008;
    }
    if (ledRef.current) {
      // slow blink, no halo
      const m = ledRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + (Math.sin(t * 1.4) > 0.7 ? 1.2 : 0);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} scale={0.8}>
      <Base />
      <Body />
      <Lid lidRef={lidRef} />
      <Pedal />
      <SensorModule ledRef={ledRef} />
      <FillIndicator level={fillLevel} />
    </group>
  );
}

// Kept as no-op export so existing imports don't break — the realistic scene
// no longer uses the glowing background orb.
export function GlowOrb() {
  return null;
}

// HUD callouts removed — realistic look has no floating holographic chips.
export function HudCallouts() {
  return null;
}
