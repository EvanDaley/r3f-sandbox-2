// import './App.css';
// import ThreeCanvas from './scenes/ThreeCanvas'
//
// function App() {
//     return (
//         <>
//             <ThreeCanvas/>
//         </>
//     );
// }
//
// export default App;


import React from 'react';
import usePeerConnection from './hooks/usePeerConnection';

export default function App() {
    const {
        peerId,
        isConnected,
        inputId,
        setInputId,
        handleConnect,
        connections,
    } = usePeerConnection();

    return (
        <div style={{ padding: 20 }}>
            <h1>PeerJS + Zustand</h1>
            <p>Your Peer ID: {peerId || '...'}</p>

            {!isConnected ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter peer ID"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                    />
                    <button onClick={handleConnect}>Connect</button>
                </>
            ) : (
                <p>Connected to: {Object.keys(connections).join(', ')}</p>
            )}
        </div>
    );
}
