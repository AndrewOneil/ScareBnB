const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String
});

//adds username, email and password fields to schema, checks usernames are unique
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
