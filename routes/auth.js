const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET Signup Page
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// POST Signup Route with Debug Logging
router.post('/signup', async (req, res) => {
  console.log("Signup route triggered with data:", req.body);
  try {
    const { name, email, password, role } = req.body;
    
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Existing user found for email:", email);
      return res.render('auth/signup', { error: 'Account already exists, please sign in.' });
    }
    
    // Create a new user
    const newUser = await User.create(req.body);
    console.log("New user created:", newUser);
    
    // Set the user session
    req.session.user = newUser;
    
    // Redirect based on role:
    // If patient, redirect to the index page;
    // If doctor, redirect to the doctor home page.
    if (newUser.role === 'patient') {
      res.redirect('/');
    } else if (newUser.role === 'doctor') {
      res.redirect('/doctor/home');
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.render('auth/signup', { error: 'An error occurred during signup. Please try again.' });
  }
});

// GET Signin Page
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

// POST Signin Route with Debug Logging
router.post('/signin', async (req, res) => {
  console.log("Signin route triggered with data:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      console.log("No user found for email:", email);
      return res.render('auth/signin', { error: 'Invalid email or password.' });
    }
    
    req.session.user = user;
    
    // Redirect based on role:
    // If patient, redirect to the index page;
    // If doctor, redirect to the doctor home page.
    if (user.role === 'patient') {
      res.redirect('/');
    } else if (user.role === 'doctor') {
      res.redirect('/doctor/home');
    }
  } catch (error) {
    console.error('Signin Error:', error);
    res.render('auth/signin', { error: 'An error occurred during sign in. Please try again.' });
  }
});

// GET Signout Route
router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during sign out:", err);
      return res.redirect('/');
    }
    res.redirect('/auth/signin');
  });
});

module.exports = router;
