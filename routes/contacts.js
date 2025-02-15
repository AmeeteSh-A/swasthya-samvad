// routes/contacts.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// GET contacts page
router.get('/', (req, res) => {
    res.render('contacts', { 
      success: req.query.success, 
      error: req.query.error 
    });
  });
  
// POST contacts form submission
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received contact form submission:", req.body);

  // Create a transporter using Gmail with secure connection settings
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
      user: 'swasthya.samvad.demo@gmail.com',
      pass: 'tvuhjiuwfqkhjmny'  // your app password (without spaces)
    },
    logger: true,
    debug: true
  });

  let mailOptions = {
    from: '"Swasthya Samvad" <swasthya.samvad.demo@gmail.com>', // Must match the authenticated user
    to: 'swasthya.samvad.demo@gmail.com',
    subject: 'New Contact Form Submission',
    text: `You have a new message from the contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ' + info.response);
    res.redirect('/contacts?success=true');
  } catch (error) {
    console.error('Error sending email:', error);
    res.redirect('/contacts?error=true');
  }
});

module.exports = router;
