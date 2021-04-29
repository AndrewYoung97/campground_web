const mongoose = require('mongoose')
const cities = require('./cities')
const campground = require('../models/campground')
const {descriptors, places} = require('./seedHelper')

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('connected!')
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const newCampground = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dquz1hxwq/image/upload/v1613180945/yelpcamp/mo7jjr6mdq6eic5rqgwv.jpg",
                    filename: "yelpcamp/mo7jjr6mdq6eic5rqgwv"
                },
                {
                    url: "https://res.cloudinary.com/dquz1hxwq/image/upload/v1613180945/yelpcamp/fssxpu8eof0evmbyplhw.jpg",
                    filename: "yelpcamp/fssxpu8eof0evmbyplhw"
                }
            ],
            author: '601841094e46a00c948d8bb4',
            description: 'good place to go',
            price: Math.floor(Math.random() * 1000)
        })
        await newCampground.save()
    }
}

seedDB().then(() => mongoose.connection.close())