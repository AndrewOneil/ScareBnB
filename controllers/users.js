const User = require('../Models/user');

//displays register form
module.exports.renderRegister = (req, res) => {
  res.render('users/register');
}

//registers user accounts
module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    //takes user object, hashes password and stores it
    const registeredUser = await User.register(user, password);
    //logs in user after registering then redirects to location index
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to ScareBnB!');
      res.redirect('/hauntedLocations');
    })

  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register')
  }
}

//render login form
module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}

//authenticates and logs user in, flashes messeage and redirects to login page if there is an error during login
module.exports.login = (req, res) => {
  req.flash('success', 'Welcome Back!');
  const redirectUrl = req.session.returnTo || '/hauntedLocations';
  delete req.session.returnTo;
  res.redirect(redirectUrl);

}

//logs user out of their account
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success', 'User signed out, goodbye :)');
    res.redirect('/hauntedLocations');
  });
}