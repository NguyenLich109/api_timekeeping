import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/MongoDb.js';
import { errorHandler, notFound } from './Middleware/Errors.js';
import userRouter from './Routes/UserRoutes.js';
import TimekeepingRouter from './Routes/TimekeepingRouter.js';
import WorkplaceRouter from './Routes/WorkplaceRouter.js';
import cors from 'cors';

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

// API

// cấu hình định danh file ejs bên express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/timekeeping', TimekeepingRouter);
app.use('/api/workplace', WorkplaceRouter);

app.use(express.static('public'));

// forgot
// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
