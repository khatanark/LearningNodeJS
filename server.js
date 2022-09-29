// It will be our starting file.
const dotenv = require('dotenv'); // npm install dotenv
const app = require('./app');

dotenv.config({path: './config.env'})
const port = process.env.PORT || 3000
console.log(process.env)

app.listen(port, () => {
    console.log('App running')
});