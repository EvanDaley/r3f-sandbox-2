import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import React, { Suspense } from 'react';

export default function Scene({ sceneIndex }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={30} />

            <Suspense fallback={null}>
                <Environment preset="studio" background={true} blur={1.5} />
            </Suspense>

            <Stage adjustCamera={false} intensity={0.5} contactShadow shadows>
                <OrbitControls target={[1, 1, 0]} />
                <Html>
                    <p>
                        hello world 2<br />


                    </p>
                </Html>
            </Stage>
        </>
    );
}
//
// import { broadcast } from '../networking/PeerManager';
//
// const sendMyPosition = (pos) => {
//     broadcast({
//         scene: 'scene1',
//         type: 'positionUpdate',
//         payload: { x: pos.x, y: pos.y, z: pos.z },
//     });
// };
