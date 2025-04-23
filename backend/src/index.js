import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';


// Import routes
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import bedRoutes from './routes/beds.js';
import admissionRoutes from './routes/admissions.js';
import inventoryRoutes from './routes/inventory.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MediConnect API' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use((req, res, next) => {
  console.log('Auth header:', req.headers.authorization);
  next();
});

// Protected routes with Clerk authentication
app.use('/api/dashboard', ClerkExpressRequireAuth(), dashboardRoutes);
app.use('/api/patients', ClerkExpressRequireAuth(), patientRoutes);
app.use('/api/appointments', ClerkExpressRequireAuth(), appointmentRoutes);
app.use('/api/beds', ClerkExpressRequireAuth(), bedRoutes);
app.use('/api/admissions', ClerkExpressRequireAuth(), admissionRoutes);
app.use('/api/inventory', ClerkExpressRequireAuth(), inventoryRoutes);
app.use('/api/users', ClerkExpressRequireAuth(), userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const cleanup = async () => {
  await prisma.$disconnect();
  console.log('💫 Server shutting down...');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

export { prisma };