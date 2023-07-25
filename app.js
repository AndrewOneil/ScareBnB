//requires ENV package when in development, ENV is used to handle API keys
/*if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}*/
//packages and files required for the app to launch
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user');
const userRoutes = require('./routes/users');
const hauntedLocationsRoutes = require('./routes/hauntedLocations');
const reviewRoutes = require('./routes/reviews');

//supresses deprecated warning as this app is now using an earlier version of mongoose
mongoose.set('strictQuery', false);
//Accesses database, if there is no database it creates one
mongoose.connect('mongodb://localhost:27017/ScareBnB-DB')

//connects to database, if unsuccessful prints out error to console 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
})

const app = express()

//allows ejs-mate to be used
app.engine('ejs', ejsMate);
//setup ejs and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//tells express to parse body when making post requests such as adding new locations
app.use(express.urlencoded({ extended: true }))
//tells app to use method override npm package to fake 'PUT' requests when editing locations
app.use(methodOverride('_method'))
//tells app to serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  //secret is required for when the app goes into production, can be changed later
  secret: 'scarebnbSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
//tells app to use session with session config
app.use(session(sessionConfig));
//tell app to use flash
app.use(flash());
//tells app to use passport for authentication
app.use(passport.initialize());
//ensures there are persistant login sessions
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//tells the app how to store a user in the session
passport.serializeUser(User.serializeUser());
//tells the app how to get the user out of the session
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  console.log(req.session)
  //provides access to user details under currentUser variable
  res.locals.currentUser = req.user;
  //stores flash messages in locals variables so they can be used when required
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

//tells app to use route files from routes directory
app.use('/', userRoutes);
app.use('/hauntedLocations', hauntedLocationsRoutes)
app.use('/hauntedLocations/:id/reviews', reviewRoutes)

//Home Route, renders the homepage
app.get('/', (req, res) => {
  res.render('home')
})

//checks all requests and all paths for errors
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

//any errors a renders using the errorTemplate file
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Error, Something Went Wrong :('
  res.status(statusCode).render('errorTemplate', { err });
})

//Website will start to serve on port 3000
app.listen(3000, () => {
  console.log('Serving on Port 3000')
})