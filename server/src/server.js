import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load server/.env no matter which folder the server is started from
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// The built React app (client/dist) is served by this same server when it exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const hasClientBuild = fs.existsSync(path.join(clientDistPath, 'index.html'));

// Connect to MongoDB
connectDB();

// Allowed origins for CORS (supports local Vite dev port 5173 and preview port 4173)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all dev local requests
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'SkillSwap Campus API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Static files of the React app (no-op when client/dist does not exist)
app.use(express.static(clientDistPath));

// Root welcome endpoint (only reached when the React app has not been built yet)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>SkillSwap Campus API</title></head>
      <body style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
        <h1 style="color: #6366f1;">🎓 SkillSwap Campus Backend API</h1>
        <p>A Full-Stack Student Skill Exchange Platform Using React.js, Node.js and MongoDB</p>
        <p style="color: #94a3b8;">Frontend running on <a href="http://localhost:5173" style="color: #38bdf8;">http://localhost:5173</a></p>
        <p style="color: #10b981;">API Status: Active & Ready</p>
      </body>
    </html>
  `);
});

// SPA fallback: any page URL that is not an API route (e.g. /explore, /feedback)
// returns the React app so React Router can render that page
if (hasClientBuild) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`\n====================================================`);
  console.log(`🚀 SkillSwap Campus Backend Server is active!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health check: http://localhost:${PORT}/api/health`);
  if (hasClientBuild) {
    console.log(`🌐 Website: http://localhost:${PORT} (React app served from client/dist)`);
  } else {
    console.log(`⚠️  React app not built yet. Run "npm run build" in the project root, or "npm run dev" for development.`);
  }
  console.log(`====================================================\n`);
});
