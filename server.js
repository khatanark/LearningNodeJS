// It will be our starting file.
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // npm install dotenv
dotenv.config({path: './config.env'})
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// Connected the DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: true
}).then( con => {
    console.log(con.connection);
    console.log('DB connection is succesfull.');
}
)

const port = process.env.PORT || 3000
console.log(process.env)

app.listen(port, () => {
    console.log('App running')
});
