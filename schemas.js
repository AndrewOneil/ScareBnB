const Joi = require('joi');
const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
//Server-side validation rules for locations schema, validates form data before its submitted to database
module.exports.hauntedLocationSchema = Joi.object({
  hauntedLocation: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    //image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()

  }).required(),
  deleteImages: Joi.array()
});
//validation rules for reviews, validates data before its submitted to database
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})

module.exports.userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(RegExp(pattern)).required()

})

