import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const questions = require('./questions.json');
dotenv.config()

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',   
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 

  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.post('/api/weekly_leaderboard', async (req, res) => {
  try {
    const { username, score, timeTaken } = req.body;
    const weekStart = getCurrentWeekStart(); // From previous implementation
    
    await pool.query(
      `INSERT INTO weekly_leaderboard (username, score, timetaken, week_start)
       VALUES ($1, $2, $3, $4)`,
      [username, score, timeTaken, weekStart]
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving weekly score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/weekly_leaderboard', async (req, res) => {
  try {
    const weekStart = getCurrentWeekStart();
    
    const result = await pool.query(
      `SELECT * FROM weekly_leaderboard 
       WHERE week_start = $1
       ORDER BY score DESC, timetaken ASC
       LIMIT 100`,
      [weekStart]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  
  let daysToSubtract = (day + 2) % 7; 
  if (day === 5 && hour < 14) daysToSubtract = 7;
  
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - daysToSubtract);
  weekStart.setUTCHours(14, 0, 0, 0);
  
  return weekStart;
}


app.get('/api/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.post('/api/scores', async (req, res) => {
  const { username, score, timeTaken } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO leaderboard (username, score, time_taken) VALUES ($1, $2, $3)',
      [username, score, timeTaken]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT username, score, time_taken AS timetaken
      FROM leaderboard
      ORDER BY score DESC, time_taken ASC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});