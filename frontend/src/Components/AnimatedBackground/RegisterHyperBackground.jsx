import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 7000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility
  
  const positions = useMemo(() => {
    const pos = [];
    for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
    return pos;
  }, []);

  // Material & Geom
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(() => ({"scale":55.1,"speed":1.231,"complexity":19.85,"wOffset":1.05,"breath":0.71}), []);
  const addControl = (id, l, min, max, val) => {
      return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;
    const THREE_LIB = THREE;

    if(material.uniforms && material.uniforms.uTime) {
         material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
        // USER CODE START
        const scale = addControl("scale", "Projection Scale", 20, 150, 60);
        const speed = addControl("speed", "Time Dilation", 0.1, 3.0, 0.8);
        const complexity = addControl("complexity", "Fold Complexity", 1, 30, 11);
        const wOffset = addControl("wOffset", "4D Perspective", 1.05, 4.0, 1.3);
        const breathIntensity = addControl("breath", "Breathing", 0.0, 1.0, 0.4);
        
        const t = time * speed;
        const p1 = i / count;
        const p2 = (i * 137.035999) % 1.0;
        const p3 = (i * 57.123456) % 1.0;
        
        const u = p1 * Math.PI * 2.0 * complexity + t;
        const v = p2 * Math.PI * 2.0 * complexity - t * 0.618;
        const w_angle = p3 * Math.PI * 0.5 * (1.0 + breathIntensity * Math.sin(t * 0.5 + p1 * Math.PI * 2.0));
        
        let x4 = Math.cos(u) * Math.cos(w_angle);
        let y4 = Math.sin(u) * Math.cos(w_angle);
        let z4 = Math.cos(v) * Math.sin(w_angle);
        let w4 = Math.sin(v) * Math.sin(w_angle);
        
        const xw_cos = Math.cos(t * 0.7);
        const xw_sin = Math.sin(t * 0.7);
        const x4_rot = x4 * xw_cos - w4 * xw_sin;
        const w4_rot = x4 * xw_sin + w4 * xw_cos;
        x4 = x4_rot;
        w4 = w4_rot;
        
        const yz_cos = Math.cos(t * 0.4);
        const yz_sin = Math.sin(t * 0.4);
        const y4_rot = y4 * yz_cos - z4 * yz_sin;
        const z4_rot = y4 * yz_sin + z4 * yz_cos;
        y4 = y4_rot;
        z4 = z4_rot;
        
        const denom = wOffset - w4;
        const r = denom > 0.0001 ? 1.0 / denom : 0.0;
        
        const finalX = x4 * r * scale;
        const finalY = y4 * r * scale;
        const finalZ = z4 * r * scale;
        
        target.set(finalX, finalY, finalZ);
        
        const rawHue = (w4 * 0.5 + 0.5 + t * 0.15) % 1.0;
        const rawSat = 0.7 + 0.3 * Math.sin(u);
        const rawLight = 0.2 + 0.6 * (r / (1.0 / (wOffset - 1.0)));
        
        const hue = Math.max(0.0, Math.min(1.0, rawHue)) || 0.0;
        const sat = Math.max(0.0, Math.min(1.0, rawSat)) || 0.0;
        const light = Math.max(0.0, Math.min(1.0, rawLight)) || 0.0;
        
        color.setHSL(hue, sat, light);
        
        if (i === 0) {
        setInfo("4D Hopf Fibration", "A stereographically projected hyper-structure undergoing continuous 4D double-rotation.");
        annotate("center", new THREE.Vector3(0, 0, 0), "Singularity");
        }
        // USER CODE END

        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export default function RegisterHyperBackground(){
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate={true} />
        <Effects disableGamma>
            <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}