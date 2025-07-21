import Peer from 'peerjs';
import { usePeerStore } from '../stores/peerStore';

export const initPeer = (onConnected) => {
    const { peer, setPeer, setPeerId, addConnection } = usePeerStore.getState();
    if (peer) return peer;

    const newPeer = new Peer();

    newPeer.on('open', (id) => {
        console.log('Your peer ID is:', id);
        setPeerId(id);
    });

    newPeer.on('connection', (conn) => {
        console.log('Incoming connection from', conn.peer);
        setupConnection(conn, onConnected);
    });

    setPeer(newPeer);
    return newPeer;
};

export const connectToPeer = (peerId, onConnected) => {
    const { peer } = usePeerStore.getState();
    const conn = peer.connect(peerId);
    setupConnection(conn, onConnected);
};

function setupConnection(conn, onConnected) {
    const { addConnection } = usePeerStore.getState();

    conn.on('open', () => {
        console.log('Connected to', conn.peer);
        addConnection(conn.peer, conn);
        onConnected(conn.peer);
    });

    conn.on('data', (data) => {
        console.log('Received from', conn.peer, ':', data);
    });
}

export const getPeerId = () => usePeerStore.getState().peerId;
