import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

import userRoutes from './src/routes/userRoutes.js';
import classRoutes from './src/routes/classRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import enrollmentRoutes from './src/routes/enrollmentRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import tuitionFeeRoutes from './src/routes/tuitionFeeRoutes.js';
import deleteAllDataService from './src/services/delete.js';
import mockRoutes from './src/routes/mockRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const apiRouter = express.Router();
apiRouter.use('/users', userRoutes);
apiRouter.use('/classes', classRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/attendances', attendanceRoutes);
apiRouter.use('/tuition', tuitionFeeRoutes)

app.use('/api/v1', apiRouter);

app.delete('/api/v1/delete', (req, res) => {

  deleteAllDataService()
  res.json({ message: 'All data deleted successfully' });
});

app.use('/api/v1/mock', mockRoutes);


// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Extra Class API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
