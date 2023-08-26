const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        const db = getDb();
    }
});

router.post('/signin', async (req, res) => {
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
        const expiresIn = rememberMe ? 24 * 60 * 60 * 10 : 60 * 30; //10 days vs. half hour

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn });
        res.cookie('jwt', token, {httpOnly: true, maxAge: expiresIn * 1000})
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
