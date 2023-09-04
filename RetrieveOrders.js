const express = require('express');
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        const db = getDb();
    }
});


router.get('/orders', async (req, res) => {

    try {
        const orders = await db.collection('orders').find().toArray();
        res.json(orders);

    } catch (error) {
        console.error('Error retrieving products', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;