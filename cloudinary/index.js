const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//config connects cloudinary account to app
cloudinary.config({
  //cloudinary API keys taken from ENV file
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    //specifies the cloudindary folder used to store images and the file types accepted
    folder: 'ScareBnB',
    allowedFormats: ['jpeg', 'png', 'jpg']
  }
});

module.exports = {
  cloudinary,
  storage
}