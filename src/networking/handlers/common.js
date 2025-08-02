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