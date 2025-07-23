import create from 'zustand';

export const usePeerStore = create((set) => ({
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

    // This ended up not working. Github pages doesn't like the # and it messes up asset loading
    // initFromUrl: () => {
    //     const hash = window.location.hash.substring(1); // Remove the '#' character
    //     const match = hash.match(/^(.+)-([a-f0-9\-]{36})$/i);
    //     if (match) {
    //         const [, name, hostId] = match;
    //         set({ playerName: name, hostId });
    //     }
    // },
}));
