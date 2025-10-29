# API

Client-facing documentation of the HTTP API consumed by the mobile app. Endpoints and shapes are inferred from the current client implementation in `lib/api.ts`.

> Note
> The client enforces HTTPS for the base URL. If `POSTGRES_URL` begins with `http://`, the app will throw at runtime.

## Base URL

The client resolves the base URL in this order:

1) `process.env.POSTGRES_URL` (from `.env` at build/start time)
2) `expo.expoConfig.extra.POSTGRES_URL` (from `app.config.ts`)

If no base URL is found, API calls throw with a configuration error.

Example `.env`:

```env
POSTGRES_URL=https://api.example.com
```

## Authentication

### POST /auth/login

Request body:

```json
{ "email": "user@company.com", "password": "string" }
```

Response: loosely typed `LoginResponse` object. The client logs `message` if present; tokens are not persisted by the client at this time.

```json
{ "token": "...", "message": "optional", "...": "other fields" }
```

Client usage:

```ts
const res = await login(email, password);
// Client currently uses a boolean auth flag; tokens, if returned, are not stored.
```

### POST /auth/register

Request body:

```json
{ "name": "Full Name", "email": "user@company.com", "password": "string" }
```

Response: same shape as login.

Error handling:

- Non-2xx status → throws `Error("Signup failed: <status> <text>")`.

Validation:

- The client validates email and password via `zod` before calling the endpoint (see `lib/authValidation.ts`). Email domains are restricted via `allowedDomains.json`.

## Packages

### GET /packages

Response: envelope with a message and a list of packages.

```json
{
  "message": "Packages retrieved successfully",
  "packages": [
    {
      "id": 101,
      "sender_id": 1,
      "receiver_id": 55,
      "current_location": "Hub A",
      "status": "IN_TRANSIT",
      "assigned_truck_id": 7,
      "expected_temperature_min": 18,
      "expected_temperature_max": 24,
      "expected_humidity_min": 45,
      "expected_humidity_max": 60,
      "created_at": "2024-10-01T12:00:00Z",
      "updated_at": null,
      "current_temperature": 22.1,
      "current_humidity": 53,
      "last_sensor_at": "2025-10-29T12:49:29.528Z",
      "sender_name": "Sender Co",
      "receiver_name": "Receiver LLC",
      "driver_position": null
    }
  ]
}
```

Package shape used by the client (`ApiPackage`):

```ts
type ApiPackage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  current_location: string | null;
  status: string;
  assigned_truck_id: number | null;
  expected_temperature_min: number;
  expected_temperature_max: number;
  expected_humidity_min: number;
  expected_humidity_max: number;
  created_at: string;
  updated_at: string | null;
  sender_name: string;
  receiver_name: string;
  current_temperature: number | null;
  current_humidity: number | null;
}
```

Client parsing:

- The client expects the exact envelope `{ message: string, packages: ApiPackage[] }`.
- Numeric string fields are coerced to numbers via runtime validation.

Example response (minimal):

```json
[
  {
    "id": 101,
    "sender_id": 1,
    "receiver_id": 55,
    "current_location": "Hub A",
    "status": "in_transit",
    "assigned_truck_id": 7,
    "expected_temperature_min": 18,
    "expected_temperature_max": 24,
    "expected_humidity_min": 45,
    "expected_humidity_max": 60,
    "created_at": "2024-10-01T12:00:00Z",
    "updated_at": null,
    "current_temperature": 22.1,
    "current_humidity": 53,
    "last_sensor_at": "2025-10-29T12:49:29.528Z",
    "sender_name": "Sender Co",
    "receiver_name": "Receiver LLC",
  }
]
```
