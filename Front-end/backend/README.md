# EL PATRÓN - Backend

Sistema de Control Operativo Enterprise - API Backend

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run seed (populate database)
npm run db:seed

# Start server
npm run dev
```

## API Documentation

Server runs on `http://localhost:3000`

### Health Check

```
GET /health
```

### Authentication

All endpoints require Bearer token except `/health`

```
Authorization: Bearer <firebase-token>
```

### Operations

```
GET    /api/operations
POST   /api/operations
GET    /api/operations/:id
PATCH  /api/operations/:id/status
GET    /api/operations/dashboard/metrics
```

### Leads

```
GET    /api/leads
POST   /api/leads
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
```

### Virtual Machines

```
GET    /api/vms
POST   /api/vms
```

### Security

```
GET    /api/security/events
GET    /api/security/metrics
```

### User

```
GET    /api/me
```

## Environment Variables

See `.env.example` for required variables.

## Architecture

- **Express** - Web framework
- **MySQL2** - Database driver
- **Firebase Admin** - Authentication
- **Decision Engine** - Automatic governance
- **Audit Service** - Complete traceability

## Scripts

```bash
npm start       # Production
npm run dev     # Development with nodemon
npm run db:seed # Populate database
```
