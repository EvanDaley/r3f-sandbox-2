import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import React, { Suspense } from 'react';
import usePeerConnection from '../hooks/usePeerConnection';
import LinesRobot from "../components/characters/LinesRobot"; // Adjust path as needed

export default function WelcomeScreen() {
    const {
        peerId,
        isConnected,
        inputId,
        setInputId,
        handleConnect,
        connections,
    } = usePeerConnection();

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={30} />

            <Suspense fallback={null}>
                <Environment preset="studio" background blur={1.5} />

                <LinesRobot/>
            </Suspense>

            <Stage adjustCamera={false} intensity={0.5} contactShadow shadows>
                <OrbitControls target={[1, 1, 0]} />
                <Html>
                    <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <h1>Welcome!</h1>
                        <p>Your Peer ID: {peerId || '...'}</p>

                        {!isConnected ? (
                            <>
                                <p>Join a friend to start playing!</p>
                                <input
                                    type="text"
                                    placeholder="Enter peer ID"
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                    style={{ marginRight: 10 }}
                                />
                                <button onClick={handleConnect}>Connect</button>
                            </>
                        ) : (
                            <p>Connected to: {Object.keys(connections).join(', ')}</p>
                        )}
                    </div>
                </Html>
            </Stage>
        </>
    );
}
