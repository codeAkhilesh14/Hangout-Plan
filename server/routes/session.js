const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Session = require('../models/Session');

// Helper to generate a unique session ID
const generateSessionId = () => {
  return crypto.randomUUID();
};

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { dodgeCount } = req.body;
    
    // Generate a unique session ID
    const sessionId = generateSessionId();
    
    const newSession = new Session({
      sessionId,
      response: 'yes',
      dodgeCount: typeof dodgeCount === 'number' ? dodgeCount : 0,
      completed: false
    });
    
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update session incrementally
router.patch('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { day, place, timeSlot } = req.body;
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Update fields if provided
    if (day !== undefined) {
      if (day !== 'Saturday' && day !== 'Sunday') {
        return res.status(400).json({ error: 'Invalid day. Must be Saturday or Sunday' });
      }
      session.day = day;
    }
    
    if (place !== undefined) {
      session.place = place;
    }
    
    if (timeSlot !== undefined) {
      session.timeSlot = timeSlot;
    }
    
    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Complete session
router.patch('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.completed = true;
    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

module.exports = router;
