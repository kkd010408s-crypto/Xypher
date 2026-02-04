# 🕵️‍♂️ XYPHER - Advanced Crime Analytics & Intelligence System

![Xypher Banner](https://img.shields.io/badge/XYPHER-CRIME%20INTELLIGENCE-red?style=for-the-badge&logo=security&logoColor=white) 
![Next.js](https://img.shields.io/badge/Built%20With-Next.js%2016-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-cyan?style=flat-square&logo=tailwindcss)
![AI](https://img.shields.io/badge/Powered%20By-Groq%20AI-orange?style=flat-square&logo=openai)

> **"Illuminating the shadows of crime with the light of data."**

## 🚀 Overview

**Xypher** is a cutting-edge **Crime Analytics Dashboard** built to visualize, analyze, and interpret crime statistics across India. Designed for a hackathon context, it solves the problem of "Data Inaccessibility" by transforming raw NCRB (National Crime Records Bureau) numbers into an interactive, high-tech visual experience.

It combines **interactive mapping**, **real-time data visualization**, and **Generative AI** to provide deeply actionable insights for law enforcement, researchers, and citizens.

---

## ✨ Key Features

### 🗺️ **Interactive India Heatmap**
-   **Neon SVG Mapping**: Custom-built SVG map of India with neon-glowing states.
-   **Dynamic Coloring**: States automatically color-code based on crime severity (Green/Low to Red/Critical).
-   **Hover Intelligence**: Instant tooltips showing crime indices and exact figures.

### 📊 **Real-Time Analytics Dashboard**
-   **Multi-Dimensional Analysis**:
    -   **Line Charts**: Trend analysis of top 10 states.
    -   **Pie Charts**: Severity distribution across the country.
    -   **Comparison Bars**: Head-to-head comparison between any two states.
-   **Filterable Data**: Switch between dataset categories instantly (Women, Cyber, Economic, Murder).

### 🤖 **AI-Powered Intelligence**
-   **"AI View" Summaries**: One-click generation of professional executive summaries for any dataset using **Groq AI**.
-   **Crime Assistant Chatbot**: A generic AI chatbot specifically prompted to answer queries about Indian law and crime statistics.

### 👨‍💻 **Developer API Ecosystem**
-   **Public API Access**: Full REST API endpoints for scraping/consuming crime data.
-   **Live Playground**: An interactive, browser-based API tester (like Postman) built right into the app.
-   **Documentation**: Beautiful, developer-centric documentation page.

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** (App Router) | Core application structure and routing. |
| **Language** | **TypeScript** | Type-safe code for reliability. |
| **Styling** | **Tailwind CSS** | Responsive, utility-first high-tech UI design. |
| **Charts** | **Chart.js** & `react-chartjs-2` | Rendering complex data visualizations. |
| **AI Engine** | **Groq API** (Llama 3 70B) | Generating insights and chat responses at lightning speed. |
| **Data Storage** | **JSON** (Local) | Processed NCRB datasets optimized for fast loading. |

---

## 📂 Project Structure

```bash
xypher-next/
├── app/
│   ├── api/                 # Backend API Routes
│   │   ├── ai-overview/     # Endpoint for AI Summaries
│   │   ├── crime-chat/      # Endpoint for Chatbot
│   │   ├── crime-data/      # Endpoint for Data Fetching
│   │   └── crimes/[type]/   # Public Developer API Endpoints
│   ├── dashboard/           # Main Analytics Dashboard Page
│   ├── developer-api/       # API Documentation & Playground
│   └── page.tsx             # Home/Landing Page with Heatmap
├── components/
│   └── IndiaSvgHeatmap.tsx  # Interactive SVG Map Component
├── data/                    # JSON Crime Datasets
│   ├── crimes_against_women_2022.metrics.json
│   ├── cyber_crime_2022.metrics.json
│   └── ...
└── public/                  # Static Assets
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed
- A Groq Cloud API Key (for AI features)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/kkd010408s-crypto/Xypher.git
    cd xypher-next
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Access the App**
    Open `http://localhost:3000` in your browser.

---

## 🎮 User Workflow

1.  **Landing Page**: Users are greeted by the **Cyber-Scan Loading Screen** followed by the interactive **India Heatmap**.
2.  **Exploration**: Hover over states to see quick stats. Click "Access Dashboard" to dive deeper.
3.  **Dashboard**:
    -   Select a crime category (e.g., Cyber Crime).
    -   View detailed charts updating in real-time.
    -   Click the **"AI VIEW"** button for an instant written summary.
    -   Use the **"CHAT AI"** button to ask specific questions.
4.  **For Developers**: Navigate to the `/developer-api` page to test endpoints and integrate Xypher's data into their own apps.

---

## 🏆 Why Xypher? (The Comparison)

Most existing solutions (like government portals) suffer from poor UX, static data, and zero analysis. Xypher bridges this gap.

| Feature | 🏛️ Traditional Govt Data Portals | 📱 Common Crime Apps | 🕵️‍♂️ **XYPHER (Our Solution)** |
| :--- | :--- | :--- | :--- |
| **Data Format** | Static PDFs / Excel Sheets | Simple Lists | **Interactive, Filterable JSON** |
| **User Experience** | Cluttered, Outdated UI | Basic & Generic | **immersive Cyber-Tech Interface** |
| **Analysis** | None (Raw Data Only) | Limited Charts | **Multi-dimensional Analytics** |
| **Insight Generation** | Manual Reading Required | None | **One-Click AI Validation & Summary** |
| **Accessibility** | No API Support | Closed Garden | **Public Developer API & Playground** |
| **Visuals** | Static Maps (Images) | Google Maps Pins | **Live Heatmap with Severity Glow** |

> *"Xypher doesn't just show data; it explains it."*

---

## 💡 Hackathon Impact

**Why Xypher wins:**
1.  **Completeness**: It's not just a frontend; it has working APIs and AI integration.
2.  **UI/UX**: The "Cyberpunk/High-Tech" aesthetic separates it from boring government dashboards.
3.  **Innovation**: Integrating Generative AI to *explain* the charts makes data accessible to non-experts.

---

Made with ❤️ & ☕ by **Team Xypher**
