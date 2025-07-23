import create from 'zustand';
import { devtools } from 'zustand/middleware';

export const usePeerStore = create(devtools((set) => ({
    peer: null,
    peerId: null,
    connections: {},
    playerName: '',
    hostId: '',

    setPeer: (peerInstance) => set({ peer: peerInstance }),
    setPeerId: (id) => set({ peerId: id }),
    setPlayerName: (name) => set({ playerName: name }),
    setHostId: (id) => set({ hostId: id }),

    addConnection: (peerId, conn) =>
        set((state) => ({
            connections: {
                ...state.connections,
                [peerId]: conn,
            },
        })),

    reset: () => set({
        peerId: null,
        playerName: '',
        connections: {},
        peer: null,
    }),
}), { name: 'PeerStore' }));

if (process.env.NODE_ENV === 'development') {
    window.usePeerStore = usePeerStore;
}