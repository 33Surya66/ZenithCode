@echo off
setlocal enabledelayedexpansion

echo 🌌 Welcome to ZenithCode Setup!
echo ==================================

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python 3.9+ is not installed.
    pause
    exit /b 1
)

echo [INFO] Prerequisites check completed

:: Create scripts directory
if not exist "scripts" mkdir scripts

:: Create MongoDB initialization script
echo db = db.getSiblingDB('zenithcode');> scripts\mongo-init.js
echo.>> scripts\mongo-init.js
echo // Create collections>> scripts\mongo-init.js
echo db.createCollection('users');>> scripts\mongo-init.js
echo db.createCollection('patterns');>> scripts\mongo-init.js
echo db.createCollection('contributions');>> scripts\mongo-init.js
echo db.createCollection('transactions');>> scripts\mongo-init.js
echo.>> scripts\mongo-init.js
echo // Create indexes>> scripts\mongo-init.js
echo db.users.createIndex({ "email": 1 }, { unique: true });>> scripts\mongo-init.js
echo db.users.createIndex({ "walletAddress": 1 }, { sparse: true });>> scripts\mongo-init.js
echo db.patterns.createIndex({ "hash": 1 }, { unique: true });>> scripts\mongo-init.js
echo db.patterns.createIndex({ "language": 1 });>> scripts\mongo-init.js
echo db.patterns.createIndex({ "domain": 1 });>> scripts\mongo-init.js
echo.>> scripts\mongo-init.js
echo print('MongoDB initialized successfully');>> scripts\mongo-init.js

echo [INFO] Configuration files generated

:: Setup frontend
echo [INFO] Setting up frontend...
cd frontend
call npm install
if not exist ".env.local" copy ..\env.example .env.local
cd ..

:: Setup backend
echo [INFO] Setting up backend...
cd backend
call npm install
if not exist ".env" copy ..\env.example .env
cd ..

:: Setup AI service
echo [INFO] Setting up AI service...
cd ai-service
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
if not exist ".env" copy ..\env.example .env
call venv\Scripts\deactivate.bat
cd ..

:: Setup smart contracts (if Rust is available)
echo [INFO] Setting up smart contracts...
cd smart-contracts
cargo --version >nul 2>&1
if not errorlevel 1 (
    cargo build --release
    echo [SUCCESS] Smart contracts built successfully
) else (
    echo [WARNING] Rust is not installed. Smart contracts will not be built.
)
cd ..

echo.
echo 🎉 ZenithCode setup completed successfully!
echo.
echo Next steps:
echo 1. Copy env.example to .env and configure your environment variables
echo 2. Start the development servers:
echo    - Frontend: cd frontend ^&^& npm run dev
echo    - Backend: cd backend ^&^& npm run dev
echo    - AI Service: cd ai-service ^&^& python main.py
echo 3. Or use Docker Compose: docker-compose up
echo.
echo 🌌 Welcome to the decentralized programming revolution!
pause 