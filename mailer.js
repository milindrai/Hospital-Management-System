const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendRegistrationEmail = (user, token) => {
    const url = `http://localhost:${process.env.PORT}/api/users/verify/${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Verify your email address',
        html: `<p>Hi, ${user.name},</p><p>Please click on the link below to verify your email address:</p><p><a href="${url}">${url}</a></p>`,

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendRegistrationEmail;