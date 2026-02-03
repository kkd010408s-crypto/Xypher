"use client";

import { useEffect, useRef, useState } from "react";

// Neon colors matching the severity levels from data
const SEVERITY_COLORS: { [key: string]: string } = {
    "LOW": "#22c55e",      // Neon Green
    "MODERATE": "#eab308", // Neon Yellow
    "ELEVATED": "#ea580c", // Neon Orange
    "HIGH": "#ef4444",     // Neon Red-Orange
    "CRITICAL": "#dc2626", // Neon Red
};

const RISK_LEVELS = ["Low", "Moderate", "Elevated", "High", "Critical"];
const COLORS = ["#22c55e", "#eab308", "#ea580c", "#ef4444", "#dc2626"];

interface CrimeData {
    state: string;
    crime_type: string;
    year: number;
    total_crimes: number;
    crime_index: number;
    severity: string;
}

// Map path indices to state indices (based on typical India SVG path ordering)
// This maps the SVG path order to the data order for proper color assignment
const PATH_TO_STATE_INDEX: { [key: number]: number } = {
    0: 0,   // Andaman & Nicobar
    1: 1,   // Andhra Pradesh
    2: 2,   // Arunachal Pradesh
    3: 3,   // Assam
    4: 4,   // Bihar
    5: 5,   // Chandigarh
    6: 6,   // Chhattisgarh
    7: 7,   // Dadra & Nagar Haveli
    8: 8,   // Goa
    9: 9,   // Gujarat
    10: 10, // Haryana
    11: 11, // Himachal Pradesh
    12: 12, // Jammu & Kashmir
    13: 13, // Jharkhand
    14: 14, // Karnataka
    15: 15, // Kerala
    16: 16, // Madhya Pradesh
    17: 17, // Maharashtra
    18: 18, // Manipur
    19: 19, // Meghalaya
    20: 20, // Mizoram
    21: 21, // Nagaland
    22: 22, // Delhi
    23: 23, // Odisha
    24: 24, // Puducherry
    25: 25, // Punjab
    26: 26, // Rajasthan
    27: 27, // Sikkim
    28: 28, // Tamil Nadu
    29: 29, // Telangana
    30: 30, // Tripura
    31: 31, // Uttar Pradesh
    32: 32, // Uttarakhand
    33: 33, // West Bengal
    34: 34, // Ladakh
    35: 35, // Lakshadweep
};

