import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

function asset(path) {
  const base = window.location.pathname.replace(/\/$/, '')
  return `${base}${path}`
}

export default function PracticeBox(props) {
  const { scene } = useGLTF(asset('/models/box.glb'))

  // Memoize a cloned copy so we don’t reuse the disposed original
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return <primitive object={clonedScene} {...props} />
}

useGLTF.preload(asset('/models/box.glb'))
