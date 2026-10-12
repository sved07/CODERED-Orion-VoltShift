# VoltShift

**Carbon-aware load shifting for AI training and commercial EV charging.**

VoltShift is a demonstration app that models flexible industrial electricity use across four U.S. grid regions: CAISO, ERCOT, PJM, and MISO. It compares an autonomous schedule with a steady baseline, explains dispatch choices, and estimates carbon and energy-cost differences.

> VoltShift is a simulator. It does not control real grid assets, data centers, or vehicle chargers. Grid conditions and savings are estimates when live data is unavailable.

> **Credential cleanup required:** The current source includes third-party API key values in tracked files and fallback code. Treat them as exposed: revoke and replace them, remove the hard-coded values, and do not copy the existing `.env.example` into `.env`.

## What you can explore

- **Grid map:** Explore regional carbon intensity and renewable share, with facility locations.
- **Workloads:** See AI training jobs and EV depot charging, their power use, progress, and deadlines.
- **AI audit:** Read why the agent boosts, maintains, throttles, or defers each workload. Gemini explanations are optional; a built-in advisor is available as a fallback.
- **ISO analytics:** Compare regions and review modeled grid and workload metrics.
- **Scenario controls:** Change the simulated hour, compare autonomous dispatch with the unmanaged baseline, or trigger a gas peaker event.

## Run the main app

The repository root contains a Node.js server that serves the React app and its WebSocket telemetry together. This is the recommended way to run the demo. You do not need Python for this setup.

### Requirements

- Node.js 20.19+ or 22.12+
- npm
- Internet access to install packages and load online map tiles

Check your versions from the repository root:

```bash
node -v
npm -v
```

Clone the repository if you have not already:

```bash
git clone https://github.com/sved07/CODERED-Orion-VoltShift.git
cd CODERED-Orion-VoltShift
```

### Install and start

```bash
npm install --save-dev 'esbuild@^0.28.2'
npm run dev
```

The first command installs the dependencies and updates the root `package.json` to resolve its existing esbuild/Vite version conflict. It also creates or updates `package-lock.json`. Open the address printed by the server. By default, it is **http://localhost:3000**. Stop the server with **Ctrl+C**.

## Optional API configuration

After removing hard-coded provider-key fallbacks from `server.ts`, create a **root-level `.env`** for server-only keys. Use newly issued credentials only:

```dotenv
GEMINI_API_KEY=your_new_gemini_key
ELECTRICITY_MAPS_KEY=your_electricity_maps_key
EIA_API_KEY=your_eia_key
NREL_API_KEY=your_nrel_key
```

Restart the server after changing environment variables. When provider keys are absent or unavailable, the demo uses modeled grid data and rule-based explanations where supported.

To use your own Mapbox basemap token, create a **root-level `.env.local`**:

```dotenv
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

Mapbox tokens used in a browser are public. Restrict the token to your local development URL and deployed site in your Mapbox account. Without a working Mapbox token, the map has a fallback basemap.

## Alternative: Python FastAPI + Vite

The repository also includes a separate implementation under `voltshift/backend` and `voltshift/frontend`. Use this option if you specifically want to run the FastAPI backend. Start the services in two terminals; do not start this stack alongside the root Node server on the same ports.

### Terminal 1: backend

```bash
cd voltshift/backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

On Windows PowerShell, activate the environment with:

```powershell
.venv\Scripts\Activate.ps1
```

### Terminal 2: frontend

```bash
cd voltshift/frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The FastAPI docs are at **http://localhost:8000/docs**. For this frontend, the optional Mapbox variable is named `VITE_MAPBOX_TOKEN`; check `voltshift/frontend/.env.example` for the local setup details.

For Gemini explanations in this version, create `voltshift/backend/.env` with a newly issued `GEMINI_API_KEY`. Keep that file private and out of Git.

## Project layout

```text
.
├── server.ts                 # Main Node/Express server and WebSocket telemetry
├── src/                      # Main React app, pages, components, and styles
├── package.json              # Main app commands and dependencies
└── voltshift/
    ├── backend/              # Alternative FastAPI implementation
    └── frontend/             # Vite frontend for the FastAPI implementation
```

The main server streams telemetry at `/ws/grid-telemetry`. The alternative FastAPI backend exposes the same WebSocket path on port 8000.

## Useful commands

From the repository root:

```bash
npm run lint    # TypeScript check
npm run build   # Build the main frontend
npm run preview # Preview the built frontend
```

For backend tests in the FastAPI version:

```bash
cd voltshift/backend
source .venv/bin/activate
python -m unittest discover -s tests -v
```

## Troubleshooting

- **`ENOENT` for `package.json`:** Open a terminal in the outer repository folder, beside `server.ts` and `src/`. Do not run the root commands from `voltshift/backend` or `voltshift/frontend`.
- **`ERESOLVE` mentions `esbuild` and Vite:** Run the install command shown above, then `npm run dev`.
- **Port 3000 is busy:** Stop the other process using it, or set `PORT=3001` in the root `.env` and open `http://localhost:3001`.
- **Map tiles do not load:** Check your internet connection and Mapbox token restrictions. The dashboard can still show modeled grid data.
- **Only built-in explanations appear:** Add a valid Gemini key to the root `.env`, restart the server, and check the server terminal for API errors.

## Security

Never commit private API keys or paste them into client-side code. Keep server keys in `.env`; do not put Gemini, Electricity Maps, EIA, or NREL keys in variables beginning with `VITE_`. The Mapbox public token is designed for browser use, but should still be restricted by URL.

If a key has already been committed or shared, revoke it with its provider and replace it. Remove any hard-coded provider key values from source files and `.env.example` before publishing the repository.

## Data notes

Grid forecasts, renewable shares, workload flexibility, and savings are simulation outputs unless a configured provider supplies current data. Cost savings use modeled energy prices, not a utility bill or demand-charge calculation. Results are for demonstration and comparison, not operational decisions.
