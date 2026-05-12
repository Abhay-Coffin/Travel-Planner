import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 8000;
  const speedMult = 1;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor;

  const positions = useMemo(() => {
    const pos = [];

    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      );
    }

    return pos;
  }, []);

  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    []
  );

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(
    () => ({
      scale: 82,
      speed: 0.9,
      fold: 3.8,
      breath: 0.45,
      turb: 0.65,
    }),
    []
  );

  const addControl = (id, l, min, max, val) => {
    return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speedMult;

    for (let i = 0; i < count; i++) {
      const scale = addControl("scale", "Scale", 20, 160, 82);
      const speed = addControl("speed", "Flow Speed", 0, 3, 0.9);
      const fold = addControl("fold", "4D Fold", 0, 8, 3.8);
      const breath = addControl("breath", "Breathing", 0, 1, 0.45);
      const turb = addControl("turb", "Turbulence", 0, 2, 0.65);

      const n = count > 0 ? count : 1;
      const u = (i + 0.5) / n;
      const g = 2.399963229728653;
      const tau = 6.283185307179586;
      const t = time * speed;

      const strand = i % 13;
      const s = strand / 12.0;
      const q = 2.0 * u - 1.0;
      const shell = Math.sqrt(1.0 - q * q);

      const a = i * g + t * (0.16 + s * 0.18);
      const b = tau * (u * fold + s) - t * (0.11 + s * 0.07);

      const wave1 = Math.sin(a * 2.0 + b * 1.7 + t);
      const wave2 = Math.cos(a * 0.7 - b * 2.3 - t * 1.4);
      const pulse = 1.0 + breath * 0.18 * Math.sin(t * 1.6 + q * 5.0);
      const warp = turb * (0.12 * wave1 + 0.08 * wave2);
      const four = Math.sin(b + fold * Math.sin(a * 0.5 + t * 0.25));

      const r = scale * pulse * (0.18 + 0.82 * shell + warp);
      const theta = a + turb * 0.55 * four + q * fold * 0.35;
      const ring = scale * 0.32 * Math.sin(b + t * 0.4);

      const x = Math.cos(theta) * r + Math.cos(b * 2.0 + t) * ring;
      const y = Math.sin(theta) * r + Math.sin(b * 2.0 - t * 0.6) * ring;
      const z = scale * (q * 1.55 + 0.28 * wave1 + 0.14 * four);

      const shade = 0.5 + 0.5 * Math.sin(theta + b - t);

      target.set(x, y, z);

      color.setHSL(
        (0.58 + u * 0.42 + s * 0.12 + t * 0.025 + shade * 0.04) % 1.0,
        0.86,
        0.43 + 0.24 * shade
      );

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

const NebulaBackground = () => {
  return (
    <div className="nebula__background">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 0.01]} />
        <ParticleSwarm />
        <OrbitControls enableZoom={false} autoRotate />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
};

export default NebulaBackground;