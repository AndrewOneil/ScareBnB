const HauntedLocation = require('../Models/hauntedLocation');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

//displays locations index
module.exports.index = async (req, res) => {
  const hauntedLocations = await HauntedLocation.find({});
  res.render('hauntedLocations/index', { hauntedLocations })
}

//displays form to add new location
module.exports.renderNewForm = (req, res) => {
  res.render('hauntedLocations/new');
}

//creates new location
module.exports.createHauntedLocation = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.hauntedLocation.location,
    limit: 1
  }).send()
  const hauntedLocation = new HauntedLocation(req.body.hauntedLocation);
  //adds location coordinates required for creating maps
  hauntedLocation.geometry = geoData.body.features[0].geometry;
  //adds file urls that come back from cloudinary
  hauntedLocation.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  //sets author to currently logged in user
  hauntedLocation.author = req.user._id;
  await hauntedLocation.save();
  console.log(hauntedLocation);
  //saves location to db then redirects to newly added page
  req.flash('success', 'Successfully Added New Haunted Location')
  res.redirect(`/hauntedLocations/${hauntedLocation._id}`)
}

//shows location page
module.exports.showHauntedLocation = async (req, res) => {
  const hauntedLocation = await HauntedLocation.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  //if location doesnt exist then it displays flash error
  if (!hauntedLocation) {
    req.flash('error', 'Cannot Find That Location');
    return res.redirect('/hauntedLocations');
  }
  res.render('hauntedLocations/show', { hauntedLocation });
}

//shows edit location form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const hauntedLocation = await HauntedLocation.findById(id)
  //if location doesnt exist then it displays flash error
  if (!hauntedLocation) {
    req.flash('error', 'Cannot Find That Location');
    return res.redirect('/hauntedLocations');
  }

  res.render('hauntedLocations/edit', { hauntedLocation });
}

//updates location details
module.exports.updateHauntedLocation = async (req, res) => {
  const { id } = req.params
  console.log(req.body);
  const hauntedLocation = await HauntedLocation.findByIdAndUpdate(id, { ...req.body.hauntedLocation })
  //takes new images and pushes them onto images array
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  hauntedLocation.images.push(...imgs);
  await hauntedLocation.save();
  //if there are any images to delete find and delete them in mongodb & cloudinary
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await hauntedLocation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success', 'Successfully Updated Haunted Location');
  res.redirect(`/hauntedLocations/${hauntedLocation._id}`)
}

//deletes location
module.exports.deleteHauntedLocation = async (req, res) => {
  const { id } = req.params;
  await HauntedLocation.findByIdAndDelete(id);
  req.flash('sucess', 'Sucessfully Deleted Location');
  res.redirect('/hauntedLocations');
}