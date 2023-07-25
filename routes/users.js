const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');
const { validateUser } = require('../middleware');


router.route('/register')
  //get request serves the register form
  .get(users.renderRegister)
  //post request registers users
  .post(validateUser, catchAsync(users.registerUser));

router.route('/login')
  //get request serves login form
  .get(users.renderLogin)
  //post request authenticates and logs users into their accounts
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

//signs user out then redirects them to locations index
router.get('/logout', users.logout);

module.exports = router;