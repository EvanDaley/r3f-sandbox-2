import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';

import Scene1 from './scenes/Scene1';

import useStore from '../../store/store'

export default function ThreeCanvas() {
    const scenes = [
        Scene1,
    ]

    const sceneIndex = useStore(state => state.sceneIndex)

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

