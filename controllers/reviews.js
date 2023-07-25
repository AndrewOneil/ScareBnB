const HauntedLocation = require('../Models/hauntedLocation');
const Review = require('../Models/review');


//creates user submitted reviews
module.exports.createReview = async (req, res) => {
  const hauntedLocation = await HauntedLocation.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  hauntedLocation.reviews.push(review);
  await review.save();
  await hauntedLocation.save();
  req.flash('success', 'Added New Review');
  res.redirect(`/hauntedLocations/${hauntedLocation._id}`);
}

//deletes user submitted reviews
module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  //$pull is a mongo operator used to pull specfic review without deleting all reviews
  await HauntedLocation.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
  await Review.findByIdAndDelete(reviewID);
  req.flash('success', 'Sucessfully Deleted Review');
  res.redirect(`/hauntedLocations/${id}`);
}