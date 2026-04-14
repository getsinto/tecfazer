# Database Setup Script for Tec Fazer
# Run this script after stopping your development server (Ctrl+C)

Write-Host "Setting up Tec Fazer Database..." -ForegroundColor Cyan
Write-Host ""

# Load environment variables from .env.local
Write-Host "Loading environment variables..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^[""'']|[""'']$', ''
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  Loaded $key" -ForegroundColor Gray
        }
    }
    Write-Host "Environment variables loaded" -ForegroundColor Green
} else {
    Write-Host "ERROR: .env.local file not found" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to generate Prisma client" -ForegroundColor Red
    Write-Host "Make sure your development server is stopped (Ctrl+C)" -ForegroundColor Yellow
    exit 1
}
Write-Host "Prisma client generated" -ForegroundColor Green
Write-Host ""

# Step 2: Push schema to database
Write-Host "Step 2: Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push schema" -ForegroundColor Red
    exit 1
}
Write-Host "Schema pushed to database" -ForegroundColor Green
Write-Host ""

# Step 3: Seed database with sample data
Write-Host "Step 3: Seeding database with sample data..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host "Database seeded successfully" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "What was created:" -ForegroundColor Cyan
Write-Host "  1 Admin user (admin@tecfazer.pt / TecFazer2024Admin)" -ForegroundColor White
Write-Host "  6 Team members" -ForegroundColor White
Write-Host "  35+ Services" -ForegroundColor White
Write-Host "  4 Pricing plans" -ForegroundColor White
Write-Host "  8 Testimonials" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start your development server: npm run dev" -ForegroundColor White
Write-Host "  2. Open http://localhost:3000" -ForegroundColor White
Write-Host "  3. Login to admin: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "Optional: View your database" -ForegroundColor Cyan
Write-Host "  Run: npx prisma studio" -ForegroundColor White
Write-Host ""
