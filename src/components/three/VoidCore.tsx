'use client'

import { useRef } from 'react'
import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { AdditiveBlending } from 'three'
import { useVoidStore } from '@/store/useVoidStore'

export function VoidCore() {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<Mesh>(null)
  const ringARef = useRef<Mesh>(null)
  const ringBRef = useRef<Mesh>(null)
  const overdrive = useVoidStore(state => state.overdrive)

  useFrame((state, delta) => {
    const speed = overdrive ? 3.2 : 0.75
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.18
      groupRef.current.position.x = state.pointer.x * 0.28
      groupRef.current.position.y = state.pointer.y * 0.18
    }
    if (sphereRef.current)
      sphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * (overdrive ? 9 : 3)) * (overdrive ? 0.08 : 0.025))
    if (ringARef.current)
      ringARef.current.rotation.z += delta * speed * 1.7
    if (ringBRef.current)
      ringBRef.current.rotation.x -= delta * speed * 1.25
  })

  return (
    <group ref={groupRef} scale={1.18}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.24, 56, 56]} />
        <meshStandardMaterial
          color="#03030a"
          emissive={overdrive ? '#22d3ee' : '#3b1c72'}
          emissiveIntensity={overdrive ? 3.4 : 1.65}
          roughness={0.28}
          metalness={0.85}
        />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[1.98, 0.028, 16, 180]} />
        <meshBasicMaterial color={overdrive ? '#22d3ee' : '#8b5cf6'} transparent opacity={0.92} blending={AdditiveBlending} />
      </mesh>

      <mesh ref={ringBRef} rotation={[0.25, Math.PI / 2, 0.2]}>
        <torusGeometry args={[2.48, 0.02, 16, 180]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.72} blending={AdditiveBlending} />
      </mesh>

      <mesh rotation={[1.1, 0.4, 0.7]}>
        <torusGeometry args={[2.98, 0.014, 12, 200]} />
        <meshBasicMaterial color="#fb2c36" transparent opacity={overdrive ? 0.72 : 0.38} blending={AdditiveBlending} />
      </mesh>

      <Sparkles count={overdrive ? 180 : 92} scale={6.5} size={overdrive ? 5 : 3} speed={overdrive ? 2.2 : 0.75} color={overdrive ? '#22d3ee' : '#8b5cf6'} />
    </group>
  )
}
