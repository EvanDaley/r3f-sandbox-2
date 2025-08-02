// PeerManager.js
import Peer from 'peerjs';
import { usePeerStore } from '../stores/peerStore';

// Helper function to detect local development environment and role
const getLocalDevConfig = () => {
    const isLocalhost = window.location.hostname === 'localhost';
    const port = window.location.port;
    const envRole = process.env.REACT_APP_ROLE;
    
    if (!isLocalhost) return null;
    
    const role = envRole || (port === '3001' ? 'client' : 'host');
    const peerId = role === 'host' ? 'host-local-dev' : 'client-local-dev';
    
    return { role, peerId, isLocalDev: true };
};

export const initPeer = (onConnected) => {
    const { peer, setPeer, setPeerId, setIsHost, setIsClient, addConnection } = usePeerStore.getState();
    if (peer) return peer;

    const localConfig = getLocalDevConfig();
    const newPeer = localConfig ? new Peer(localConfig.peerId) : new Peer();

    newPeer.on('open', (id) => {
        console.log('Your peer ID is:', id);
        setPeerId(id);
        
        // Auto-connect for local development
        if (localConfig && localConfig.role === 'client') {
            console.log('Auto-connecting client to host...');
            setTimeout(() => {
                connectToPeer('host-local-dev', onConnected);
            }, 1000); // Small delay to ensure host is ready
        }
    });

    newPeer.on('connection', (conn) => {
        console.log('Incoming connection from', conn.peer);
        setupConnection(conn, onConnected);
        setIsHost(true);
    });

    newPeer.on('error', (err) => {
        console.error('PeerJS connection error:', err);
        // You might also want to clear the saved ID if it's causing issues:
    });

    setPeer(newPeer);
    
    // Set initial role for local development
    if (localConfig) {
        if (localConfig.role === 'host') {
            setIsHost(true);
            console.log('Local dev: Set as HOST');
        } else {
            setIsClient(true); 
            console.log('Local dev: Set as CLIENT');
        }
    }
    
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
