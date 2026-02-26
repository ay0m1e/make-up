# GLEEMAKEOVERS

Next.js frontend + Flask backend for bookings. The Flask backend connects directly to Supabase Postgres (no Supabase SDK).

## Backend (Flask) — Supabase Postgres

### 1) Connect to Supabase

- Use the Supabase **Postgres connection string** as `DATABASE_URL`
- The backend uses SQLAlchemy + `psycopg2` (direct PostgreSQL connection)
- If your Supabase connection requires SSL, append `?sslmode=require`

Example:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

The app normalises `postgres://` / `postgresql://` into the SQLAlchemy `postgresql+psycopg2://` format automatically.

### 2) Required environment variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required for backend startup / booking API responses:

- `DATABASE_URL`
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `BANK_ACCOUNT_NAME`
- `BANK_SORT_CODE`
- `BANK_ACCOUNT_NUMBER`
- `BANK_REFERENCE_PREFIX`

Recommended:

- `APP_ENV` (`development`, `testing`, `production`)
- `LOG_LEVEL` (for example `INFO`)

Optional (tests if you want a dedicated DB):

- `TEST_DATABASE_URL`

## Run locally (Flask backend)

### Windows (PowerShell)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
flask --app manage.py run
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
flask --app manage.py run
```

Health check:

```bash
curl http://127.0.0.1:5000/health
```

## Seed sample services (CLI)

After the backend is running and your `DATABASE_URL` points to the correct database:

```bash
flask --app manage.py seed-services
```

- Command is idempotent by service name (creates missing services, updates existing seeded services)

## Run tests (pytest)

```bash
python -m pytest -q
```

Current tests cover:

- deposit calculation
- double booking rejection
- reference code uniqueness sequencing logic

## API notes

- Public services endpoint: `GET /api/services`
- Booking creation endpoint: `POST /api/bookings`
- Admin endpoints require JWT (`Authorization: Bearer <token>`)
