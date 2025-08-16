import React from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Pylon(props) {
    // const texture = useTexture(window.location.href + '/images/textures/flakes.png')
    const texture = useTexture(window.location.href + '/images/sprites/EnergyGenerator.png')

    return (
        <sprite {...props} scale={[3,3,3]}>
            <spriteMaterial map={texture} transparent />
        </sprite>
    )
}

