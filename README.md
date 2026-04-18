# Gender Classifier API

Backend API that classifies a name's likely gender by integrating with the [Genderize.io](https://genderize.io) API and returning a processed response.

Built for **HNG Stage 0 — Backend API Integration & Data Processing Assessment**.

## Endpoint

```
GET /api/classify?name={name}
```

### Query Parameters

| Name | Type   | Required | Description                  |
| ---- | ------ | -------- | ---------------------------- |
| name | string | yes      | Name to classify (non-empty) |

### Success Response — `200 OK`

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-01T12:00:00Z"
  }
}
```

### Error Responses

All errors follow the shape:

```json
{ "status": "error", "message": "<error message>" }
```

| Status | Condition                                           |
| ------ | --------------------------------------------------- |
| 400    | `name` is missing or empty                          |
| 422    | `name` is not a string (e.g. `?name[]=a&name[]=b`)  |
| 404    | Genderize returned `gender: null` or `count: 0`     |
| 502    | Upstream call to Genderize failed                   |
| 500    | Unhandled server error                              |

## Processing Rules

- Extract `gender`, `probability`, and `count` from the Genderize response.
- Rename `count` to `sample_size`.
- `is_confident = probability >= 0.7 && sample_size >= 100`.
- `processed_at` is generated per-request as a UTC ISO-8601 timestamp.
- `Access-Control-Allow-Origin: *` header set on every response.

## Project Structure

```
.
├── index.js                    # Express entry / Vercel handler
├── vercel.json                 # Vercel routing config
├── package.json
└── src/
    ├── controllers/
    │   └── classifyController.js
    ├── routes/
    │   └── classifyRoutes.js
    ├── services/
    │   └── genderizeService.js
    └── utils/
        └── validators.js
```

## Run Locally

```bash
npm install
npm start            # production mode
npm run dev          # with nodemon for hot reload
```

Server defaults to `http://localhost:3000`. Override with the `PORT` env var.

## Example Requests

### Success

```bash
curl -i "http://localhost:3000/api/classify?name=sally"
```

### 400 — missing name

```bash
curl -i "http://localhost:3000/api/classify"
```

### 400 — empty name

```bash
curl -i "http://localhost:3000/api/classify?name="
```

### 422 — non-string name

```bash
curl -i "http://localhost:3000/api/classify?name[]=a&name[]=b"
```

### 404 — no prediction available

```bash
curl -i "http://localhost:3000/api/classify?name=zzzzqqqqnoone"
```

## Deployment

The repo is configured for Vercel (`vercel.json`). Any Node-compatible host (Railway, Heroku, AWS, PXXL App, etc.) works — just run `npm start`.
