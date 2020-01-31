const bc = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken')

const {jwtSecret} = require('../config/secrets')

const db = require("./auth-model");

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bc.hashSync(req.body.password, 8);

  user.password = hash;

  db.add(user)
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json(err))
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  db.findBy({ username })
    .first()
    .then(user => {
      if (user && bc.compareSync(password, user.password)) {
        const token = signToken(user)

        res.status(200).json({ message: `Welcome ${user.username}`, token, user: user})
      } else {
        res.status(401).json({ message: 'Invalid credentials' })
      }
    })
    .catch(err => res.status(500).json(err))
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
