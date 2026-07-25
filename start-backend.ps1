$ErrorActionPreference = "Stop"

function Assert-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "'$Name' is not installed or is not available in PATH."
    }
}

Assert-Command "java"
Assert-Command "docker"

$javaVersion = (& java -version 2>&1 | Out-String)
if ($javaVersion -notmatch 'version "21') {
    throw "Java 21 is required. Current Java output: $javaVersion"
}

Write-Host "Using Java 21." -ForegroundColor Green
Write-Host "Clearing environment variables that could override local configuration..."

@(
    "DB_URL",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_SCHEMA",
    "NEO4J_URI",
    "NEO4J_USERNAME",
    "NEO4J_PASSWORD",
    "SPRING_DATASOURCE_URL",
    "SPRING_DATASOURCE_USERNAME",
    "SPRING_DATASOURCE_PASSWORD",
    "SPRING_PROFILES_ACTIVE"
) | ForEach-Object {
    Remove-Item "Env:$_" -ErrorAction SilentlyContinue
}

Write-Host "Removing only the isolated Nervix v4 containers and volume..."
docker compose down --volumes --remove-orphans
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose cleanup failed."
}

Write-Host "Starting isolated PostgreSQL on port 55432 and Neo4j on port 57687..."
docker compose up -d --wait
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose startup failed. Check that Docker Desktop is running."
}

Write-Host "Verifying PostgreSQL authentication..."
docker compose exec -T postgres psql -U nervix -d nervix -v ON_ERROR_STOP=1 -c "SELECT current_user, current_database();"
if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL authentication verification failed."
}

Push-Location backend
try {
    Write-Host "Running clean compilation and all tests..."
    .\mvnw.cmd clean verify
    if ($LASTEXITCODE -ne 0) {
        throw "Maven verification failed."
    }

    Write-Host ""
    Write-Host "Compilation and tests passed. Starting Nervix..." -ForegroundColor Green
    .\mvnw.cmd spring-boot:run
    if ($LASTEXITCODE -ne 0) {
        throw "Spring Boot failed to start."
    }
}
finally {
    Pop-Location
}
