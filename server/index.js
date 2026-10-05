/**
 * JanSahay AI — Express Server & API Routes
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAgentLoop } from './agent/loop.js';
import { matchSchemes, getAllSchemes } from './agent/matcher.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const helplines = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/helplines.json'), 'utf-8')
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'JanSahay AI Agent Server',
    version: '1.0.0-hackathon-mvp',
    timestamp: new Date().toISOString()
  });
});

// Autonomous Agent Conversation Endpoint (FR-1 to FR-13)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, profile = {}, language = 'en' } = req.body;

    if (!message && Object.keys(profile).length === 0) {
      return res.status(400).json({ error: 'Message or profile payload is required' });
    }

    const agentResult = await runAgentLoop({
      userMessage: message || '',
      sessionProfile: profile,
      language: language || 'en'
    });

    res.json(agentResult);
  } catch (error) {
    console.error('Agent loop execution error:', error);
    res.status(500).json({
      error: 'An error occurred during agent reasoning',
      details: error.message
    });
  }
});

// Direct Scheme Matching Endpoint
app.post('/api/match', (req, res) => {
  try {
    const { profile = {}, query = '' } = req.body;
    const matches = matchSchemes(profile, query);
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Curated Scheme Database Endpoint
app.get('/api/schemes', (req, res) => {
  try {
    const schemes = getAllSchemes();
    res.json({
      total: schemes.length,
      schemes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Official Helplines Directory
app.get('/api/helplines', (req, res) => {
  res.json({ helplines });
});

// Serve static frontend assets if built
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[JanSahay AI] Server running on http://localhost:${PORT}`);
});
