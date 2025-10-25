# Baba E-Commerce Manager

[![Build Client App](https://github.com/kacpersmal/baba-e-commerce-manager/actions/workflows/build-client.yml/badge.svg)](https://github.com/kacpersmal/baba-e-commerce-manager/actions/workflows/build-client.yml)
[![Build Core Service](https://github.com/kacpersmal/baba-e-commerce-manager/actions/workflows/build-core.yml/badge.svg)](https://github.com/kacpersmal/baba-e-commerce-manager/actions/workflows/build-core.yml)

A modern e-commerce management platform built with React (Frontend) and NestJS (Backend).

## 🚀 Quick Start

### Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Node.js v22.20.x** - [Download](https://nodejs.org/)
- **npm v11.6.x** - Comes with Node.js or update with `npm install -g npm@11.6`
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **PowerShell** (Windows) or **PowerShell Core** (macOS/Linux)

### Automated Setup

Run the initialization script to set up your development environment:

```powershell
# Windows PowerShell
.\local-init.ps1
```

This script will:

1. ✅ Verify Node.js and npm versions
2. ✅ Check Docker installation
3. ✅ Set up environment variables
4. ✅ Install dependencies in parallel (faster setup)
5. ✅ Provide next steps guidance

## 🛠️ Manual Setup

If you prefer manual setup or encounter issues:

### 1. Environment Configuration

```powershell
# Copy environment template
Copy-Item .env.local src/core-service/.env
```

### 2. Install Dependencies

```powershell
# Client App
cd src/client-app
npm install

# Core Service
cd ../core-service
npm install
```

### 3. Start Services

```powershell
# Start Docker services (optional)
docker-compose -f docker-compose.dev.yml up -d

# Start Core Service (Terminal 1)
cd src/core-service
npm run start:dev

# Start Client App (Terminal 2)
cd src/client-app
npm run dev
```

## 🔄 Auto-Generated API Client

The client app features a **fully automated TypeScript API client** powered by a custom Vite plugin that intelligently manages OpenAPI schema generation.

### How the Auto-Generation Works

The custom `openapiGenerator` Vite plugin automatically:

- **Checks backend health** before attempting generation
- **Monitors schema freshness** (only regenerates if older than 60 minutes)
- **Runs during development startup** when you start the client app
- **Handles failures gracefully** with helpful error messages
- **Skips generation** when backend is unavailable

### Smart Auto-Generation Features

✅ **Backend Health Check**: Verifies NestJS server is running before generation
✅ **Intelligent Caching**: Skips regeneration if schema is recent
✅ **Development Integration**: Runs automatically when starting `npm run dev`
✅ **Error Handling**: Provides clear feedback when generation fails
✅ **Graceful Degradation**: Works even when backend is temporarily unavailable

### Manual Generation (if needed)

The plugin handles everything automatically, but you can manually trigger generation:

```powershell
# Navigate to client app
cd src/client-app

# Manually generate TypeScript types
npm run generate:api
```

### What Gets Auto-Generated

The Vite plugin automatically creates:

- **Type-safe TypeScript interfaces** for all API endpoints
- **Request/response types** with full validation
- **Auto-completion support** in your IDE
- **Runtime type checking** for API responses

### Usage in Components

```typescript
import { client } from "@/lib/api";

// Type-safe API calls with auto-completion
const data = await client.GET("/health");
const response = await client.POST("/users", {
  body: { name: "John", email: "john@example.com" },
});
```

### When to Regenerate

- After adding new API endpoints
- After modifying existing endpoint schemas
- When backend types change
- Before committing frontend changes

**Note**: Ensure the core service is running before generating the API client.

## 🌐 Service URLs

### Applications

- **Client App**: <http://localhost:3000>
- **Core Service API**: <http://localhost:8000>

### Development Services (Docker)

- **PostgreSQL**: localhost:5432
  - Username: `local_dev`
  - Password: `local_dev`
  - Database: `baba_dev`
- **Redis**: localhost:6379
  - Password: `local_dev`
- **pgAdmin**: <http://localhost:8080>
  - Email: `admin@baba.local`
  - Password: `local_dev`
- **Redis Commander**: <http://localhost:8081>

## 🔧 PowerShell Troubleshooting

### Execution Policy Issues

If you encounter "execution policy" errors:

```powershell
# Check current policy
Get-ExecutionPolicy

# Temporarily allow script execution (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or for current session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Common PowerShell Errors

#### "Script is not digitally signed"

```powershell
# Solution: Change execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### "Cannot be loaded because running scripts is disabled"

```powershell
# Solution: Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### "The term 'npm' is not recognized"

- Ensure Node.js is installed and added to PATH
- Restart PowerShell/Terminal after Node.js installation
- Verify with: `node --version` and `npm --version`

### Running Scripts as Administrator

Some operations might require elevated privileges:

```powershell
# Right-click PowerShell → "Run as Administrator"
# Then navigate to project directory
cd "D:\Workspace\baba-e-commerce-manager"
.\local-init.ps1
```

### Alternative Script Execution Methods

If you continue having issues:

```powershell
# Method 1: Bypass policy for single execution
powershell -ExecutionPolicy Bypass -File .\local-init.ps1

# Method 2: Run unrestricted
powershell -ExecutionPolicy Unrestricted -File .\local-init.ps1

# Method 3: Use PowerShell Core (if installed)
pwsh .\local-init.ps1
```

## 🐛 Common Issues & Solutions

### Port Already in Use

If ports 3000 or 8000 are occupied:

```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Docker Issues

```powershell
# Ensure Docker Desktop is running
docker --version
docker info

# Restart Docker services
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### Node Version Issues

```powershell
# Check current version
node --version
npm --version

# Use Node Version Manager (recommended)
# Windows: Install nvm-windows
# Then: nvm install 22.20.0 && nvm use 22.20.0
```

## 🔄 Development Workflow

1. **Start Development Services** (optional):

   ```powershell
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Start Backend**:

   ```powershell
   cd src/core-service
   npm run start:dev
   ```

3. **Start Frontend**:

   ```powershell
   cd src/client-app
   npm run dev
   ```

4. **Stop Services**:

   ```powershell
   # Stop Docker services
   docker-compose -f docker-compose.dev.yml down

   # Stop Node.js services with Ctrl+C
   ```
