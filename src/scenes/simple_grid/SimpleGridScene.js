import {
    Stage,
    Environment,
} from '@react-three/drei'
import Characters from "./objects/Characters";
import GridOrbitControls from "./objects/GridOrbitControls";
import GridEffectsComposer from "./effects/GridEffectsComposer";
import UnevenlySpacedGrid from "./objects/UnevenlySpacedGrid";
import PulsingLight from "./objects/PulsingLight";
import {useSceneInitializer} from "./hooks/useSceneInitializer";

export default function Scene() {
    useSceneInitializer()

    return (
        <>
            {/*<fogExp2 attach="fog" args={['#d0d0ff', 0.05]} />*/}

            <Stage
                intensity={0.5}
                environment="city"
                shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
                adjustCamera={false}
            >
                <Characters/>
            </Stage>

            {/*<PulsingLight/>*/}
            {/*<PulsingLightWithDebugging/>*/}
            <UnevenlySpacedGrid/>
            <GridOrbitControls/>
            <GridEffectsComposer/>

            <Environment background preset="sunset" blur={0.8} />
        </>
    )
}
