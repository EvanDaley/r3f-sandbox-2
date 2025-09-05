import {OrbitControls, Stage, PerspectiveCamera, Environment, Html, OrthographicCamera} from '@react-three/drei';
import React, { Suspense } from 'react';
import { useBirdGame } from './hooks/useBirdGame';
import { useBirdStore} from "./stores/birdStore";
import PracticeBox from "../../components/characters/PracticeBox";

export default function Scene({ sceneIndex }) {
    const { clickCounts, handleClick, playerNames } = useBirdGame();
    const { playerPositions } = useBirdStore();

    return (
        <>

            <Stage adjustCamera={false} intensity={1} contactShadow shadows>
                {Object.entries(playerPositions).map(([playerId, playerPosition]) => {
                    const playerName = playerNames[playerId] || 'Unknown';
                    return (
                        <PracticeBox
                            key={playerId}
                            scale={[0.1, 0.1, 0.1]}
                            // scale={[1, 1, 1]}
                            position={playerPosition}
                        />
                    );
                })}

                <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />
                <OrbitControls
                    minPolarAngle={Math.PI / 10}
                    maxPolarAngle={Math.PI / 1.5}
                    enableZoom={true}
                    rotateSpeed={0.12}
                    enablePan={true}
                    enableRotate={true}
                />

            </Stage>
        </>
    );
}
