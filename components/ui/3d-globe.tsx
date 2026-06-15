"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label: string;
}

export interface GlobeConfig {
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
}

interface Globe3DProps {
  markers: GlobeMarker[];
  config?: GlobeConfig;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

/* ── Mouse tracking shared state ── */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

function useGlobalMouse() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalized -1 to 1
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

/* ── Pulsing pin dot ── */
function PinDot({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = (clock.getElapsedTime() * 1.2) % 1;
      ringRef.current.scale.setScalar(1 + t * 2.0);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = (1 - t) * 0.55;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} wireframe depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Earth texture ── */
function GlobeTextured({ radius, atmoColor }: { radius: number; atmoColor: string }) {
  const texture = useLoader(THREE.TextureLoader, "/earth-night.jpg") as THREE.Texture;
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <>
      <mesh>
        <sphereGeometry args={[radius, 72, 72]} />
        <meshPhongMaterial
          map={texture}
          shininess={22}
          specular={new THREE.Color("#1a3566")}
          emissive={new THREE.Color("#000814")}
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* coordinate wireframe */}
      <mesh>
        <sphereGeometry args={[radius + 0.008, 36, 36]} />
        <meshBasicMaterial color={atmoColor} wireframe transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </>
  );
}

/* ── Connection Arc Component ── */
function ConnectionArc({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const pStart = new THREE.Vector3(...start);
  const pEnd = new THREE.Vector3(...end);

  // Calculate mid point
  const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
  // Scale it out to create a 3D arc above the globe
  const distance = pStart.distanceTo(pEnd);
  mid.normalize().multiplyScalar(2.0 + distance * 0.25); // radius is 2.0

  const curve = new THREE.QuadraticBezierCurve3(pStart, mid, pEnd);
  const points = curve.getPoints(40);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.0}
      transparent
      opacity={0.3}
    />
  );
}

/* ── Main globe group with mouse-driven tilt ── */
function GlobeInner({ markers, config = {}, onMarkerClick, onMarkerHover }: Globe3DProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const tiltRef   = useRef<THREE.Group>(null);
  const autoRotY  = useRef(0);

  useGlobalMouse();

  useFrame(() => {
    // Lerp mouse toward actual position
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    // Self-rotate
    const speed = config.autoRotateSpeed !== undefined ? config.autoRotateSpeed : 0.25;
    autoRotY.current += speed * 0.005;

    if (groupRef.current) {
      groupRef.current.rotation.y = autoRotY.current;
    }

    // Mouse tilt on outer group (completely decoupled from continuous rotation)
    if (tiltRef.current) {
      tiltRef.current.rotation.x += (-mouse.y * 0.35 - tiltRef.current.rotation.x) * 0.08;
      tiltRef.current.rotation.y += ( mouse.x * 0.35 - tiltRef.current.rotation.y) * 0.08;
    }
  });

  const radius = 2.0;
  const atmoColor = config.atmosphereColor || "#38bdf8";

  const getCoords = (lat: number, lng: number, r: number): [number, number, number] => {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z =   r * Math.sin(phi) * Math.sin(theta);
    const y =   r * Math.cos(phi);
    return [x, y, z];
  };

  // Predefined index connection pairs
  const connections = [
    [0, 1], [1, 2], [1, 9], [0, 7], [2, 3], [3, 11], [11, 5], [9, 5], [8, 12], [12, 2], [4, 1], [7, 10]
  ];

  return (
    <group ref={tiltRef}>
      <group ref={groupRef}>
        {/* Earth */}
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[radius, 48, 48]} />
              <meshPhongMaterial color="#0c1a2e" emissive={new THREE.Color("#001a3a")} emissiveIntensity={0.6} />
            </mesh>
          }
        >
          <GlobeTextured radius={radius} atmoColor={atmoColor} />
        </Suspense>

        {/* Inner atmosphere */}
        <mesh>
          <sphereGeometry args={[radius * 1.03, 48, 48]} />
          <meshBasicMaterial
            color={atmoColor}
            transparent opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Outer corona */}
        <mesh>
          <sphereGeometry args={[radius * 1.1, 48, 48]} />
          <meshBasicMaterial
            color={atmoColor}
            transparent opacity={0.025}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Connection Arcs */}
        {connections.map(([fromIdx, toIdx], i) => {
          const fromMarker = markers[fromIdx];
          const toMarker = markers[toIdx];
          if (!fromMarker || !toMarker) return null;
          const startPos = getCoords(fromMarker.lat, fromMarker.lng, radius);
          const endPos = getCoords(toMarker.lat, toMarker.lng, radius);
          return (
            <ConnectionArc
              key={i}
              start={startPos}
              end={endPos}
              color={atmoColor}
            />
          );
        })}

        {/* Markers */}
        {markers.map((marker, idx) => {
          const surfacePos = getCoords(marker.lat, marker.lng, radius);
          const floatPos   = getCoords(marker.lat, marker.lng, radius + 0.44);
          return (
            <group key={`${marker.label}-${idx}`}>
              <Line
                points={[surfacePos, floatPos]}
                color={atmoColor}
                lineWidth={0.8}
                transparent
                opacity={0.4}
              />
              <PinDot position={surfacePos} color={atmoColor} />
              <group position={floatPos}>
                <Html distanceFactor={6} center occlude={false}>
                  <div
                    className="group/m relative flex flex-col items-center cursor-pointer select-none"
                    style={{ transform: "translateZ(0)" }}
                    onClick={() => onMarkerClick?.(marker)}
                    onMouseEnter={() => onMarkerHover?.(marker)}
                    onMouseLeave={() => onMarkerHover?.(null)}
                  >
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        width: 28, height: 28,
                        boxShadow: `0 0 14px 4px ${atmoColor}55`,
                        borderRadius: "50%",
                        left: "50%", top: "50%",
                        transform: "translate(-50%,-50%)",
                      }}
                    />
                    <div
                      className="relative rounded-full overflow-hidden transition-transform duration-200 group-hover/m:scale-125"
                      style={{
                        width: 26, height: 26,
                        border: `1.5px solid ${atmoColor}`,
                        background: "#060810",
                        boxShadow: `0 0 8px ${atmoColor}66`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={marker.src}
                        alt={marker.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        draggable={false}
                      />
                    </div>
                    {/* Tooltip */}
                    <div
                      className="absolute opacity-0 group-hover/m:opacity-100 transition-opacity duration-150 pointer-events-none"
                      style={{
                        top: 30,
                        whiteSpace: "nowrap",
                        background: "rgba(6,6,12,0.95)",
                        border: "1px solid rgba(56,189,248,0.2)",
                        borderRadius: 3,
                        padding: "2px 8px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: "#38bdf8",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.8)",
                      }}
                    >
                      {marker.label}
                    </div>
                  </div>
                </Html>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export function Globe3D({ markers, config, onMarkerClick, onMarkerHover }: Globe3DProps) {
  return (
    <div className="relative h-full w-full">
      {/* Deep space glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 55% 50%, rgba(56,189,248,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative h-full w-full z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.2} color="#0a1a3a" />
          <directionalLight position={[4, 2, 4]}   intensity={1.8} color="#b8d4ff" />
          <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#ff3366" />
          <pointLight position={[0, 6, 0]} intensity={0.4} color="#38bdf8" distance={20} />
          <GlobeInner
            markers={markers}
            config={config}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Canvas>
      </div>
    </div>
  );
}
