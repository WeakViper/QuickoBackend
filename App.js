const express = require('express');
const { requireAuth, checkUser } = require('./routeAuth.js')
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const handleSignup = require('./signup');
const handleSignin = require('./signin');
const handleVerificationEmail = require('./VerificationEmail.js');
const handleForgotPassword = require('./ForgotPassword.js')


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
app.get('/verify/:uid', handleVerificationEmail);
app.post('/forgot-password', handleForgotPassword);
app.get('/reset-password/:id/:token', handleResetPassword);

module.exports = app;


