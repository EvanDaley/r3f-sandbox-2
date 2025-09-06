import { Box, Html } from "@react-three/drei";
import React from "react";
import { useSimpleGridStore } from "../stores/simpleGridStore";

export default function Characters() {
    const { playerPositions } = useSimpleGridStore();
    const debugging = true;

    // simple hash → color mapping
    const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan"];

    return (
        <>
            {Object.entries(playerPositions).map(([playerId, playerPosition], index) => {
                const color = colors[index % colors.length];

                return (
                    <Box key={playerId} scale={[0.5, 0.5, 0.5]} position={playerPosition}>
                        <meshStandardMaterial color={color} />
                    </Box>
                );
            })}

            {debugging && (
                <Html>
                    <div style={{
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        maxWidth: "300px"
                    }}>
                        <h4 style={{ margin: "0 0 6px 0" }}>Player Positions</h4>
                        {Object.entries(playerPositions).map(([playerId, pos]) => (
                            <div key={playerId} style={{ marginBottom: "4px" }}>
                                {playerId}: [{pos.map(v => v.toFixed(2)).join(", ")}]
                            </div>
                        ))}
                    </div>
                </Html>
            )}
        </>
    );
}
