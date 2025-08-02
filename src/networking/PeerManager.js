// PeerManager.js
import Peer from 'peerjs';
import { usePeerStore } from '../stores/peerStore';
import { routeMessage } from './MessageRouter';
import {getRandomName} from "../helpers/stringHelpers";


// Helper function to detect local development environment and role
const getLocalDevConfig = () => {
    const isLocalhost = window.location.hostname === 'localhost';
    const port = window.location.port;
    const envRole = process.env.REACT_APP_ROLE;
    
    if (!isLocalhost) return null;
    
    const role = envRole || (port === '3001' ? 'client' : 'host');
    const peerId = role === 'host'
        ? 'host-local-dev'
        : `client-local-dev-${Math.floor(Math.random() * 10000)}`;

    const playerName = port === '3000' ? 'Evan' : getRandomName();
    
    return { role, peerId, playerName, isLocalDev: true };
};

export const initPeer = (onConnected) => {
    const { peer, setPeer, setPeerId, setIsHost, setIsClient, addConnection, setPlayerName } = usePeerStore.getState();
    if (peer) return peer;

    const localConfig = getLocalDevConfig();
    const newPeer = localConfig ? new Peer(localConfig.peerId) : new Peer();
    
    // Set player name for localhost development
    if (localConfig && localConfig.playerName) {
        setPlayerName(localConfig.playerName);
        console.log(`Auto-set player name for localhost: ${localConfig.playerName}`);
    }

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
        
        // When we become host, add ourselves to the connections list
        const { playerName, peerId, addConnection: addSelfConnection } = usePeerStore.getState();
        if (playerName && peerId) {
            // Add ourselves as a "connection" for display purposes
            setTimeout(() => {
                addSelfConnection(peerId, null, playerName);
            }, 100);
        }
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
    const { addConnection, playerName, isClient } = usePeerStore.getState();

    conn.on('open', () => {
        console.log('Connected to', conn.peer);
        addConnection(conn.peer, conn);
        
        // If we're a client connecting to host, send our player info
        if (isClient && playerName) {
            conn.send({
                scene: 'common',
                type: 'playerInfo',
                payload: { name: playerName }
            });
        }
        
        onConnected(conn.peer);
    });

    conn.on('data', (data) => {
        console.log('Received from', conn.peer, ':', data);
        routeMessage(conn.peer, data);
    });
}

export const getPeerId = () => usePeerStore.getState().peerId;
