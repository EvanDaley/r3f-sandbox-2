import { useEffect, useState } from 'react';
import { initPeer, connectToPeer } from '../networking/PeerManager';
import { usePeerStore } from '../stores/peerStore';

export default function usePeerConnection() {
    const [inputId, setInputId] = useState('');
    const peerId = usePeerStore(state => state.peerId);
    const connections = usePeerStore(state => state.connections);

    const isConnected = Object.keys(connections).length > 0;

    useEffect(() => {
        initPeer(() => {});
    }, []);

    const handleConnect = () => {
        if (!inputId.trim()) return;
        connectToPeer(inputId.trim(), () => setInputId(''));
    };

    return {
        peerId,
        connections,
        isConnected,
        inputId,
        setInputId,
        handleConnect,
    };
}
