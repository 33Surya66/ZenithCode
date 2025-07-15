const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { authenticateToken } = require('./middleware/auth');
const socketHandler = require('./socket/socketHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zenithcode', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🌌 Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return { token, req };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
    };
  }
});

// Socket.io setup
socketHandler(io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patterns', require('./routes/patterns'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/compute', require('./routes/compute'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ZenithCode Backend'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  httpServer.listen(PORT, () => {
    console.log(`🚀 ZenithCode Backend running on port ${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🌌 Socket.io ready for real-time connections`);
  });
}

startServer().catch(console.error); 