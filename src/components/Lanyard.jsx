/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import * as THREE from 'three';

const cardGLB = "/lanyard/card.glb";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 35], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
function Band({ maxSpeed = 50, minSpeed = 0 }) {
    const texture = useTexture("/lanyard/lanyard.png");
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  

  const cardTopLerped = useRef(new THREE.Vector3());
  const cardTopTarget = new THREE.Vector3();
  const localAttach = new THREE.Vector3(0, 1.2, 0);
  const cardQuat = new THREE.Quaternion();
  const tempAttach = new THREE.Vector3();
  
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 8, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const { size } = useThree();
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.3]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.2, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2, j3].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        
  
        if (dragged) {
          ref.current.lerped.copy(ref.current.translation());
        } else {
          const actualDistance = ref.current.lerped.distanceTo(ref.current.translation());
          if (actualDistance > 0.001) {
            const clampedDistance = Math.max(0.1, Math.min(1, actualDistance));
            ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
          } else {
            ref.current.lerped.copy(ref.current.translation());
          }
        }
      });

      const cardPos = card.current.translation();
      const cardRotRaw = card.current.rotation();
      cardQuat.set(cardRotRaw.x, cardRotRaw.y, cardRotRaw.z, cardRotRaw.w);
      tempAttach.copy(localAttach).applyQuaternion(cardQuat);
      cardTopTarget.set(
        cardPos.x + tempAttach.x,
        cardPos.y + tempAttach.y,
        cardPos.z + tempAttach.z
      );

 
      if (dragged) {
        cardTopLerped.current.copy(cardTopTarget);
      } else {
        const cardTopDist = cardTopLerped.current.distanceTo(cardTopTarget);
        if (cardTopDist > 0.001) {
          const clampedDist = Math.max(0.1, Math.min(1, cardTopDist));
          cardTopLerped.current.lerp(cardTopTarget, delta * (minSpeed + clampedDist * (maxSpeed - minSpeed)));
        } else {
          cardTopLerped.current.copy(cardTopTarget);
        }
      }

      curve.points[0].copy(cardTopLerped.current);
      curve.points[1].copy(j3.current.lerped);
      curve.points[2].copy(j2.current.lerped);
      curve.points[3].copy(j1.current.lerped);
      curve.points[4].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      const rotY = rot.y;
      if (Math.abs(rotY) > 0.001) {
        card.current.setAngvel({
          x: ang.x,
          y: ang.y - rotY * 0.15,
          z: ang.z
        });
      }
    }
  });

 curve.curveType = 'centripetal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[2, 4.65, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} angularDamping={12} linearDamping={6}   type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.4}
            position={[0, -1.5, -0.05 ]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.9} metalness={0.8} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
       <meshLineMaterial
        color="white"
        depthTest={false}
        resolution={[size.width, size.height]}
        useMap
        map={texture}
        repeat={[-4, 1]}
        lineWidth={2}

      />
      </mesh>
    </>
  );
}