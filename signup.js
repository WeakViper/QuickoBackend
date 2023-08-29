const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
});

const sendVerificationEmail = async (email, name, userId) => {
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

        const verificationLink = `https://quickonow.com/verifyemail/${userId}`; 

        const mailOptions = {
            from: 'adeeb10372@gmail.com',
            to: email,
            subject: 'Quicko: Verify Email Address',
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
                        <h2>Hi {{name}},</h2>
                        <p>Please verify your email address by clicking the button below:</p>
                        <a class="button" href="{{verificationLink}}">Verify Email</a>
                    </div>
                </body>
                </html>
            `.replace('{{name}}', name).replace('{{verificationLink}}', verificationLink)
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


router.post('/signup', [
    // Input validation using express-validator
    check('email').isEmail(),
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('phone').matches(/^\+?1?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/).withMessage('Please provide a valid US or Canada phone number')
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let { email, firstName, lastName, password, phone, addresses, orderHistory, cart } = req.body;
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    password = password.trim();
    phone = phone.trim();

    let verified = false;

    try {
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user object and insert it into the database
        const newUser = {
            email,
            firstName,
            lastName,
            password: hashedPassword,
            phone,
            addresses,
            orderHistory,
            cart,
            verified
        };

        const result = await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User created successfully'});
        sendVerificationEmail(email, firstName, result._id);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

module.exports = router;
