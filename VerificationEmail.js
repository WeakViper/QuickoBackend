const { connectToDb, getDb } = require('./Db.js');
const express = require('express');
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
});

router.post('/verify/:uid', async (req, res) => {
    const { uid } = req.params; // Assuming you're passing the userId in the URL parameter

    try {
        // Find the user by userId and update the "verified" field
        const result = await db.collection('users').updateOne(
            { _id: uid },
            { $set: { verified: true } }
        );

        if (result.modifiedCount === 1) {
            // User was successfully verified
            res.status(200).json({ message: 'User verified successfully' });
            //res.redirect('/verificationsuccess');
        } else {
            // User not found or verification unsuccessful
            res.status(404).json({ message: 'User not found or verification unsuccessful' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
