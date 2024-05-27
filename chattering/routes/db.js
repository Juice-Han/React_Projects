const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@cluster0.uyhgcoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports = client