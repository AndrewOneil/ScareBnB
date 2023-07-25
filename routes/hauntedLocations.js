const express = require('express');
const router = express.Router();
const hauntedLocations = require('../controllers//hauntedLocations');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateHauntedLocation, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
  //Locations Index Route
  .get(catchAsync(hauntedLocations.index))
  //post request is used to post new haunted locations
  .post(isLoggedIn, upload.array('image'), validateHauntedLocation, catchAsync(hauntedLocations.createHauntedLocation));


//this is the route to add new haunted locations
router.get('/new', isLoggedIn, hauntedLocations.renderNewForm);

router.route('/:id')
  //get request is used to display pages of specific locations
  .get(catchAsync(hauntedLocations.showHauntedLocation))
  //put request is used upate location details
  .put(isLoggedIn, isAuthor, upload.array('image'), validateHauntedLocation, catchAsync(hauntedLocations.updateHauntedLocation))
  //delete request is used to delete locations
  .delete(isLoggedIn, isAuthor, catchAsync(hauntedLocations.deleteHauntedLocation));



//this route is used to display edit location form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hauntedLocations.renderEditForm));

module.exports = router;
