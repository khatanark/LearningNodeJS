const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// Connected the DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: true
}).then( con => {
    //console.log(con.connection);
    console.log('DB connection is succesfull.');
}
)

// Read JSON file.

// Array of js objects.
const tours = JSON.parse(fs.readFileSync('dev-data/data/tours.json', 'utf-8')); // JSON.parse to convert the json object to js object.
const users = JSON.parse(fs.readFileSync('dev-data/data/users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('dev-data/data/reviews.json', 'utf-8'));

//Import the data to DB.
const importData = async() => {
    try{
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false});
        await Review.create(reviews);
        console.log('Data successfully added')
    } catch(err) {
        console.log(err)
    }
}

// Delete all the data from DB.
const deleteData = async() => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted')
    } catch(err) {
        console.log(err)
    }
}

// deleteData();
importData();
