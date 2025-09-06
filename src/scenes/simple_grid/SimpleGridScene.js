import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    useGLTF,
    Stage,
    Grid,
    OrbitControls,
    Environment,
    Box,
    PerspectiveCamera
} from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { easing } from 'maath'
import Characters from "./objects/Characters";
import GridOrbitControls from "./objects/GridOrbitControls";
import GridEffectsComposer from "./effects/GridEffectsComposer";
import UnevenlySpacedGrid from "./objects/UnevenlySpacedGrid";
import PulsingLight from "./objects/PulsingLight";
import ExamplePlane from "../../components/props/examples/ExamplePlane";
import {useSceneInitializer} from "./hooks/useSceneInitializer";

export default function Scene() {
    useSceneInitializer()

    return (
        <>
            <fogExp2 attach="fog" args={['#d0d0ff', 0.05]} />

            <Stage
                intensity={0.5}
                environment="city"
                shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
                adjustCamera={false}
            >
                <Characters/>
            </Stage>

            <PulsingLight/>
            <UnevenlySpacedGrid/>
            <GridOrbitControls/>
            <GridEffectsComposer/>

            <Environment background preset="sunset" blur={0.8} />
        </>
    )
}
