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

    if ( !username || !password ) {
      res.send('please fill in all forms');
    } else if ( result[0] == undefined ) {
      res.send('user not found');
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
  const data = `SELECT * FROM users WHERE username = ? OR email = ?`;
  const sql = `INSERT INTO users VALUES (0, '${username}', '${email}', '${hashPass}')`;

  if ( !username || !email || !password ) {
    res.send('please fill in all forms');
  } else {
    db.query(data, [username, email], (err, result) => {
      if ( result[0].username == username ) {
        res.send('username already in use');
      } else if ( result[0].email == email ) {
        res.send('email already in use');
      } else {
        db.query(sql, (err, result) => {
          if (err) return next(err);
    
          res.redirect('/');
        });
      }
    })
  }
});

router.get('/logout', (req, res, next) => {
  if ( req.session.username ) {
    req.session.username = false;
    res.redirect('/');
  } else {
    res.redirect('/');
  }
})

router.get('*', (req, res, next) => {
  res.status(404).send('404');
});

module.exports = router;