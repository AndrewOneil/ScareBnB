const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

  url: String,
  filename: String

});


//virtual property used to make smaller thumbnail images of locations
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
})

//required for popupMarkups to display
const opts = { toJSON: { virtuals: true } };

//this is the schema used for the haunteLocations collection in the mongoDB database 
const HauntedLocationSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts);

//popUpMarkup is used to display page links on cluster map
HauntedLocationSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/hauntedLocations/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 35)}...</p>`;
})

//queries database and deletes any reviews so there are no orphan reviews
HauntedLocationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('HauntedLocation', HauntedLocationSchema)