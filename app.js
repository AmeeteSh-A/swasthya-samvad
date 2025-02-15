const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const path = require('path');

const app = express();

// Configuration
app.set('views', path.join(__dirname, 'views')); // Ensure the views folder is set
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Enable JSON parsing for AJAX requests

app.use(session({
  secret: 'hackathon-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Middleware to update doctor's specialty from "Ortho" to "Orthopedics"
app.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'doctor') {
    if (req.session.user.specialty === 'Ortho') {
      req.session.user.specialty = 'Orthopedics';
      console.log("Updated doctor's specialty from 'Ortho' to 'Orthopedics'");
    }
  }
  next();
});

// Database setup
const { sequelize, User, Consultation } = require('./models');

// Verify database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected!'))
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1); // Exit if database connection fails
  });

// Sync database (Use { force: true } only if resetting the database)
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database tables synced!'))
  .catch(err => console.error('❌ Database sync error:', err));

// Global user middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Daily.co Video Call Setup
const { createDailyRoom } = require('./utils/daily'); // ✅ Corrected Import

// Route imports
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const apiRoutes = require('./routes/api');
const contactsRoutes = require('./routes/contacts'); // NEW: Import contacts routes

// Debug: Log the imported routes to verify they are functions
console.log('authRoutes:', authRoutes);
console.log('patientRoutes:', patientRoutes);
console.log('doctorRoutes:', doctorRoutes);
console.log('apiRoutes:', apiRoutes);
console.log('contactsRoutes:', contactsRoutes);

// Route setup for authentication, patient, doctor, API, and contacts routes
app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/api', apiRoutes);
app.use('/contacts', contactsRoutes); // NEW: Use contacts route for GET and POST on /contacts

// Daily.co Room Route
app.get('/daily-room', async (req, res) => {
  try {
    const room = await createDailyRoom();
    res.json(room);
  } catch (error) {
    console.error("Error creating Daily room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// -----------------------------
// DEMO ROUTES FOR FRONT-END PAGES
// -----------------------------

// Root route: if no user session exists, redirect to sign in; otherwise, show index page.
app.get('/', (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/signin');
  } else {
    res.render('index'); // Ensure that views/index.ejs exists
  }
});

// Features page
app.get('/features', (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/signin');
  } else {
    res.render('features'); // Ensure that views/features.ejs exists
  }
});

// ReadMe page
app.get('/readme', (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/signin');
  } else {
    res.render('readme'); // Ensure that views/readme.ejs exists
  }
});

// Articles page
app.get('/articles', (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/signin');
  } else {
    res.render('articles');
  }
});

app.get('/cardiac-arrest', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/signin');
  }
  res.render('cardiac-arrest');
});

app.get('/pregnant-labor', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/signin');
  }
  res.render('pregnant-labor');
});

app.get('/snake-bites', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('snake-bites');
});

app.get('/choking-incident', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('choking-incident');
});

app.get('/seizure', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('seizure');
});

app.get('/allergic-reaction', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('allergic-reaction');
});

app.get('/severe-bleeding', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('severe-bleeding');
});

app.get('/stroke-response', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('stroke-response');
});

app.get('/drowning', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('drowning');
});

app.get('/heatstroke', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('heatstroke');
});

app.get('/sore-throat', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('sore-throat');
});

app.get('/upset-stomach', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('upset-stomach');
});

app.get('/insomnia', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('insomnia');
});

app.get('/headaches', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('headaches');
});

app.get('/anxiety-panic', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('anxiety-panic');
});

app.get('/boost-immune', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('boost-immune');
});

app.get('/muscle-cramps', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('muscle-cramps');
});

app.get('/eye-strain', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('eye-strain');
});

app.get('/hair-loss', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('hair-loss');
});

app.get('/low-energy', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/signin');
  res.render('low-energy');
});

app.get('/', (req, res) => {
  res.send('Hello from swasthya-samvad!');
});




// -----------------------------
// 404 Handler
// -----------------------------
app.use((req, res) => {
  res.status(404).render('404', { 
    message: 'Page not found',
    user: req.session.user || null
  });
});

// -----------------------------
// Error Handling Middleware
// -----------------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).render('500', {
    message: 'Something went wrong!',
    user: req.session.user || null
  });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
});

