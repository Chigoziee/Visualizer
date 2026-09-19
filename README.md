# Visualizer

A tool that connects to data sources (PostgreSQL, MySQL, MongoDB, CSV) and uses an LLM
(OpenAI, Anthropic, or LiteLLM) to turn natural-language prompts into charts.

FastAPI backend + React (Vite) frontend, in one repo, servable from a single container.

## Backend setup

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -e ".[dev]"
copy .env.example .env        # then fill in the encryption key (LLM API keys are optional here — see below)
```

## Frontend setup

```bash
cd frontend
npm install
```

## Development (backend + frontend separately, with hot reload)

```bash
# Terminal 1
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd frontend
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api/*` requests to the backend on port 8000.

Interactive API docs: http://localhost:8000/docs

## API keys

LLM provider credentials (OpenAI, Anthropic, LiteLLM) can be set two ways:

- **In the app**: Settings page → API Keys. Keys are encrypted at rest in the database and
  take effect immediately, no restart needed.
- **Via environment variables**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `LITELLM_API_KEY` /
  `LITELLM_API_BASE` (see `.env.example`). Used as a fallback whenever a provider has no key
  set in the app.

A key set in the app always takes precedence over the matching environment variable.

## Test databases (Docker)

Spin up disposable Postgres/MySQL/MongoDB containers, each pre-seeded with sample data,
to exercise the real connectors instead of just CSV:

```bash
docker compose -f docker-compose.test-db.yml up -d
```

Add each as a connection in the app (Data Sources → Add Connection) with:

| Type | Host | Port | Database | Username | Password | Sample table/collection |
|---|---|---|---|---|---|---|
| PostgreSQL | localhost | 5432 | analytics | testuser | testpass | `orders` (150 rows) |
| MySQL | localhost | 3306 | customers_db | testuser | testpass | `customers` (120 rows) |
| MongoDB | localhost | 27017 | activity | testuser | testpass | `events` (200 docs) |

**If the backend itself is running inside a Docker container** (e.g. you ran the app via
`docker run ... visualizer` rather than `uvicorn` locally), use **`host.docker.internal`**
instead of `localhost` as the Host Address — `localhost` inside that container refers to
the container itself, not your machine, so it can't reach the test-db containers' published
ports. `host.docker.internal` is Docker Desktop's built-in DNS name for the host machine.

Tear down and reset the seed data with:

```bash
docker compose -f docker-compose.test-db.yml down
```

Seed scripts live in `dev/seed/` — edit them and re-run `down` + `up` to reseed with
different data. This compose file is dev/test tooling only; it's unrelated to the
production `Dockerfile` and is excluded from its build context.

## Test

```bash
pytest
```

## Production build (single process serving both)

```bash
cd frontend
npm run build          # outputs to ../frontend_dist
cd ..
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

FastAPI serves the built frontend (with client-side routing support) alongside the API
on the same port whenever `frontend_dist/` exists.

## Docker (single image, single container)

```bash
docker build -t visualizer .
docker run -p 8000:8000 -e APP_ENCRYPTION_KEY= -v visualizer_data:/srv/data -v visualizer_storage:/srv/storage visualizer
```

Open http://localhost:8000 — one container serves both the UI and the API.
The two named volumes persist the SQLite database (including any API keys set via the
Settings page) and uploaded CSVs/chart images across container restarts. `APP_ENCRYPTION_KEY`
is the only var you need to pass at container start — LLM provider keys can be added
afterward from the Settings page, or still passed via `-e`/`--env-file` if you prefer
(`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `LITELLM_API_KEY`/`LITELLM_API_BASE`).

The image starts via `docker-entrypoint.sh`, which execs uvicorn on `$PORT` (defaults to
`8000`) — pass `-e PORT=9000 -p 9000:9000` to run it on a different port. On first start in
a fresh container, matplotlib builds its font cache from scratch, which can take up to
15-20 seconds before the app responds — expect a short delay before `/health` comes up
(worth accounting for in any startup/readiness probe timeout).

## Security note

Generated chart code from the LLM is executed in a subprocess with import blocking,
a builtins allowlist, and a timeout (see `app/execution/`). This is a reasonable bar
for trusted local single-user use, not a hardened sandbox — do not expose this API
on a non-localhost interface without adding real containerized isolation first.
