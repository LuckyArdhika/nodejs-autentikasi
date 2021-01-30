const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res, next) => {
  if ( req.session.username ) res.render('index');
  else res.render('auth/login');
});

router.get('/register', (req, res, next) => {
  if ( req.session.username ) res.redirect('/');
  else res.render('auth/register');
});

router.get('*', (req, res, next) => {
  res.send('404');
});

module.exports = router;