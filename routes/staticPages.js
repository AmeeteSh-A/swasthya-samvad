const express = require('express');
const router = express.Router();

// Serve the home page
router.get('/', (req, res) => {
  res.render('index');  // views/index.ejs
});

// Serve the Features page
router.get('/features', (req, res) => {
  res.render('features');  // views/features.ejs
});

// Serve the ReadMe page
router.get('/readme', (req, res) => {
  res.render('readme');  // views/readme.ejs
});

// Serve the Contacts page
router.get('/contacts', (req, res) => {
  res.render('contacts');  // views/contacts.ejs
});

module.exports = router;
