// useBirdGame.js
import { useEffect } from 'react';
import { useBirdStore } from '../stores/birdStore';
import { usePeerStore } from '../../../stores/peerStore';
import { routeMessage } from '../../../networking/MessageRouter';

export const useBirdGame = () => {
    const { clickCounts, isInitialized, initializeScene, initializePlayer } = useBirdStore();
    const { connections, isHost, peerId } = usePeerStore();

    // Initialize scene when it loads
    useEffect(() => {
        if (isHost && !isInitialized) {
            const startTime = Date.now();
            initializeScene(startTime);

            // Initialize all connected players
            Object.keys(connections).forEach(playerId => {
                initializePlayer(playerId);
            });

            // Broadcast initialization to all clients
            broadcastSceneInit(startTime);
        }
    }, [isHost, isInitialized, connections, peerId]);

    // Handle click events
    const handleClick = () => {
        sendLocalPlayerClick();
    };

    // Map names back onto the clicks. The click array is just ids and click counts
    const getPlayerNames = () => {
        const playerNames = {};
        Object.keys(clickCounts).forEach(playerId => {
            playerNames[playerId] = connections[playerId]?.name || 'Unknown';
        });
        return playerNames;
    };

    return {
        clickCounts,
        handleClick,
        playerNames: getPlayerNames(),
        isInitialized
    };
};

// Networking functions
function sendLocalPlayerClick() {
    const { connections, isHost, peerId } = usePeerStore.getState();
    
    if (isHost) {
        // Host sends message to themselves via the message router
        routeMessage(peerId, {
            scene: 'birdScene',
            type: 'playerClick',
            payload: {}
        });
    } else {
        // Client sends to host (first connection that's not us)
        const hostConnection = Object.values(connections).find(({ conn }) => conn && conn.open);
        if (hostConnection) {
            hostConnection.conn.send({
                scene: 'birdScene',
                type: 'playerClick',
                payload: {}
            });
        }
    }
}

function broadcastSceneInit(startTime) {
    const { connections } = usePeerStore.getState();
    const { clickCounts, playerPositions } = useBirdStore.getState();
    
    const message = {
        scene: 'birdScene',
        type: 'sceneInit',
        payload: { 
            startTime,
            playerData: {
                clickCounts,
                playerPositions
            }
        }
    };

    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send(message);
        }
    });
}