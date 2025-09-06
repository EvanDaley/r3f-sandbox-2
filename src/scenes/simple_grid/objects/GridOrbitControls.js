import {Box, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import React from "react";

export default function GridOrbitControls(props) {

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[-15, 0, 10]}
                fov={25}
            />

            <OrbitControls
                autoRotate
                autoRotateSpeed={0.00}
                enableZoom={true}
                makeDefault
                // minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                onChange={(e) => {
                    const cam = e.target.object
                    if (cam.position.y < 0) {
                        cam.position.y = 0     // clamp to ground
                    }
                }}
            />
        </>
    );
}
