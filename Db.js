const { MongoClient } = require('mongodb');

let dbConnection;

function connectToDb(cb) {
    MongoClient.connect('mongodb://localhost:27017/quicko')
        .then((client) => {
            dbConnection = client.db();
            return cb();
        })
        .catch((err) => {
            console.log(err);
            return cb(err);
        });
}

function getDb() {
    return dbConnection;
}

module.exports = {
    connectToDb,
    getDb
};

