import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import React, { Suspense, useEffect } from 'react';
import { useScene1Store } from '../stores/scene1Store';
import { usePeerStore } from '../stores/peerStore';

export default function Scene({ sceneIndex }) {
    const { clickCounts, isInitialized, initializeScene, initializePlayer } = useScene1Store();
    const { connections, isHost, peerId } = usePeerStore();

    useEffect(() => {
        // Initialize scene when it loads
        if (isHost && !isInitialized) {
            const startTime = Date.now();
            initializeScene(startTime);
            
            // Initialize all connected players
            Object.keys(connections).forEach(playerId => {
                initializePlayer(playerId);
            });

            // Broadcast initialization to all clients
            broadcastSceneInit(startTime);
        } else if (!isHost) {
            // Client: initialize self if not already done
            if (peerId) {
                initializePlayer(peerId);
            }
        }
    }, [isHost, isInitialized, connections, peerId]);

    const handleClick = () => {
        // Everyone uses the same click mechanism
        sendPlayerClick();
    };

    return (
        <>
            <Suspense fallback={null}>
                <Environment preset="studio" background={true} blur={1.5} />
            </Suspense>

            <Stage adjustCamera={false} intensity={0.5} contactShadow shadows>
                <Html transform occlude={'blending'} position={[0, 0, 0]} scale={0.5}>
                    <div style={{
                        padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        textAlign: 'center',
                        minWidth: '300px',
                    }}>
                        <h2>Scene 1 - Click Game!</h2>
                        
                        <button 
                            onClick={handleClick}
                            style={{
                                padding: '20px 40px',
                                fontSize: '18px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        >
                            Click Me!
                        </button>

                        <div>
                            <h3>Click Leaderboard:</h3>
                            {Object.entries(clickCounts).map(([playerId, clicks]) => {
                                const playerName = connections[playerId]?.name || 'Unknown';
                                return (
                                    <div key={playerId} style={{ margin: '5px 0' }}>
                                        {playerName}: {clicks} clicks
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Html>
            </Stage>
        </>
    );
}

function sendPlayerClick() {
    const { connections, isHost, peerId } = usePeerStore.getState();
    
    if (isHost) {
        // Host sends message to themselves via the message router
        const { routeMessage } = require('../networking/MessageRouter');
        routeMessage(peerId, {
            scene: 'scene1',
            type: 'playerClick',
            payload: {}
        });
    } else {
        // Client sends to host (first connection that's not us)
        const hostConnection = Object.values(connections).find(({ conn }) => conn && conn.open);
        if (hostConnection) {
            hostConnection.conn.send({
                scene: 'scene1',
                type: 'playerClick',
                payload: {}
            });
        }
    }
}

function broadcastSceneInit(startTime) {
    const { connections } = usePeerStore.getState();
    const { clickCounts } = useScene1Store.getState();
    
    const message = {
        scene: 'scene1',
        type: 'sceneInit',
        payload: { 
            startTime,
            playerData: { clickCounts }
        }
    };
    
    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send(message);
        }
    });
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
