const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
});

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
    
    let { email, firstName, lastName, password, phone, addresses, orderHistory } = req.body;
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    password = password.trim();
    phone = phone.trim();

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
            orderHistory
        };

        const result = await db.collection('users').insertOne(newUser);
        
        res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

module.exports = router;
