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

router.get('/reset-password/:id/:token', async (req, res, next) => {
    const { id, token } = req.params;

    try {
        // Find the user by ID
        const user = await db.collection('users').findOne({ _id: id });

        if (!user) {
            // User not found
            return res.status(404).json({ message: 'User not found' });
        }

        const payload = jwt.verify(token, 'your_secret_key', async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
              let user = await db.collection('users').findOne({ email: decodedToken });
              // reset password logic
              next();
            }
          })

        // Check if the provided token matches the user's stored token
        if (user.resetToken !== token) {
            return res.status(401).json({ message: 'Invalid token' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;