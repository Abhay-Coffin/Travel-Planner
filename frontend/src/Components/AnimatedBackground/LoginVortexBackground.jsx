import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 7000;
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
      intensity: 11.78,
      scale: 50,
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
      const intensity = addControl("intensity", "Void Turbulence", 1, 50, 20);
      const scale = addControl("scale", "Event Horizon", 50, 300, 150);
      const timeScale = time * 0.5;

      const ratio = i / count;
      const phi = Math.acos(1.0 - 2.0 * ratio);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const n1 =
        Math.sin(theta * 5.0 + timeScale) *
        Math.cos(phi * 5.0 - timeScale);

      const n2 =
        Math.sin(phi * 15.0 - timeScale * 1.5) *
        Math.cos(theta * 15.0 + timeScale * 1.5);

      const n3 = Math.sin(i * 0.01 + timeScale * 2.0);

      const turbulence = (n1 + n2 * 0.5 + n3 * 0.25) * intensity;
      const r = scale + turbulence * 5.0;

      const twist = r * 0.02 * Math.sin(timeScale * 0.5);
      const finalTheta = theta + twist;

      const x = r * Math.sin(phi) * Math.cos(finalTheta);
      const y = r * Math.sin(phi) * Math.sin(finalTheta);
      const z =
        r * Math.cos(phi) +
        Math.sin(r * 0.05 - timeScale * 5.0) * 20.0;

      target.set(x, y, z);

      const colorVal = (n1 + 1.0) * 0.5;
      const hue = 0.0 + colorVal * 0.05;
      const sat = 0.8 + colorVal * 0.2;
      const lit = 0.01 + Math.pow(colorVal, 3.0) * 0.6;

      color.setHSL(hue, sat, lit);

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

const LoginVortexBackground = () => {
  return (
    <div className="login__vortex-bg">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 0.01]} />

        <ParticleSwarm />

        <OrbitControls
          autoRotate
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />

        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
};

export default LoginVortexBackground;