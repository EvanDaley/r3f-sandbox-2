import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei';
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
    } = usePeerConnection();

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={30} zoom={1} />

            <Stage adjustCamera={false} intensity={0.5} contactShadow shadows>
                <OrbitControls
                    rotateSpeed={0.02}
                    autoRotate={false}
                    autoRotateSpeed={-.07}
                    zoomSpeed={0.75}
                    minPolarAngle={Math.PI / 2.20}
                    maxPolarAngle={Math.PI / 2.55}
                />

                <Suspense fallback={null}>
                    {/*<Environment*/}
                    {/*    files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/evening_road_01_2k.hdr"*/}
                    {/*    ground={{ height: 5, radius: 40, scale: 20 }}*/}
                    {/*/>*/}
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
                                {/*<p>Enter your name and a room ID</p>*/}
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
                                <br/>
                                <button onClick={handleConnect}>Join</button>

                                <p>Your Peer ID:</p>
                                <p>{peerId || '...loading'}</p>

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
