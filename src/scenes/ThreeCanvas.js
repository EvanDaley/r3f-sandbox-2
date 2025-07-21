import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';

import Scene1 from './Scene1';

import useSceneStore from '../stores/sceneStore'

export default function ThreeCanvas() {
    const scenes = [
        Scene1,
    ]

    const sceneIndex = useSceneStore(state => state.sceneIndex)

    return (
        <>
            <Canvas dpr={[1, 2]}>
                <Suspense fallback={null}>
                    {React.createElement(scenes[sceneIndex])}
                </Suspense>
            </Canvas>
            <Loader />
        </>
    );
}

