const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

module.exports = {
    connect: async () => {
        // Use connect method to connect to the server
        await client.connect();
        const db = client.db(process.env.MONGO_NAME);
        // const collection = db.collection('documents');
      
        // the following code examples can be pasted here...
      
        return 'done.';
    },

    insertOne: async (collectionName, document) => {
        await client.connect();
        const db = client.db(process.env.MONGO_NAME);
        const collection = db.collection(collectionName);
        await collection.insertOne(document);
    },

    updateOrCreate: async (collectionName, query, document) => {
        await client.connect();
        const db = client.db(process.env.MONGO_NAME);
        const collection = db.collection(collectionName);
        await collection.updateOne(query, { $set: { ...document } }, { upsert: true });
    },

    find: async (collectionName, query = {}) => {
        await client.connect();
        const db = client.db(process.env.MONGO_NAME);
        const collection = db.collection(collectionName);
        const cursor = collection.find(query);
        const documents = await cursor.toArray();
        return documents;
    },

    findOne: async (collectionName, query = {}) => {
        await client.connect();
        const db = client.db(process.env.MONGO_NAME);
        const collection = db.collection(collectionName);
        const document = await collection.findOne(query);
        return document;
    },
    
    disconnect: async () => {
        client.close();
    }
};