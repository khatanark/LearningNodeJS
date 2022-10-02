const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../models/tourModel')

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
const tours = JSON.parse(fs.readFileSync('dev-data/data/tours-simple.json', 'utf-8')); // JSON.parse to convert the json object to js object.

//Import the data to DB.
const importData = async() => {
    try{
        await Tour.create(tours);
        console.log('Data successfully added')
    } catch(err) {
        console.log(err)
    }
}

// Delete all the data from DB.
const deleteData = async() => {
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted')
    } catch(err) {
        console.log(err)
    }
}

// deleteData();
importData();
