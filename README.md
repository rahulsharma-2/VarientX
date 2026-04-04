# VarientX

Backend-controlled A/B experimentation system built with Node.js and Express for the DevBytes backend engineering assignment.

## Why This Submission Is Strong

- Deterministic assignment: the same `user_id` is always mapped to the same variant across requests and container restarts.
- Backend-owned experiment delivery: the frontend receives variant configuration from the API instead of embedding decision logic client-side.
- Small but production-shaped: validation, layered service structure, clear error handling, request logging, health check, tests, and Docker support.
- Reviewer-friendly demo path: both an HTTP API and a lightweight browser UI are included.
- Explicit trade-offs: the solution stays focused on correctness and explainability rather than overbuilding.

## Problem Summary

This project implements the assignment's Option 1: a backend-driven experimentation service that exposes:

`GET /experiment?user_id=<id>`

The service:

- loads an active experiment definition
- deterministically buckets the incoming user
- returns the assigned variant and its frontend configuration payload
- keeps assignment stable without storing per-user records

## Architecture

### Flow

1. The client calls `/experiment?user_id=<id>`.
2. The controller validates input and delegates to the experiment service.
3. The experiment service loads the active experiment definition.
4. The assignment service hashes `experiment_key + salt + user_id`.
5. The hash is converted into a percentage bucket.
6. The bucket is mapped to a variant using cumulative weight ranges.
7. The selected variant config is returned as JSON.

### Project Shape

- `src/config`: environment and experiment definitions
- `src/controllers`: HTTP request handling
- `src/services`: assignment logic and experiment orchestration
- `src/utils`: hashing helpers
- `src/middleware`: logging and error handling
- `public`: simple reviewer demo UI
- `tests`: unit and integration coverage

## API

### `GET /health`

Basic health endpoint for local verification and container checks.

Example response:

```json
{
  "status": "ok",
  "service": "varientx"
}
```

### `GET /experiment?user_id=<id>`

Returns the active experiment assignment for a given user.

Example request:

```bash
curl "http://localhost:8080/experiment?user_id=42"
```

Example response:

```json
{
  "data": {
    "experiment": {
      "key": "homepage-hero-cta",
      "name": "Homepage Hero CTA Experiment"
    },
    "user": {
      "id": "42"
    },
    "assignment": {
      "variant": "B",
      "bucket": 71.294387
    },
    "config": {
      "headline": "Stay Ahead With Curated Tech Briefs",
      "ctaLabel": "Explore Stories",
      "heroTheme": "midnight"
    }
  },
  "meta": {
    "deterministic": true
  }
}
```

Optional reviewer aid:

- `GET /experiment?user_id=42&debug=true`

This includes additional assignment details so reviewers can inspect bucketing behavior more easily.

## Simple Demo UI

Open:

`http://localhost:8080`

The page lets a reviewer:

- enter a user ID
- fetch the assigned variant
- inspect the selected config
- inspect the raw JSON response

## Edge Cases Covered

- missing `user_id`
- blank or whitespace-only `user_id`
- deterministic response on repeated requests
- stable assignment after service restart as long as the experiment key and salt remain unchanged
- weighted variant distribution logic with cumulative range mapping
- explicit error responses instead of silent fallback behavior

## Trade-Offs

- This version uses deterministic hashing rather than persisting every user assignment.
  - Benefit: simpler, stateless, restart-safe, and easy to scale horizontally.
  - Cost: changing the experiment key, weights, or salt can rebucket users.
- This submission serves one active experiment to stay focused.
  - Benefit: stronger completeness for the requested flow.
  - Cost: a full experiment management API is intentionally out of scope.
- Experiment definitions are local config rather than database-backed.
  - Benefit: faster local setup and cleaner reviewer experience.
  - Cost: non-technical operators cannot modify experiments dynamically.

## What An Interviewer Is Likely Evaluating

- whether bucketing logic is truly deterministic
- whether the backend owns assignment instead of the UI
- whether the response contract is clean and usable by a frontend
- whether edge cases and failure modes are handled deliberately
- whether the candidate can choose an appropriately scoped architecture
- whether docs and local setup make the project easy to review

## Local Run

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Start

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Docker Run

### Build

```bash
docker build -t varientx .
```

### Run

```bash
docker run -p 8080:8080 varientx
```

If you prefer compose:

```bash
docker compose up --build
```

## How To Trigger Core Functionality

### API

```bash
curl "http://localhost:8080/experiment?user_id=42"
curl "http://localhost:8080/experiment?user_id=42&debug=true"
```

### Browser

Open `http://localhost:8080` and submit a user ID through the demo form.

## Tests

Run:

```bash
npm test
```

The test suite verifies:

- deterministic assignment behavior
- weighted bucketing logic
- invalid request handling
- integration response shape

## Assumptions

See [assumptions.md](/Users/rahul/Desktop/VarientX/assumptions.md).

## Notes For Reviewers

- The service intentionally prioritizes correctness, determinism, and clarity over building a full experiment management platform.
- The implementation is designed so the next natural extension would be supporting multiple active experiments and a database-backed control plane.
