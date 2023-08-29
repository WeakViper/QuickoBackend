const { connectToDb, getDb } = require('./Db.js');
const nodeMailer = require('nodemailer');
const express = require('express');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
});

const sendResetPasswordEmail = async (email, name, resetPasswordLink) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'adeeb10372@gmail.com',
                pass: 'Ad170504'
            }
        });

        const mailOptions = {
            from: 'adeeb10372@gmail.com',
            to: email,
            subject: 'Quicko: Reset Password',
            html: `
                <html>
                <head>
                    <style>
                        /* Add your custom styling here */
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Hi ${name},</h2>
                        <p>We received a request to reset your password. Click the button below to reset it:</p>
                        <a class="button" href="${resetPasswordLink}">Reset Password</a>
                    </div>
                </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

router.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body

    const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const expiresIn = 15 * 60;

        const token = jwt.sign({ userEmail: email }, 'your_secret_key', { expiresIn });
        const link = `http://quickonow.com/reset-password/${email}/${token}`;
        console.log(link)
        //sendResetPasswordEmail(email, user.firstName, link);
        next()
    
})

module.exports = router;