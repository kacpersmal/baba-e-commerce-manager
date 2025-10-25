# Baba E-Commerce Manager - Local Development Setup Script
# This script sets up the local development environment

Write-Host "Baba E-Commerce Manager - Local Development Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Step 1: Check Node.js version
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "   Found Node.js: $nodeVersion" -ForegroundColor Green

    if ($nodeVersion -match "^v22\.20\.") {
        Write-Host "   Node.js version is compatible (v22.20.x)" -ForegroundColor Green
    } else {
        Write-Host "   Node.js version should be v22.20.x, but found: $nodeVersion" -ForegroundColor Red
        Write-Host "   Please install Node.js v22.20.x from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Node.js v22.20.x from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Check npm version
Write-Host "2. Checking npm version..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "   Found npm: v$npmVersion" -ForegroundColor Green

    if ($npmVersion -match "^11\.6\.") {
        Write-Host "   npm version is compatible (11.6.x)" -ForegroundColor Green
    } else {
        Write-Host "   npm version should be 11.6.x, but found: v$npmVersion" -ForegroundColor Red
        Write-Host "   Please update npm: npm install -g npm@11.6" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Check Docker installation (verification only)
Write-Host "3. Checking Docker installation..." -ForegroundColor Yellow
if (Test-Command "docker") {
    try {
        $dockerVersion = docker --version
        Write-Host "   Found Docker: $dockerVersion" -ForegroundColor Green
        Write-Host "   Docker is installed" -ForegroundColor Green
    }
    catch {
        Write-Host "   Docker is installed but not accessible" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Move .env.local to core-service
Write-Host "4. Setting up environment configuration..." -ForegroundColor Yellow
$envLocalPath = ".\.env.local"
$coreServiceEnvPath = ".\src\core-service\.env"

if (Test-Path $envLocalPath) {
    try {
        # Create core-service directory if it doesn't exist
        if (-not (Test-Path ".\src\core-service")) {
            Write-Host "   Core service directory not found: .\src\core-service" -ForegroundColor Red
            exit 1
        }

        Copy-Item $envLocalPath $coreServiceEnvPath -Force
        Write-Host "   Copied .env.local to src/core-service/.env" -ForegroundColor Green
    }
    catch {
        Write-Host "   Failed to copy .env.local: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   .env.local file not found in root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: Install dependencies in parallel
Write-Host "5. Installing dependencies..." -ForegroundColor Yellow

# Verify both package.json files exist
if (-not (Test-Path ".\src\client-app\package.json")) {
    Write-Host "   Client-app package.json not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".\src\core-service\package.json")) {
    Write-Host "   Core-service package.json not found" -ForegroundColor Red
    exit 1
}

# Start parallel npm install jobs
Write-Host "   Starting parallel npm installs..." -ForegroundColor Cyan

$currentDir = Get-Location

$clientJob = Start-Job -ScriptBlock {
    param($workDir)
    Set-Location $workDir
    Set-Location ".\src\client-app"
    npm install
} -ArgumentList $currentDir -Name "ClientInstall"

$coreJob = Start-Job -ScriptBlock {
    param($workDir)
    Set-Location $workDir
    Set-Location ".\src\core-service"
    npm install
} -ArgumentList $currentDir -Name "CoreInstall"

Write-Host "   Installing client-app dependencies (background)..." -ForegroundColor Gray
Write-Host "   Installing core-service dependencies (background)..." -ForegroundColor Gray

# Wait for both jobs to complete
$jobs = @($clientJob, $coreJob)
$completed = @()

while ($completed.Count -lt 2) {
    Start-Sleep -Seconds 1

    foreach ($job in $jobs) {
        if ($job.State -eq "Completed" -and $job.Name -notin $completed) {
            $completed += $job.Name

            if ($job.Name -eq "ClientInstall") {
                $result = Receive-Job $job
                if ($job.State -eq "Completed") {
                    Write-Host "   Client-app dependencies installed" -ForegroundColor Green
                } else {
                    Write-Host "   Failed to install client-app dependencies" -ForegroundColor Red
                    Get-Job | Remove-Job -Force
                    exit 1
                }
            }

            if ($job.Name -eq "CoreInstall") {
                $result = Receive-Job $job
                if ($job.State -eq "Completed") {
                    Write-Host "   Core-service dependencies installed" -ForegroundColor Green
                } else {
                    Write-Host "   Failed to install core-service dependencies" -ForegroundColor Red
                    Get-Job | Remove-Job -Force
                    exit 1
                }
            }
        }

        if ($job.State -eq "Failed") {
            Write-Host "   Installation job failed: $($job.Name)" -ForegroundColor Red
            Get-Job | Remove-Job -Force
            exit 1
        }
    }
}

# Clean up jobs
Get-Job | Remove-Job -Force

Write-Host ""

# Complete
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Docker services if needed:" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the core service:" -ForegroundColor White
Write-Host "   cd src\core-service" -ForegroundColor Gray
Write-Host "   npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the client app:" -ForegroundColor White
Write-Host "   cd src\client-app" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Your applications will be available at:" -ForegroundColor White
Write-Host "   Client App: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Core Service: http://localhost:8000" -ForegroundColor Gray
Write-Host ""
Write-Host "Available services (when Docker is running):" -ForegroundColor Cyan
Write-Host "   PostgreSQL: localhost:5432 (user: local_dev, password: local_dev)" -ForegroundColor Gray
Write-Host "   Redis: localhost:6379 (password: local_dev)" -ForegroundColor Gray
Write-Host "   pgAdmin: http://localhost:8080 (admin@baba.local / local_dev)" -ForegroundColor Gray
Write-Host "   Redis Commander: http://localhost:8081" -ForegroundColor Gray
