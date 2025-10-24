# Docker Setup for Employee Wizard

This application has been dockerized with support for both production and development environments.

## Files Created

- **Dockerfile** - Production multi-stage build
- **Dockerfile.dev** - Development build with hot reload
- **docker-compose.yml** - Production orchestration (React app + 2 JSON servers)
- **docker-compose.dev.yml** - Development orchestration with volume mounts
- **.dockerignore** - Files to exclude from Docker builds

## Quick Start

### Production Build

Build and run the production containers:

```bash
docker-compose build
docker-compose up
```

Access the application at `http://localhost:3000`

**Services:**

- React App: http://localhost:3000
- JSON Server 1: http://localhost:4001 (Departments & Basic Info)
- JSON Server 2: http://localhost:4002 (Locations & Details)

### Development Build

Run with hot reload and volume mounts:

```bash
docker-compose -f docker-compose.dev.yml up
```

The app will automatically rebuild on file changes.

## Docker Compose Services

### Production (docker-compose.yml)

1. **app** - React Vite application served with `serve`

   - Port: 3000
   - Health check enabled
   - Environment variables set for API URLs

2. **server1** - JSON Server instance 1

   - Port: 4001
   - Serves db-step1.json
   - Health check enabled

3. **server2** - JSON Server instance 2
   - Port: 4002
   - Serves db-step2.json
   - Health check enabled

### Development (docker-compose.dev.yml)

Same services but with:

- Volume mounts for hot reload
- Dockerfile.dev for development builds
- Simplified healthchecks

## Building Individual Images

### Production image only:

```bash
docker build -t employee-wizard:latest .
docker run -p 3000:3000 employee-wizard:latest
```

### Development image only:

```bash
docker build -f Dockerfile.dev -t employee-wizard:dev .
docker run -p 3000:3000 -v $(pwd):/app employee-wizard:dev
```

## Environment Variables

For production, you can override the API URLs:

```bash
docker-compose -e VITE_API_URL_1=http://api1.example.com \
               -e VITE_API_URL_2=http://api2.example.com up
```

Or create a `.env` file:

```env
VITE_API_URL_1=http://server1:4001
VITE_API_URL_2=http://server2:4002
```

## Common Commands

```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up -d --build

# Development with volume mounts
docker-compose -f docker-compose.dev.yml up
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Production Setup                │
├─────────────────────────────────────────┤
│ React App (serve)      → Port 3000      │
├─────────────────────────────────────────┤
│ JSON Server 1          → Port 4001      │
├─────────────────────────────────────────┤
│ JSON Server 2          → Port 4002      │
└─────────────────────────────────────────┘

All services communicate via 'employee-network' bridge
```

## Health Checks

All services have health checks configured:

- **app**: Checks http://localhost:3000
- **server1**: Checks http://localhost:4001
- **server2**: Checks http://localhost:4002

Failed health checks will restart the container automatically.

## Notes

- The multi-stage build in Dockerfile reduces final image size
- Production uses `serve` for efficient static file serving
- Development setup includes hot reload with volume mounts
- JSON Servers have a 3-second delay to simulate network latency
- All services run on an isolated network for security
- Services wait for dependencies using health checks before starting
