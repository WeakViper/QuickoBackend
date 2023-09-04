const express = require('express');
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const router = express.Router();

connectToDb((err) => {
    if (!err) {
        const db = getDb();
    }
});


router.get('/products', async (req, res) => {

    try {
        const products = await db.collection('products').find().toArray();
        res.json(products);

    } catch (error) {
        console.error('Error retrieving products', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;