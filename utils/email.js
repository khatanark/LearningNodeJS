const nodemailer = require('nodemailer')

const sendEmail = async options => {
    // 1) Create Transforter. (service which actually sends the email).
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.PORT,
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // 2) Define Email Options 
    const emailOptions = {
        from: 'Rohit Khatana <from@example.com>', 
        to: options.email, 
        subject: options.subject, 
        text: options.message
    }
    // 3) Actually sends the email.
    console.log("In the mailer");
    await transporter.sendMail(emailOptions) // this retursn promises.
}

module.exports = sendEmail