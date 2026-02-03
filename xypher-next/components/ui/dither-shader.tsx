"use client";

import { useEffect, useRef, useCallback } from "react";

interface DitherShaderProps {
    gridSize?: number;
    ditherMode?: "bayer" | "halftone" | "noise";
    colorMode?: "duotone" | "monochrome";
    animated?: boolean;
    animationSpeed?: number;
    primaryColor?: string;
    secondaryColor?: string;
    threshold?: number;
    className?: string;
}

// Bayer matrix for dithering
const bayerMatrix4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
].map(row => row.map(v => v / 16));

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { r: 255, g: 0, b: 0 };
}

export function DitherShader({
    gridSize = 2,
    animated = true,
    animationSpeed = 0.05,
    primaryColor = "#ff0000",
    secondaryColor = "#2b0000",
    threshold = 0.5,
    className = "",
}: DitherShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Create image data
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const time = timeRef.current;

        for (let y = 0; y < height; y += gridSize) {
            for (let x = 0; x < width; x += gridSize) {
                // Create animated noise pattern
                const noise1 = Math.sin((x * 0.01) + time) * 0.5 + 0.5;
                const noise2 = Math.cos((y * 0.01) + time * 0.7) * 0.5 + 0.5;
                const noise3 = Math.sin((x + y) * 0.005 + time * 1.3) * 0.5 + 0.5;

                // Combine noises for organic movement
                let value = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3);

                // Apply Bayer dithering
                const bayerX = Math.floor(x / gridSize) % 4;
                const bayerY = Math.floor(y / gridSize) % 4;
                const bayerValue = bayerMatrix4x4[bayerY][bayerX];

                // Dither decision
                const dithered = value + (bayerValue - 0.5) * 0.3 > threshold;

                // Choose color based on dither
                const color = dithered ? primary : secondary;

                // Fill the grid cell
                for (let dy = 0; dy < gridSize && y + dy < height; dy++) {
                    for (let dx = 0; dx < gridSize && x + dx < width; dx++) {
                        const idx = ((y + dy) * width + (x + dx)) * 4;
                        data[idx] = color.r;
                        data[idx + 1] = color.g;
                        data[idx + 2] = color.b;
                        data[idx + 3] = 255;
                    }
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);

        if (animated) {
            timeRef.current += animationSpeed;
            animationRef.current = requestAnimationFrame(render);
        }
    }, [gridSize, animated, animationSpeed, primary, secondary, threshold]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [render]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: "block" }}
        />
    );
}
