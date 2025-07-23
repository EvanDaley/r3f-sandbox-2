import { useEffect, useState } from 'react';
import { initPeer, connectToPeer } from '../networking/PeerManager';
import { usePeerStore } from '../stores/peerStore';

export default function usePeerConnection() {
    const [hostId, setHostId] = useState('');
    const peerId = usePeerStore(state => state.peerId);
    const playerName = usePeerStore(state => state.playerName);
    const setPlayerName = usePeerStore(state => state.setPlayerName);
    const connections = usePeerStore(state => state.connections);

    const isConnected = Object.keys(connections).length > 0;

    useEffect(() => {
        initPeer(() => {});
    }, []);

    const handleConnect = () => {
        if (!hostId.trim()) return;
        connectToPeer(hostId.trim(), () => setHostId(''));
    };

    return {
        peerId,
        playerName,
        connections,
        isConnected,
        hostId,
        setHostId,
        setPlayerName,
        handleConnect,
    };
}
