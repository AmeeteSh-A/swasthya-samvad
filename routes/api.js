const express = require('express');
const router = express.Router();
const { Consultation, User } = require('../models');
const dialogflow = require('@google-cloud/dialogflow');

// Dialogflow Configuration (Same as in app.js)
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: 'C:\\Users\\Lenovo\\swasthya-samvad\\gothic-isotope-449400-h7-77a1f980976f.json'
});
const projectId = 'gothic-isotope-449400';

// Existing endpoints
router.post('/request-consultation', async (req, res) => {
  const consultation = await Consultation.create({
    ...req.body,
    status: 'pending'
  });
  res.json(consultation);
});

router.get('/notifications', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  setInterval(async () => {
    const consultations = await Consultation.findAll({
      where: { status: 'pending' }
    });
    res.write(`data: ${JSON.stringify(consultations)}\n\n`);
  }, 5000);
});

// New Chatbot endpoint
router.post('/chat', async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId, 
    req.sessionID
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: 'en-US'
      }
    }
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ response: result.fulfillmentText });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.json({ response: "I'm having trouble understanding. Please try again." });
  }
});

module.exports = router;