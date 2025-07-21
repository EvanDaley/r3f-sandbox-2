import create from 'zustand';

export const usePeerStore = create((set) => ({
    peer: null,
    peerId: null,
    connections: {},

    setPeer: (peerInstance) => set({ peer: peerInstance }),
    setPeerId: (id) => set({ peerId: id }),

    addConnection: (peerId, conn) =>
        set((state) => ({
            connections: {
                ...state.connections,
                [peerId]: conn,
            },
        })),
}));
