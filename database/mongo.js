const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

module.exports = {
    connect: async () => {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(process.env.MONGO_NAME);
        // const collection = db.collection('documents');
      
        // the following code examples can be pasted here...
      
        return 'done.';
    },
    
    disconnect: async () => {
        client.close();
    }
};