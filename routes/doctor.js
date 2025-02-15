const express = require('express');
const router = express.Router();
const { Consultation, User } = require('../models');

// Doctor Home Page with Pending Consultations
// Doctor Home Page with Pending Consultations
// Doctor Home Page with Pending Consultations (with debug logging)
router.get('/home', async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  
  try {
    // Log doctor's specialty from session
    console.log("Doctor's specialty:", req.session.user.specialty);

    // Find pending consultations that match the doctor's specialty
    const pendingConsultations = await Consultation.findAll({
      where: {
        specialty: req.session.user.specialty,
        status: 'pending'
      }
    });
    
    console.log("Pending consultations found:", pendingConsultations);
    
    // Render the doctor's home view with the pending consultations
    res.render('doctor/home', { pendingConsultations });
  } catch (error) {
    console.error('Error fetching pending consultations:', error);
    res.status(500).send('Server Error');
  }
});



// Accept Consultation
router.post('/consultation/:id/accept', async (req, res) => {
  try {
    await Consultation.update(
      {
        status: 'accepted',
        doctorId: req.session.user.id
      },
      {
        where: { id: req.params.id }
      }
    );
    res.redirect(`/doctor/consultation/${req.params.id}`);
  } catch (error) {
    console.error('Error accepting consultation:', error);
    res.status(500).send('Server Error');
  }
});

// Consultation Room
router.get('/consultation/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    res.render('doctor/consultation', { consultation });
  } catch (error) {
    console.error('Error fetching consultation details:', error);
    res.status(500).send('Server Error');
  }
});

// Prescription Form (Updated: Save prescription without ending the call)
router.post('/consultation/:id/prescription', async (req, res) => {
  try {
    await Consultation.update(
      {
        prescription: req.body.prescription
        // Notice: We are no longer updating the status to 'completed'
      },
      {
        where: { id: req.params.id }
      }
    );
    // Instead of redirecting, send a JSON response so the client-side can update the UI without leaving the call.
    res.json({ message: 'Prescription saved successfully.' });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription.' });
  }
});


// Export the router so it can be used in app.js
module.exports = router;
