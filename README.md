# SolarSim 3D

Web-based 3D rooftop solar PV (PLTS) simulator built with React, TypeScript, and Three.js.

**Live Demo:** [https://solarsim.web.id](https://solarsim.web.id)

---

## Overview

SolarSim 3D allows users to configure building dimensions, roof geometries, and solar module specifications in real time, then visualize panel placement in 3D alongside hourly energy yield, thermal derating, inverter sizing, and battery storage estimates.

## Key Features

- **3D Roof & Panel Layout (`Three.js`)**
  - Supports flat roofs (with adjustable tilt rack), symmetrical gable roofs (1 or 2 sides), and wide-span industrial/warehouse roofs.
  - Automatic solar module placement with configurable dimensions, Wp rating, inter-panel gap, edge setback, and portrait/landscape orientation.
  - Procedural monocrystalline solar cell texture and 3D inverter/battery rack visualization.
- **Live Sun, Sky & Temperature Simulation (06:00 – 18:00)**
  - Real-time sun trajectory from East to West with dynamic sky lighting (morning, midday, dusk) and shadows.
  - Rotating 3D compass (`N/E/S/W` & `U/T/S/B`) synced with the camera azimuth.
  - Dynamic ambient temperature curve interpolated from customizable daily time slots.
- **Performance Analytics & Battery Chart**
  - Interactive hourly SVG chart comparing panel output (kWh) against cumulative battery storage (kWh / SoC).
  - Switchable between **Live Clock** mode and **Manual** full-day inspection.
  - Thermal derating calculation, inverter DC/AC ratio check with clipping indicator, `Auto Size` recommendation, and backup duration estimation based on battery DoD.
- **Report Export, Themes & Bilingual UI**
  - Export formatted text summaries or print/save executive PDF reports including a live 3D canvas snapshot.
  - Light & Dark architectural CAD themes.
  - Full Indonesian (`ID`) and English (`EN`) language support, including built-in User Guide and Formula documentation pages.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **3D Rendering:** Three.js (`OrbitControls`, `PCFSoftShadowMap`, procedural Canvas textures)
- **State Management:** Zustand
- **Routing:** React Router v7
- **Styling & Icons:** Tailwind CSS v4, Lucide React

## Project Structure

```text
src/
├── components/
│   ├── analytics/        # Time/temp schedule editor & interactive SVG yield chart
│   ├── layout/           # Header (nav, theme & language switchers) and Footer
│   ├── report/           # Report modal & print-ready PDF sheet
│   ├── sidebar-left/     # Building, roof & solar module controls
│   ├── sidebar-right/    # Temperature, inverter & battery calculators
│   ├── ui/               # Reusable sliders and synced numeric inputs
│   └── viewport/         # 3D canvas wrapper, HUD, live sun controls & compass
├── constants/            # Default configuration & residential/factory presets
├── engine/               # Decoupled Three.js engine, textures & 3D builders
├── i18n/                 # Indonesian & English translations
├── layouts/              # Shared MainLayout wrapper
├── pages/                # Simulator, User Guide, Formulas, About & 404 pages
├── routes/               # Centralized React Router configuration
├── store/                # Zustand global state store
├── types/                # TypeScript domain definitions
└── utils/                # Pure solar physics calculator & report formatters
```

## Getting Started

### Prerequisites

- Node.js `v20+`
- npm

### Installation & Development

```bash
git clone https://github.com/hajrilmalik82/solarsim-3d.git
cd solarsim-3d
npm install
npm run dev
```

### Production Build & Lint

```bash
npm run build
npm run lint
```

The production build outputs static files to `dist/` (including `.htaccess`, `robots.txt`, and `sitemap.xml`).

## Author

Created by **hajrilmalik**
Contact: [hajrilmalik82@gmail.com](mailto:hajrilmalik82@gmail.com)
