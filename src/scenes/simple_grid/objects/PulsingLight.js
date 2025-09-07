import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PulsingLight() {
    const light = useRef();

    useFrame((state) => {
        const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2;
        if (light.current) {
            light.current.intensity = 1 + t * 400;
        }
    });

    return (
        <pointLight
            ref={light}
            color={[1, 0.2, 0.5]}
            distance={200}
        />
    );
}
