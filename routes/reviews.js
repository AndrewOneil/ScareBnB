const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utilities/catchAsync');

//this route is used for location reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//this route is used to delete user submitted reviews
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;