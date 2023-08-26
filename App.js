const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { connectToDb, getDb } = require('./Db.js');

const app = express()
app.use(express.json());
let db

connectToDb((err) => {
    if (!err) {
        app.listen(3100)
        db = getDb()
    }
})

app.post('/signup', [
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
        const hashedPassword = await bcrypt.hash(password, 12); // 10 is the number of salt rounds

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
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/signin', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Determine the expiration time based on "rememberMe"
        const expiresIn = rememberMe ? '7d' : '1h'; // Example: 7 days vs. 1 hour

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

