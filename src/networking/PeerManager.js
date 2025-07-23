import Peer from 'peerjs';
import { usePeerStore } from '../stores/peerStore';

export const initPeer = (onConnected) => {
    const { peer, setPeer, setPeerId, setIsHost, addConnection } = usePeerStore.getState();
    if (peer) return peer;

    const newPeer = new Peer();

    newPeer.on('open', (id) => {
        console.log('Your peer ID is:', id);
        setPeerId(id);
    });

    newPeer.on('connection', (conn) => {
        console.log('Incoming connection from', conn.peer);
        setupConnection(conn, onConnected);

        // ON RECEIVING CONNECTION save the notion that [ I AM HOST ]
        setIsHost(true);
    });

    newPeer.on('error', (err) => {
        console.error('PeerJS connection error:', err);
        // You might also want to clear the saved ID if it's causing issues:
    });

    setPeer(newPeer);
    return newPeer;
};

export const connectToPeer = (peerId, onConnected) => {
    const { setIsClient } = usePeerStore.getState();

    const { peer } = usePeerStore.getState();
    const conn = peer.connect(peerId);
    setupConnection(conn, onConnected);

    // ON SENDING CONNECTION save the notion that [ I AM CLIENT ]
    setIsClient(true);
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
