"use client";

import { useState, useCallback } from "react";
import { DitherShader } from "@/components/ui/dither-shader";

export function HomeBackground() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 30;
        const y = (e.clientY / innerHeight - 0.5) * 30;
        setOffset({ x, y });
    }, []);

    return (
        <div
            onMouseMove={handleMouseMove}
            className="fixed inset-0 -z-10"
            style={{ pointerEvents: "none" }}
        >
            <div
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: "transform 0.15s linear",
                }}
                className="w-full h-full"
            >
                <DitherShader
                    gridSize={3}
                    ditherMode="bayer"
                    colorMode="duotone"
                    animated={true}
                    animationSpeed={0.03}
                    primaryColor="#4a0000"
                    secondaryColor="#150000"
                    threshold={0.5}
                    className="w-full h-full"
                />
            </div>
            {/* Dark overlay for better text readability */}
            <div
                className="absolute inset-0 bg-black/50"
                style={{ pointerEvents: "none" }}
            />
        </div>
    );
}
