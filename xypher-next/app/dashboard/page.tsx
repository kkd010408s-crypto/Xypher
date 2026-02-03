"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface CrimeData {
    state: string;
    crime_type: string;
    year: number;
    total_crimes: number;
    crime_index: number;
    severity: string;
    data_type: string;
    note: string;
}

export default function Dashboard() {
    const [selectedCrime, setSelectedCrime] = useState("crimes_against_women");
    const [crimeData, setCrimeData] = useState<CrimeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [compareState1, setCompareState1] = useState("");
    const [compareState2, setCompareState2] = useState("");

    // AI Overview states
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiSummary, setAiSummary] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const crimeOptions = [
        { value: "crimes_against_women", label: "Crimes Against Women" },
        { value: "cyber_crime", label: "Cyber Crimes" },
        { value: "economic_crime", label: "Economic Crime" },
        { value: "murder_homicide", label: "Murder/Homicide" },
    ];

    // Union Territories list
    const unionTerritories = [
        "Andaman & Nicobar Islands",
        "Chandigarh",
        "Dadra & Nagar Haveli and Daman & Diu",
        "Delhi",
        "Lakshadweep",
        "Puducherry",
        "Jammu & Kashmir",
        "Ladakh"
    ];

    const comparisonChartRef = useRef<any>(null);
    const lineChartRef = useRef<any>(null);
    const pieChartRef = useRef<any>(null);

    const downloadChart = (ref: any, fileName: string) => {
        if (ref.current) {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = ref.current.toBase64Image();
            link.click();
        }
    };

    useEffect(() => {
        loadCrimeData(selectedCrime);
    }, [selectedCrime]);

    const loadCrimeData = async (crimeType: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/crime-data?type=${crimeType}`
            );
            const data = await response.json();
            setCrimeData(data);

            // Set default comparison states to top 2
            if (data.length > 0) {
                const sorted = [...data].sort((a, b) => b.crime_index - a.crime_index);
                setCompareState1(sorted[0]?.state || "");
                setCompareState2(sorted[1]?.state || "");
            }
        } catch (error) {
            console.error("Error loading crime data:", error);
        } finally {
            setLoading(false);
        }
    };

    // AI Overview functions
    const fetchAiOverview = async () => {
        setAiLoading(true);
        setShowAiModal(true);
        setAiSummary("");
        setCopied(false);

        try {
            const response = await fetch('/api/ai-overview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crimeType: selectedCrime,
                    crimeData: crimeData,
                }),
            });

            const data = await response.json();
            if (data.error) {
                setAiSummary("Error generating summary. Please try again.");
            } else {
                setAiSummary(data.summary);
            }
        } catch (error) {
            console.error("AI Overview Error:", error);
            setAiSummary("Failed to connect to AI service. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(aiSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate states vs union territories
    const getStatesAndUTs = () => {
        const states = crimeData.filter(d => !unionTerritories.includes(d.state));
        const uts = crimeData.filter(d => unionTerritories.includes(d.state));
        return { states: states.length, uts: uts.length };
    };

    // Prepare data for Line Chart (Top 10 states by crime index)
    const getLineChartData = () => {
        const sortedData = [...crimeData]
            .sort((a, b) => b.crime_index - a.crime_index)
            .slice(0, 10);

        return {
            labels: sortedData.map((d) => d.state),
            datasets: [
                {
                    label: "Crime Index",
                    data: sortedData.map((d) => d.crime_index),
                    borderColor: "rgba(220, 38, 38, 1)",
                    backgroundColor: "rgba(220, 38, 38, 0.2)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "rgba(220, 38, 38, 1)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                },
            ],
        };
    };

    // Prepare data for Pie Chart (Severity distribution)
    const getPieChartData = () => {
        const severityCounts: { [key: string]: number } = {};
        crimeData.forEach((d) => {
            severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
        });

        const severityColors: { [key: string]: string } = {
            LOW: "rgba(34, 197, 94, 0.8)",
            MODERATE: "rgba(234, 179, 8, 0.8)",
            ELEVATED: "rgba(249, 115, 22, 0.8)",
            HIGH: "rgba(239, 68, 68, 0.8)",
            CRITICAL: "rgba(220, 38, 38, 0.8)",
        };

        return {
            labels: Object.keys(severityCounts),
            datasets: [
                {
                    label: "States by Severity",
                    data: Object.values(severityCounts),
                    backgroundColor: Object.keys(severityCounts).map(
                        (severity) => severityColors[severity] || "rgba(156, 163, 175, 0.8)"
                    ),
                    borderColor: Object.keys(severityCounts).map(
                        (severity) =>
                            severityColors[severity]?.replace("0.8", "1") ||
                            "rgba(156, 163, 175, 1)"
                    ),
                    borderWidth: 2,
                    hoverOffset: 20,
                },
            ],
        };
    };

    // Prepare data for State Comparison Bar Chart
    const getComparisonChartData = () => {
        const state1Data = crimeData.find(d => d.state === compareState1);
        const state2Data = crimeData.find(d => d.state === compareState2);

        if (!state1Data || !state2Data) return null;

        return {
            labels: [compareState1, compareState2],
            datasets: [
                {
                    label: "Crime Index",
                    data: [state1Data.crime_index, state2Data.crime_index],
                    backgroundColor: [
                        "rgba(220, 38, 38, 0.8)",
                        "rgba(239, 68, 68, 0.8)",
                    ],
                    borderColor: [
                        "rgba(220, 38, 38, 1)",
                        "rgba(239, 68, 68, 1)",
                    ],
                    borderWidth: 2,
                },
                {
                    label: "Total Crimes (scaled)",
                    data: [
                        state1Data.total_crimes / 1000,
                        state2Data.total_crimes / 1000,
                    ],
                    backgroundColor: [
                        "rgba(249, 115, 22, 0.8)",
                        "rgba(234, 179, 8, 0.8)",
                    ],
                    borderColor: [
                        "rgba(249, 115, 22, 1)",
                        "rgba(234, 179, 8, 1)",
                    ],
                    borderWidth: 2,
                },
            ],
        };
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
                labels: {
                    color: "#d1d5db",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 16,
                    },
                },
            },
            title: {
                display: true,
                text: "Top 10 States by Crime Index",
                color: "#dc2626",
                font: {
                    family: "'Share Tech Mono', monospace",
                    size: 20,
                    weight: "bold" as const,
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                titleColor: "#dc2626",
                bodyColor: "#d1d5db",
                borderColor: "#dc2626",
                borderWidth: 1,
                padding: 16,
                titleFont: {
                    size: 16,
                },
                bodyFont: {
                    size: 14,
                },
                displayColors: true,
                callbacks: {
                    label: function (context: any) {
                        return `Crime Index: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(220, 38, 38, 0.1)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 14,
                    },
                },
            },
            x: {
                grid: {
                    color: "rgba(220, 38, 38, 0.1)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 12,
                    },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right" as const,
                labels: {
                    color: "#d1d5db",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 16,
                    },
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: "Severity Distribution",
                color: "#dc2626",
                font: {
                    family: "'Share Tech Mono', monospace",
                    size: 20,
                    weight: "bold" as const,
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                titleColor: "#dc2626",
                bodyColor: "#d1d5db",
                borderColor: "#dc2626",
                borderWidth: 1,
                padding: 16,
                titleFont: {
                    size: 16,
                },
                bodyFont: {
                    size: 14,
                },
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} states (${percentage}%)`;
                    },
                },
            },
        },
    };

    const comparisonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
                labels: {
                    color: "#d1d5db",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 16,
                    },
                },
            },
            title: {
                display: true,
                text: "State Comparison Analysis",
                color: "#dc2626",
                font: {
                    family: "'Share Tech Mono', monospace",
                    size: 20,
                    weight: "bold" as const,
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                titleColor: "#dc2626",
                bodyColor: "#d1d5db",
                borderColor: "#dc2626",
                borderWidth: 1,
                padding: 16,
                titleFont: {
                    size: 16,
                },
                bodyFont: {
                    size: 14,
                },
                callbacks: {
                    label: function (context: any) {
                        if (context.datasetIndex === 1) {
                            return `${context.dataset.label}: ${(context.parsed.y * 1000).toLocaleString()}`;
                        }
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(220, 38, 38, 0.1)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 14,
                    },
                },
            },
            x: {
                grid: {
                    color: "rgba(220, 38, 38, 0.1)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        family: "'Share Tech Mono', monospace",
                        size: 14,
                    },
                },
            },
        },
    };

    const { states, uts } = getStatesAndUTs();

    return (
        <>
            {/* AI Overview Floating Button */}
            <button
                onClick={fetchAiOverview}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-500 text-white font-tech text-xs flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-110 hover:shadow-red-500/50 transition-all duration-300 group"
                title="AI Overview"
            >
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
                <span className="relative z-10 text-center leading-tight">AI<br />VIEW</span>
            </button>

            {/* AI Overview Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl max-h-[80vh] bg-neutral-900 border-2 border-red-600 rounded-lg shadow-2xl shadow-red-500/20 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-red-600/50 bg-black/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <h3 className="text-red-500 font-tech text-lg uppercase tracking-widest">AI_OVERVIEW</h3>
                            </div>
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-4 py-2 border border-red-600 bg-black text-red-600 font-tech text-xs uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300"
                            >
                                CLOSE
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            {aiLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 border-2 border-red-900/50 rounded-lg p-2 bg-neutral-900 fingerprint-scan mb-4">
                                        <div className="scan-beam"></div>
                                    </div>
                                    <p className="text-red-500 font-tech animate-pulse text-lg">
                                        ANALYZING DATA...
                                    </p>
                                    <p className="text-gray-600 font-tech text-sm mt-2">
                                        Generating AI insights
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                        {aiSummary}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!aiLoading && aiSummary && (
                            <div className="p-4 border-t border-red-600/50 bg-black/50">
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full px-6 py-3 border border-red-600 bg-black text-red-600 font-tech text-sm uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        {copied ? "✓ COPIED TO CLIPBOARD" : "> COPY_TEXT"}
                                    </span>
                                    <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="scanlines"></div>

            <div className="min-h-screen bg-black text-white p-6 md:p-10">
                {/* Header */}
                <header className="text-center mb-12 relative">
                    <Link
                        href="/"
                        className="absolute left-0 top-0 z-50 px-6 py-3 border-2 border-red-600 bg-black text-red-500 font-tech text-sm uppercase hover:border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer block"
                    >
                        {"<"} BACK
                    </Link>
                    <h1
                        className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter glitch mb-4"
                        data-text="CRIME ANALYTICS"
                    >
                        CRIME ANALYTICS
                    </h1>
                    <p className="text-gray-400 font-tech text-base md:text-xl">
                        {">"} REAL-TIME INTELLIGENCE DASHBOARD
                    </p>
                </header>

                {/* Dropdown Menu */}
                <div className="max-w-7xl mx-auto mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <label
                            htmlFor="crime-select"
                            className="text-red-500 font-tech text-base md:text-lg uppercase tracking-wider"
                        >
                            {">"} SELECT CRIME TYPE:
                        </label>
                        <select
                            id="crime-select"
                            value={selectedCrime}
                            onChange={(e) => setSelectedCrime(e.target.value)}
                            className="bg-neutral-900 border-2 border-red-900/50 text-white px-8 py-4 rounded-none font-tech text-base md:text-lg focus:outline-none focus:border-red-600 transition-all duration-300 cursor-pointer hover:border-red-700 neon-select"
                        >
                            {crimeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 border-2 border-red-900/50 rounded-lg p-2 bg-neutral-900 fingerprint-scan mb-4">
                            <div className="scan-beam"></div>
                        </div>
                        <p className="text-red-500 font-tech animate-pulse text-xl">
                            LOADING DATA...
                        </p>
                    </div>
                )}

                {/* Charts Container */}
                {!loading && crimeData.length > 0 && (
                    <div className="max-w-7xl mx-auto space-y-12">
                        {/* Statistics Summary Cards - Moved to Top */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 relative overflow-hidden group hover:border-red-600/50 transition-all duration-500">
                                <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-gray-500 font-tech mb-3 uppercase">
                                        STATES
                                    </p>
                                    <p className="text-5xl font-bold text-red-600">
                                        {states}
                                    </p>
                                </div>
                            </div>

                            <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 relative overflow-hidden group hover:border-red-600/50 transition-all duration-500">
                                <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-gray-500 font-tech mb-3 uppercase">
                                        UNION TERRITORIES
                                    </p>
                                    <p className="text-5xl font-bold text-red-600">
                                        {uts}
                                    </p>
                                </div>
                            </div>

                            <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 relative overflow-hidden group hover:border-red-600/50 transition-all duration-500">
                                <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-gray-500 font-tech mb-3 uppercase">
                                        TOTAL CRIMES
                                    </p>
                                    <p className="text-5xl font-bold text-red-600">
                                        {crimeData
                                            .reduce((sum, d) => sum + d.total_crimes, 0)
                                            .toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 relative overflow-hidden group hover:border-red-600/50 transition-all duration-500">
                                <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-gray-500 font-tech mb-3 uppercase">
                                        HIGHEST INDEX
                                    </p>
                                    <p className="text-5xl font-bold text-red-600">
                                        {Math.max(...crimeData.map((d) => d.crime_index))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* State Comparison Section */}
                        <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-900/5 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-2 text-red-500 font-tech text-sm">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        <span>COMPARISON_MODULE: ACTIVE</span>
                                    </div>
                                    <button
                                        onClick={() => downloadChart(comparisonChartRef, 'comparison_analysis.png')}
                                        className="px-4 py-2 border border-red-600 bg-black text-red-600 font-tech text-xs uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">{">"} DOWNLOAD_PNG</span>
                                        <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </button>
                                </div>

                                {/* State Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-red-500 font-tech text-base mb-3 uppercase">
                                            {">"} SELECT STATE 1:
                                        </label>
                                        <select
                                            value={compareState1}
                                            onChange={(e) => setCompareState1(e.target.value)}
                                            className="w-full bg-neutral-900 border-2 border-red-900/50 text-white px-6 py-4 rounded-none font-tech text-base focus:outline-none focus:border-red-600 transition-all duration-300 cursor-pointer hover:border-red-700 neon-select"
                                        >
                                            {crimeData.map((d) => (
                                                <option key={d.state} value={d.state}>
                                                    {d.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-red-500 font-tech text-base mb-3 uppercase">
                                            {">"} SELECT STATE 2:
                                        </label>
                                        <select
                                            value={compareState2}
                                            onChange={(e) => setCompareState2(e.target.value)}
                                            className="w-full bg-neutral-900 border-2 border-red-900/50 text-white px-6 py-4 rounded-none font-tech text-base focus:outline-none focus:border-red-600 transition-all duration-300 cursor-pointer hover:border-red-700 neon-select"
                                        >
                                            {crimeData.map((d) => (
                                                <option key={d.state} value={d.state}>
                                                    {d.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Comparison Chart */}
                                {getComparisonChartData() && (
                                    <div className="h-[450px] md:h-[550px]">
                                        <Bar ref={comparisonChartRef} data={getComparisonChartData()!} options={comparisonChartOptions} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-900/5 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-2 text-red-500 font-tech text-sm">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        <span>CHART_ID: LINE_001</span>
                                    </div>
                                    <button
                                        onClick={() => downloadChart(lineChartRef, 'crime_index_trends.png')}
                                        className="px-4 py-2 border border-red-600 bg-black text-red-600 font-tech text-xs uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">{">"} DOWNLOAD_PNG</span>
                                        <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </button>
                                </div>
                                <div className="h-[450px] md:h-[550px]">
                                    <Line ref={lineChartRef} data={getLineChartData()} options={lineChartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="neon-card border border-neutral-800 bg-neutral-900/50 p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-900/5 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-2 text-red-500 font-tech text-sm">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        <span>CHART_ID: PIE_001</span>
                                    </div>
                                    <button
                                        onClick={() => downloadChart(pieChartRef, 'severity_distribution.png')}
                                        className="px-4 py-2 border border-red-600 bg-black text-red-600 font-tech text-xs uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">{">"} DOWNLOAD_PNG</span>
                                        <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </button>
                                </div>
                                <div className="h-[450px] md:h-[550px]">
                                    <Pie ref={pieChartRef} data={getPieChartData()} options={pieChartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-16 text-center text-sm font-tech text-gray-600">
          // DATA SOURCE: NCRB 2025 // SYSTEM STATUS: ACTIVE //
                </div>
            </div>
        </>
    );
}
