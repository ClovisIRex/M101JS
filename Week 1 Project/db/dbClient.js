const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = "mongodb://localhost:27017/m101";


module.exports.getConnection = () => {
    return MongoClient.connect(MONGO_URL)
};


module.exports.createMovie = (conn,movie) => {
    
}
