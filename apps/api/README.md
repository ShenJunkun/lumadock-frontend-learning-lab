# LumaDock Backend

FastAPI + SQLite service for local product data and预约线索.

## Run

```powershell
conda run -n frontend-product-lab uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8001
```

## Endpoints

- `GET /health`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/stats`
- `POST /api/leads`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/leads`

The SQLite database defaults to `backend/lumadock.db`. Override with `LUMADOCK_DATABASE_URL`.

## Demo Accounts

- `admin@lumadock.local` / `admin123`
- `viewer@lumadock.local` / `viewer123`

JWT tokens are for local learning only. Set `LUMADOCK_JWT_SECRET` to override the development secret.

`GET /api/admin/leads` requires an admin bearer token. Public lead submission remains available through `POST /api/leads`.
