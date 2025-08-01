﻿import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import React, { Suspense } from 'react';
import usePeerConnection from '../hooks/usePeerConnection';
import LinesRobot from "../components/characters/LinesRobot"; // Adjust path as needed

export default function WelcomeScreen() {
    const {
        peerId,
        playerName,
        isConnected,
        hostId,
        setHostId,
        setPlayerName,
        handleConnect,
        connections,
        isHost,
    } = usePeerConnection();

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={30} zoom={1} />

            <Stage adjustCamera={false} intensity={0.5} contactShadow shadows>
                <Suspense fallback={null}>
                    <LinesRobot position={[0, .41, 0]}/>
                </Suspense>

                <Html transform occlude={'blending'} position={[-2.9, 1.1, 0]} scale={.3}>
                    <div style={{
                        padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        width: '400px',
                    }}>
                        <h1>Welcome!</h1>

                        {!isConnected ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Peer ID"
                                    value={hostId}
                                    onChange={(e) => setHostId(e.target.value)}
                                    style={{ marginRight: 10 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    style={{ marginRight: 10 }}
                                />
                                <br />
                                <button onClick={handleConnect}>Join</button>

                                <p>Your Peer ID:</p>
                                <p>{peerId || '...loading'}</p>
                            </>
                        ) : (
                            <>
                                <p>Connected to: {Object.keys(connections).join(', ')}</p>
                                {isHost && (
                                    <button onClick={() => console.log('Start Game')}>Start Game</button>
                                )}
                            </>
                        )}
                    </div>
                </Html>
            </Stage>
        </>
    );
}
