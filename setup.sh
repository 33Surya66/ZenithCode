#!/bin/bash

# ZenithCode Setup Script
# This script sets up the complete ZenithCode development environment

set -e

echo "🌌 Welcome to ZenithCode Setup!"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3.9+ is not installed."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Some features may not work."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. Some features may not work."
    fi
    
    print_success "Prerequisites check completed"
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    npm install
    
    # Create .env.local if it doesn't exist
    if [ ! -f .env.local ]; then
        cp ../env.example .env.local
        print_status "Created .env.local file"
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    npm install
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp ../env.example .env
        print_status "Created .env file"
    fi
    
    cd ..
    print_success "Backend setup completed"
}

# Setup AI service
setup_ai_service() {
    print_status "Setting up AI service..."
    
    cd ai-service
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_status "Created Python virtual environment"
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp ../env.example .env
        print_status "Created .env file"
    fi
    
    deactivate
    cd ..
    print_success "AI service setup completed"
}

# Setup smart contracts
setup_smart_contracts() {
    print_status "Setting up smart contracts..."
    
    cd smart-contracts
    
    # Check if Rust is installed
    if ! command -v cargo &> /dev/null; then
        print_warning "Rust is not installed. Smart contracts will not be built."
        cd ..
        return
    fi
    
    # Build contracts
    cargo build --release
    
    cd ..
    print_success "Smart contracts setup completed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if MongoDB is running
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Starting database services with Docker Compose..."
        docker-compose up -d mongodb redis neo4j ipfs
        
        # Wait for services to be ready
        print_status "Waiting for services to be ready..."
        sleep 30
        
        print_success "Database services started"
    else
        print_warning "Docker not available. Please start MongoDB, Redis, Neo4j, and IPFS manually."
    fi
}

# Generate configuration files
generate_config() {
    print_status "Generating configuration files..."
    
    # Create scripts directory
    mkdir -p scripts
    
    # Create MongoDB initialization script
    cat > scripts/mongo-init.js << 'EOF'
db = db.getSiblingDB('zenithcode');

// Create collections
db.createCollection('users');
db.createCollection('patterns');
db.createCollection('contributions');
db.createCollection('transactions');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "walletAddress": 1 }, { sparse: true });
db.patterns.createIndex({ "hash": 1 }, { unique: true });
db.patterns.createIndex({ "language": 1 });
db.patterns.createIndex({ "domain": 1 });

print('MongoDB initialized successfully');
EOF
    
    print_success "Configuration files generated"
}

# Create Dockerfiles
create_dockerfiles() {
    print_status "Creating Dockerfiles..."
    
    # Backend Dockerfile
    cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
EOF
    
    # Frontend Dockerfile
    cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF
    
    # AI Service Dockerfile
    cat > ai-service/Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "main.py"]
EOF
    
    print_success "Dockerfiles created"
}

# Main setup function
main() {
    print_status "Starting ZenithCode setup..."
    
    # Check prerequisites
    check_prerequisites
    
    # Generate configuration
    generate_config
    
    # Create Dockerfiles
    create_dockerfiles
    
    # Setup frontend
    setup_frontend
    
    # Setup backend
    setup_backend
    
    # Setup AI service
    setup_ai_service
    
    # Setup smart contracts
    setup_smart_contracts
    
    # Setup database
    setup_database
    
    print_success "🎉 ZenithCode setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Copy env.example to .env and configure your environment variables"
    echo "2. Start the development servers:"
    echo "   - Frontend: cd frontend && npm run dev"
    echo "   - Backend: cd backend && npm run dev"
    echo "   - AI Service: cd ai-service && python main.py"
    echo "3. Or use Docker Compose: docker-compose up"
    echo ""
    echo "🌌 Welcome to the decentralized programming revolution!"
}

# Run main function
main "$@" 