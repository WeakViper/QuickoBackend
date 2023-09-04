const express = require('express');
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        const db = getDb();
    }
});


router.get('/orders/user/:userid', async (req, res) => {

    try {
        const userid = req.params.userid;
        const orders = await db.collection('orders').find({ userId: userid }).toArray();
        res.json(orders);

    } catch (error) {
        console.error('Error retrieving products', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;