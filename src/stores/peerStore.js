import create from 'zustand';
import { devtools } from 'zustand/middleware';

// Since we have two of the same tab open (client and host), the redux dev tools were going
// crazy. Adding randomness to the name here gives distinct debuggable stores per tab.
const storeName = `PeerStore-${Math.random().toString(36).substr(2, 5)}`
console.log('my store is:', storeName)

export const usePeerStore = create(devtools((set) => ({
    peer: null,
    peerId: null,
    connections: {},
    playerName: '',
    hostId: '',
    isHost: false,
    isClient: false,

    setPeer: (peerInstance) => set({ peer: peerInstance }),
    setPeerId: (id) => set({ peerId: id }),
    setPlayerName: (name) => set({ playerName: name }),
    setHostId: (id) => set({ hostId: id }),
    setIsHost: (isHost) => set({ isHost: isHost }),
    setIsClient: (isClient) => set({ isClient: isClient }),

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
}), { name: storeName }));

if (process.env.NODE_ENV === 'development') {
    window.usePeerStore = usePeerStore;
}