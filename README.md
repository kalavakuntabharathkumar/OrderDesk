# OrderDesk — Multi-Store Order and Inventory Dashboard

A portfolio-ready starter implementation for tracking orders across multiple retail stores.

## Features
- Next.js App Router dashboard with sample order metrics and searchable order list
- TypeScript types and reusable UI components
- Express REST API with MongoDB/Mongoose models and indexed fields
- Docker Compose for local MongoDB + API development
- Seed data script and basic API health endpoint

## Requirements
- Node.js 20+
- Docker Desktop / Docker Engine (recommended), or a local MongoDB instance

## Run the API
```bash
cd apps/api
cp .env.example .env
npm install
npm run seed
npm run dev
```
API defaults to `http://localhost:4000`.

## Run the dashboard
In another terminal:
```bash
cd apps/web
npm install
npm run dev
```
Dashboard defaults to `http://localhost:3000`.

## Docker
From the project root:
```bash
docker compose up --build
```
The compose setup starts MongoDB and the API. Run the Next.js frontend separately with the steps above.

## API routes
- `GET /api/health`
- `GET /api/orders?search=&status=&storeId=&page=&limit=`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id`
- `GET /api/stores`

## Portfolio note
This is a starter project designed to be run and extended locally. The resume metrics in the supplied project description are not independently verified by this codebase; describe them as measured outcomes only if you have actually tested them.
