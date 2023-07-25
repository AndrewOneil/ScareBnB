const { hauntedLocationSchema, reviewSchema, userSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const HauntedLocation = require('./Models/hauntedLocation');
const Review = require('./Models/review');


module.exports.isLoggedIn = (req, res, next) => {
  console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    //returnTo is the URL that website should redirect to
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateHauntedLocation = (req, res, next) => {
  //validates form data
  const { error } = hauntedLocationSchema.validate(req.body);
  //if there is an error when validating form data then it maps over the array of error details and throws it as a single error message. this only occurs if client-side validation is somehow bypassed.
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const hauntedLocation = await HauntedLocation.findById(id);
  //if author and current user id dont match then user cannot edit location details
  if (!hauntedLocation.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/hauntedLocations/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await Review.findById(reviewID);
  //if author and current user id dont match then user cannot edit location details
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/hauntedLocations/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  //maps over array and displays error is there is one
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  //maps over array and displays error is there is one
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


