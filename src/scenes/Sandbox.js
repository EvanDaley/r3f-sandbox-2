import React, { Suspense } from 'react'
import {
    OrbitControls,
    Stage,
    PerspectiveCamera,
    Environment,
    useAspect,
    useVideoTexture,
    useTexture, OrthographicCamera
} from '@react-three/drei'
import ExamplePlane from "../components/props/examples/ExamplePlane";
import PracticeBox from "../components/characters/PracticeBox";
import LinesRobot from "../components/characters/LinesRobot";

// Helper so all asset paths work in dev + production with subpaths
function asset(path) {
    return `${process.env.PUBLIC_URL}${path}`
}

export default function Scene() {
    return (
        <>
            <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />
            <color attach="background" args={['#ffffff']} />
            <ambientLight intensity={0.3} color="#aaffaa" />

            <Suspense fallback={null}>
                <PracticeBox/>
                <LinesRobot/>
            </Suspense>

            <OrbitControls target={[1, 1, 0]} enabled={false} />
        </>
    )
}
