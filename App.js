const express = require('express');
import { requireAuth, checkUser } from './routeAuth.js';
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const handleSignup = require('./signup');
const handleSignin = require('./signin');

const app = express();

app.use(express.json());

connectToDb((err) => {
    if (!err) {
        app.listen(3100);
    }
});

app.get('*',checkUser);
app.post('/signup', handleSignup);
app.post('/signin', handleSignin);

module.exports = app;


