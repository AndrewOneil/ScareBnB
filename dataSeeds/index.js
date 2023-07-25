const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedDescriptors');
const HauntedLocation = require('../Models/hauntedLocation');


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

//Passes in array and returns random element from the array, will be used to choose location names
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  //deletes everything out of database
  await HauntedLocation.deleteMany({});
  //fills database with 50 random locations
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 35) + 5;
    const hauntedLocation = new HauntedLocation({
      //author id for user andy2, this will need changed if database is reset
      author: '641ae527fd64824fc0d1a904',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, debitis reiciendis! Totam repellat, quisquam quidem molestiae ipsa magnam eius inventore cum voluptatum eos quas consequatur atque sequi, suscipit, dolorem fugit.',
      price,
      geometry: {
        "type": "Point",
        //hard coded to the coordinates of new college durham
        "coordinates": [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dcjby4uou/image/upload/v1679587449/ScareBnB/bnqedj4f46dwdfmefcc5.jpg',
          filename: 'ScareBnB/bnqedj4f46dwdfmefcc5'
        },
        {
          url: 'https://res.cloudinary.com/dcjby4uou/image/upload/v1679587450/ScareBnB/ppncwokjlx5udstocsuq.jpg',
          filename: 'ScareBnB/ppncwokjlx5udstocsuq'
        }
      ]
    })
    await hauntedLocation.save();

  }
}

seedDB().then(() => {
  mongoose.connection.close();
});