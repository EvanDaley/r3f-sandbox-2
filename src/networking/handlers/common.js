import useSceneStore from '../../stores/sceneStore';
import { usePeerStore } from '../../stores/peerStore';

export function changeScene(fromPeerId, payload) {
    const { sceneId } = payload;
    console.log(`Host ${fromPeerId} requesting scene change to: ${sceneId}`);
    
    // Only allow scene changes from host
    // Note: We could add additional validation here if needed
    useSceneStore.getState().setSceneId(sceneId);
}

export function playerInfo(fromPeerId, payload) {
    const { name } = payload;
    console.log(`Received player info from ${fromPeerId}: ${name}`);
    
    const { updatePlayerName, connections, isHost } = usePeerStore.getState();
    updatePlayerName(fromPeerId, name);
    
    // If we're the host, broadcast updated player list to all clients
    if (isHost) {
        broadcastPlayerList();
        
        // Also send current scene state to catch up the new player
        sendCurrentSceneState(fromPeerId);
    }
}

export function playerList(fromPeerId, payload) {
    const { players } = payload;
    console.log(`Received player list from host:`, players);
    
    // Update our connections with the player names from host
    const { connections, peerId: myPeerId, playerName: myName } = usePeerStore.getState();
    const updatedConnections = { ...connections };
    
    // Add all players from the host's list
    Object.keys(players).forEach(peerId => {
        if (updatedConnections[peerId]) {
            // Update existing connection
            updatedConnections[peerId].name = players[peerId].name;
        } else if (peerId !== myPeerId) {
            // Add new player (but not ourselves)
            updatedConnections[peerId] = {
                conn: null, // Other clients don't have direct connections to each other
                name: players[peerId].name
            };
        }
    });
    
    // Make sure we include ourselves in the list
    if (myPeerId && myName) {
        updatedConnections[myPeerId] = {
            conn: null,
            name: myName
        };
    }
    
    usePeerStore.setState({ connections: updatedConnections });
}

function broadcastPlayerList() {
    const { connections } = usePeerStore.getState();
    
    // Create player list with names
    const players = {};
    Object.keys(connections).forEach(peerId => {
        players[peerId] = {
            name: connections[peerId].name,
            peerId
        };
    });

    console.log(connections)
    
    // Broadcast to all connected clients
    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send({
                scene: 'common',
                type: 'playerList',
                payload: { players }
            });
        }
    });
}

function sendCurrentSceneState(newPlayerId) {
    const { connections } = usePeerStore.getState();
    const newPlayerConnection = connections[newPlayerId];
    
    if (!newPlayerConnection || !newPlayerConnection.conn || !newPlayerConnection.conn.open) {
        return;
    }

    // Get current scene
    const { currentSceneId } = require('../../stores/sceneStore').default.getState();
    
    // Send scene change to new player
    newPlayerConnection.conn.send({
        scene: 'common',
        type: 'changeScene',
        payload: { sceneId: currentSceneId }
    });

    // TODO: Get rid of this
    // Send scene-specific state based on current scene
    if (currentSceneId === 'scene1') {
        const { useScene1Store } = require('../../stores/scene1Store');
        const { clickCounts, sceneStartTime } = useScene1Store.getState();
        
        // Initialize the new player in scene1 store
        const { initializePlayer } = useScene1Store.getState();
        initializePlayer(newPlayerId);
        
        // Send current scene1 state
        newPlayerConnection.conn.send({
            scene: 'scene1',
            type: 'sceneInit',
            payload: {
                startTime: sceneStartTime,
                playerData: { clickCounts }
            }
        });
    }
    
    console.log(`Sent current scene state (${currentSceneId}) to new player ${newPlayerId}`);
}