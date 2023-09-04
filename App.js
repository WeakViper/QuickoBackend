const express = require('express');
const cors = require('cors');
const { requireAuth, checkUser } = require('./routeAuth.js')
const { connectToDb, getDb } = require('./Db.js'); // Assuming Db.js is properly set up
const handleSignup = require('./signup');
const handleSignin = require('./signin');
const handleVerificationEmail = require('./VerificationEmail.js');
const handleForgotPassword = require('./ForgotPassword.js')
const cookieParser = require('cookie-parser');
const retrieveProducts = require("./RetrieveProducts.js")
const retrieveProductsCategories = require("./RetreiveProductsCategories.js")
const retrieveProductsSearch = require('./RetrieveProductsSearch.js')
const retrieveOrders = require('./RetrieveOrders.js');
const retrieveOrdersUser = require('./RetrieveOrdersUser.js');
const retrieveIncompleteOrders = require('./RetrieveIncompleteOrders.js')

const corsOptions = {
    // origin: 'http://yourfrontenddomain.com', secure this later
    methods: 'GET, POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

connectToDb((err) => {
    if (!err) {
        app.listen(3100);
    }
});

//app.get('*',checkUser);

app.post('/signup', handleSignup);
app.post('/signin', handleSignin);

app.get('/verify/:uid', handleVerificationEmail);
app.post('/forgot-password', handleForgotPassword);
//app.get('/reset-password-link/:id/:token', handleResetPassword);

app.get('/products', retrieveProducts);
app.get('/products/categories/:category', retrieveProductsCategories);
app.get('/products/search/:search', retrieveProductsSearch);

app.get('/orders', retrieveOrders);
app.get('/orders/user/:userid', retrieveOrdersUser);
app.get('/orders/incomplete', retrieveIncompleteOrders);

module.exports = app;