export default function IndiaSvgHeatmap({ onStateClick, crimeType }: { onStateClick?: (state: string) => void; crimeType?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });
    const [isLoaded, setIsLoaded] = useState(false);
    const [crimeData, setCrimeData] = useState<CrimeData[]>([]);

    // Fetch crime data when crimeType changes
    useEffect(() => {
        const fetchCrimeData = async () => {
            try {
                const response = await fetch(`/api/crime-data?type=${crimeType || 'crimes_against_women'}`);
                const data = await response.json();
                setCrimeData(data);
            } catch (error) {
                console.error("Error fetching crime data:", error);
            }
        };
        fetchCrimeData();
    }, [crimeType]);

    // Colorize map when data is loaded
    useEffect(() => {
        if (!containerRef.current || crimeData.length === 0) return;

        const svg = containerRef.current.querySelector("svg");
        if (!svg) return;

        const paths = svg.querySelectorAll("path");

        // Sort crime data by state name for consistent ordering
        const sortedData = [...crimeData].sort((a, b) => a.state.localeCompare(b.state));

        paths.forEach((path, i) => {
            // Get the corresponding state data based on path index
            const dataIndex = i % sortedData.length;
            const stateData = sortedData[dataIndex];

            let color: string;
            let risk: string;
            let stateName: string;
            let totalCrimes: number;
            let crimeIndex: number;

            if (stateData) {
                color = SEVERITY_COLORS[stateData.severity] || "#6b7280";
                risk = stateData.severity;
                stateName = stateData.state;
                totalCrimes = stateData.total_crimes;
                crimeIndex = stateData.crime_index;
            } else {
                color = "#374151";
                risk = "Unknown";
                stateName = `Region ${i + 1}`;
                totalCrimes = 0;
                crimeIndex = 0;
            }

            // Apply solid neon colors - NO transparency, clear boundaries
            path.setAttribute("fill", color);
            path.setAttribute("fill-opacity", "1");
            path.setAttribute("stroke", "#000000");
            path.setAttribute("stroke-width", "1.5");
            path.setAttribute("stroke-opacity", "1");
            path.style.filter = "none";

            // Update event handlers with real data
            path.onmouseenter = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const containerRect = containerRef.current!.getBoundingClientRect();

                // Highlight on hover with brightness and glow
                target.style.filter = `brightness(1.3) drop-shadow(0 0 8px ${color})`;
                target.setAttribute("stroke", "#ffffff");
                target.setAttribute("stroke-width", "2");

                setTooltip({
                    visible: true,
                    x: e.clientX - containerRect.left,
                    y: e.clientY - containerRect.top - 60,
                    content: `${stateName}\nSeverity: ${risk}\nTotal Crimes: ${totalCrimes.toLocaleString()}\nCrime Index: ${crimeIndex}`
                });
            };

            path.onmouseleave = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                // Reset to solid color with clear border
                target.style.filter = "none";
                target.setAttribute("stroke", "#000000");
                target.setAttribute("stroke-width", "1.5");

                setTooltip(prev => ({ ...prev, visible: false }));
            };

            path.onclick = () => {
                if (onStateClick) onStateClick(stateName);
            };
        });
    }, [crimeData, onStateClick]);

    // Load SVG map
    useEffect(() => {
        const loadMap = async () => {
            try {
                const res = await fetch("/india-map.svg");
                if (!res.ok) return;
                const svgText = await res.text();

                if (containerRef.current) {
                    containerRef.current.innerHTML = svgText;

                    const svg = containerRef.current.querySelector("svg");
                    if (!svg) return;

                    svg.style.width = "100%";
                    svg.style.height = "auto";
                    svg.style.filter = "drop-shadow(0 0 10px rgba(220, 38, 38, 0.1))";

                    // Initial styling for paths
                    const paths = svg.querySelectorAll("path");
                    paths.forEach((path) => {
                        path.style.transition = "all 0.2s ease";
                        path.style.cursor = "pointer";
                        path.setAttribute("fill", "#374151");
                        path.setAttribute("stroke", "#0a0a0a");
                        path.setAttribute("stroke-width", "0.5");
                    });

                    setIsLoaded(true);
                }
            } catch (e) {
                console.error("Map load failed", e);
            }
        };

        loadMap();
    }, []);

    return (
        <div className="relative w-full max-w-3xl mx-auto h-[600px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm">
            {/* Map Container */}
            <div
                ref={containerRef}
                className={`w-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Minimal Loading State */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono animate-pulse text-sm">
                    LOADING GEO_DATA...
                </div>
            )}

            {/* Simple Tooltip */}
            {tooltip.visible && (
                <div
                    className="absolute z-50 pointer-events-none bg-black/90 border border-red-500 text-red-50 p-2 text-xs font-mono rounded shadow-xl whitespace-pre-line leading-relaxed backdrop-blur-md"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: "translateX(-50%)"
                    }}
                >
                    {tooltip.content}
                </div>
            )}

            {/* Simple Legend */}
            {isLoaded && (
                <div className="absolute bottom-4 left-4 flex gap-3 text-[10px] font-mono text-gray-400 bg-black/50 p-2 rounded-lg border border-white/10">
                    {RISK_LEVELS.map((level, i) => (
                        <div key={level} className="flex items-center gap-1">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: COLORS[i],
                                    boxShadow: `0 0 6px ${COLORS[i]}`
                                }}
                            ></span>
                            {level}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
