const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');

router.get('/', (req, res, next) => {
  if ( req.session.username ) {
    let sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.query(sql, [req.session.username, req.session.username], (err, result) => {
      if (err) return next(err);

      res.render('index', {
        profile: result[0]
      });
    } )
  } else res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const sql = await `SELECT * FROM users WHERE username = ? OR email = ?`;

  db.query(sql, [username, username], async (err, result) => {
    if (err) return next(err);

    if ( result.length == 0 ) {
      res.send('failed');
    } else {
      const comparePass = await bcrypt.compare(password, result[0].password);
      if ( comparePass == false || result.length == 0 ) res.send('failed') ;
      else {
        req.session.username = result[0].username;
        res.redirect('/');
      };
    }
  });
});


router.get('/register', (req, res, next) => {
  if ( req.session.username ) res.redirect('/');
  else res.render('auth/register');
});

router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPass = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users VALUES (0, '${username}', '${email}', '${hashPass}')`;

  db.query(sql, (err, result) => {
    if (err) return next(err);

    res.redirect('/');
  });
});

router.get('*', (req, res, next) => {
  res.send('404');
});

module.exports = router;