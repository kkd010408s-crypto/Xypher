'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DeveloperApiPage() {
    const [activeTab, setActiveTab] = useState('women');
    const [playgroundCode, setPlaygroundCode] = useState("const response = await fetch('/api/crimes/women');\nconst data = await response.json();\nconsole.log(data);");
    const [playgroundResult, setPlaygroundResult] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const endpoints = [
        {
            id: 'women',
            name: 'Crimes Against Women',
            path: '/api/crimes/women',
            description: 'Retrieve statistical data regarding crimes against women across Indian states/UTs for the year 2025. Includes crime index, severity comparisons, and year-over-year metrics.',
            example: `{
  "success": true,
  "count": 36,
  "data": [
    {
      "state": "Andhra Pradesh",
      "crime_type": "crimes_against_women",
      "year": 2025,
      "total_crimes": 25503,
      "crime_index": 39,
      "severity": "MODERATE",
      "data_type": "official_ncrb_processed",
      "note": "Processed from NCRB Crimes Against Women 2025 state-wise totals."
    },
    ...
  ]
}`
        },
        {
            id: 'cyber',
            name: 'Cyber Crime Metrics',
            path: '/api/crimes/cyber',
            description: 'Access comprehensive data on cyber crimes including fraud, harassment, and IT act violations. Provides severity classifications and regional breakdown.',
            example: `{
  "success": true,
  "count": 36,
  "data": [
    {
      "state": "Karnataka",
      "crime_type": "cyber_crime",
      "year": 2025,
      "total_crimes": 12540,
      "crime_index": 65,
      "severity": "HIGH",
      ...
    }
  ]
}`
        },
        {
            id: 'economic',
            name: 'Economic Offenses',
            path: '/api/crimes/economic',
            description: 'Data related to financial crimes, corruption, and economic offenses. Useful for analyzing financial trend anomalies across regions.',
            example: `{
  "success": true,
  "count": 36,
  "data": [
    {
      "state": "Maharashtra",
      "crime_type": "economic_crime",
      "year": 2025,
      "total_crimes": 15890,
      "crime_index": 72,
      "severity": "HIGH",
      ...
    }
  ]
}`
        },
        {
            id: 'murder',
            name: 'Murder & Homicide',
            path: '/api/crimes/murder',
            description: 'Severe crime statistics focusing on murder and homicide cases. Critical for safety index calculations and regional threat assessment.',
            example: `{
  "success": true,
  "count": 36,
  "data": [
    {
      "state": "Uttar Pradesh",
      "crime_type": "murder_homicide",
      "year": 2025,
      "total_crimes": 3850,
      "crime_index": 85,
      "severity": "CRITICAL",
      ...
    }
  ]
}`
        }
    ];

    const runCode = async () => {
        setIsRunning(true);
        setPlaygroundResult('');

        try {
            // Create a safe execution context
            // eslint-disable-next-line no-new-func
            const executeFetch = new Function('fetch', `
                return (async () => {
                    ${playgroundCode}
                    return data;
                })();
            `);

            const result = await executeFetch(fetch);
            setPlaygroundResult(JSON.stringify(result, null, 2));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setPlaygroundResult(`Error: ${errorMessage}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 p-8 font-mono selection:bg-[#ff3333] selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)]"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent opacity-20"></div>
                <div className="scanlines"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="mb-16 border-b border-[#333] pb-8 flex justify-between items-center">
                    <div>
                        <Link href="/" className="inline-block mb-4 text-[#ff3333] hover:text-red-400 transition-colors tracking-widest text-sm">
                            &lt; RETURN_TO_BASE
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-tech glitch" data-text="DEVELOPER_API">
                            DEVELOPER_API
                        </h1>
                        <p className="mt-4 text-gray-500 max-w-xl">
                            Construct high-fidelity crime analytics applications using Xypher's neural-processed datasets.
                            Raw data access for authorized personnel only.
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-[#ff3333] text-xs tracking-[0.2em] mb-1">SYSTEM_STATUS</div>
                        <div className="text-green-500 font-bold bg-green-500/10 px-3 py-1 inline-block rounded border border-green-500/30">
                            ● ONLINE
                        </div>
                    </div>
                </header>

                {/* Interactive Playground */}
                <div className="mb-12 border border-red-600/30 bg-gradient-to-br from-red-950/10 to-black rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <h2 className="text-2xl font-black text-white tracking-tight font-tech">LIVE_API_PLAYGROUND</h2>
                        <span className="text-xs text-gray-500 ml-auto">Try it live →</span>
                    </div>

                    <p className="text-gray-400 mb-6 text-sm">
                        Test API endpoints directly in your browser. Edit the code and click Run to see live results.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Code Editor */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Code Editor</label>
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-tech text-xs uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isRunning ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            RUNNING...
                                        </>
                                    ) : (
                                        <>▶ RUN CODE</>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={playgroundCode}
                                onChange={(e) => setPlaygroundCode(e.target.value)}
                                className="w-full h-48 bg-black border border-gray-800 text-green-400 p-4 font-mono text-sm rounded focus:outline-none focus:border-red-600 transition-colors resize-none"
                                spellCheck={false}
                            />
                        </div>

                        {/* Results Display */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Live Results</label>
                            <div className="w-full h-48 bg-black border border-gray-800 text-gray-300 p-4 font-mono text-xs rounded overflow-auto custom-scrollbar">
                                {playgroundResult ? (
                                    <pre className="whitespace-pre-wrap">{playgroundResult}</pre>
                                ) : (
                                    <div className="text-gray-600 italic">Results will appear here...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <div className="text-xs text-gray-600 font-bold tracking-widest mb-4 uppercase">Endpoints</div>
                        {endpoints.map((ep) => (
                            <button
                                key={ep.id}
                                onClick={() => setActiveTab(ep.id)}
                                className={`w-full text-left px-4 py-3 text-sm transition-all border-l-2 ${activeTab === ep.id
                                    ? 'border-[#ff3333] bg-[#ff3333]/10 text-white font-bold'
                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                {ep.name}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {endpoints.map((ep) => (
                            <div key={ep.id} className={activeTab === ep.id ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-[#ff3333] text-black font-bold px-2 py-1 text-xs rounded-sm">GET</span>
                                    <code className="text-lg text-white font-tech tracking-wide">{ep.path}</code>
                                </div>

                                <p className="text-gray-400 mb-8 text-lg border-l-4 border-gray-800 pl-4">
                                    {ep.description}
                                </p>

                                <div className="space-y-8">
                                    <div className="neon-card bg-gray-900/50 border border-gray-800 p-6 rounded-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-50 text-xs font-tech text-gray-500">REQUEST_EXAMPLE</div>
                                        <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Client Implementation</h3>

                                        <div className="mockup-code bg-black text-gray-300 p-4 rounded border border-gray-800 text-sm overflow-x-auto">
                                            <pre>
                                                <span className="text-purple-400">const</span> response <span className="text-blue-400">=</span> <span className="text-purple-400">await</span> fetch(<span className="text-green-400">'{ep.path}'</span>);
                                                <span className="text-purple-400">const</span> data <span className="text-blue-400">=</span> <span className="text-purple-400">await</span> response.json();
                                                console.log(data);</pre>
                                        </div>
                                    </div>

                                    <div className="neon-card bg-gray-900/50 border border-gray-800 p-6 rounded-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-50 text-xs font-tech text-gray-500">JSON_RESPONSE</div>
                                        <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Response Structure</h3>

                                        <div className="bg-black p-4 rounded border border-gray-800 text-xs md:text-sm overflow-x-auto max-h-96 custom-scrollbar text-green-400/90 font-tech leading-relaxed">
                                            <pre>{ep.example}</pre>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <a
                                            href={ep.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative px-6 py-3 font-bold text-white transition-all bg-[#ff3333] hover:bg-red-600 overflow-hidden"
                                        >
                                            <span className="absolute w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                                            <span className="relative flex items-center gap-2">
                                                TEST_ENDPOINT_LIVE <span className="text-xs">→</span>
                                            </span>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="mt-20 pt-8 border-t border-[#333] text-center text-xs text-gray-600 font-tech">
                    XYPHER INTELLIGENCE SYSTEMS © 2026 // SECURE CONNECTION ESTABLISHED
                </footer>
            </div>
        </div>
    );
}
