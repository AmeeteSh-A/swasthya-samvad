const express = require('express');
const router = express.Router();
const { Consultation } = require('../models');
const { createDailyRoom } = require('../utils/daily');

// Patient Home Page
router.get('/home', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('patient/home');
});

// Video Consultation Page
router.get('/video-consult', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  // Display specialties with proper capitalization.
  res.render('patient/video-consult', {
    specialties: ['Orthopedics', 'Gynecology', 'Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'Ophthalmology', 'Oncology', 'Psychiatry', 'General Surgery'],
    roomUrl: null
  });
});

// Handle Video Consultation Request
router.post('/video-consult', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/signin');

    console.log('Attempting to create a Daily room for video consultation...');
    const room = await createDailyRoom();
    console.log('Daily Room Response:', room);

    if (!room || !room.roomUrl) {
      console.error('Room creation failed: Received invalid room data:', room);
      throw new Error('Failed to create video room');
    }

    // Use the selected specialty as-is (e.g., "Orthopedics")
    const specialty = req.body.specialty;

    console.log('Creating consultation record in the database...');
    const consultation = await Consultation.create({
      patientId: req.session.user.id,
      specialty,  
      roomUrl: room.roomUrl,
      status: 'pending'
    });
    console.log('Consultation record created:', consultation);

    res.redirect(`/patient/consultation/${consultation.id}/waiting`);
  } catch (error) {
    console.error('Video Consultation Error:', error);
    res.status(500).render('patient/video-consult', {
      specialties: ['Orthopedics', 'Gynecology', 'Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'Ophthalmology', 'Oncology', 'Psychiatry', 'General Surgery'],
      error: error.message || 'Failed to start consultation. Please try again.',
      roomUrl: null
    });
  }
});

// Waiting Room (shows the consultation while waiting for doctor acceptance)
router.get('/consultation/:id/waiting', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/signin');
    const consultation = await Consultation.findByPk(req.params.id);
    res.render('patient/waiting', { consultation });
  } catch (error) {
    console.error('Waiting Room Error:', error);
    res.redirect('/patient/home');
  }
});

// Live Consultation Status Endpoint for AJAX polling
router.get('/consultation/:id/status', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });
    res.json({
      status: consultation.status,
      prescription: consultation.prescription
    });
  } catch (error) {
    console.error("Error fetching consultation status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// List Completed Consultations
router.get('/consultations', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/signin');
    const consultations = await Consultation.findAll({
      where: { patientId: req.session.user.id }
    });
    res.render('patient/consultations', { consultations });
  } catch (error) {
    console.error('Consultations Error:', error);
    res.redirect('/patient/home');
  }
});

// Download Prescription
router.get('/consultation/:id/prescription', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/auth/signin');
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation.prescription) throw new Error('No prescription found');
    
    // Set headers to force download as a text file
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${consultation.id}.txt`);
    res.send(consultation.prescription);
  } catch (error) {
    console.error('Prescription Download Error:', error);
    res.redirect('/patient/consultations');
  }
});

// AI Chatbot Page
router.get('/chatbot', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('patient/chatbot');
});

// Emergency Guide Page
router.get('/guide', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  const guides = {
    'cardiac-arrest': 'Cardiac Arrest Guide Content...',
    'pregnancy': 'Pregnancy Emergency Guide...',
    'stomach-pain': 'Stomach Pain Guide...'
  };
  res.render('patient/guide', { guides });
});

module.exports = router;
