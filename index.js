const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqnij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const sportsCollection = client.db("sports-gear-warehouse").collection("sports-items");
        const userItemsCollection = client.db("sports-gear-warehouse").collection("userItems");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = await sportsCollection.find(query).toArray();
            res.send(cursor);
        });

        // user items
        app.post('/userItems', async (req, res) => {
            const doc = req.body;
            const result = await userItemsCollection.insertOne(doc);
            res.send(result);
        })

        // delete 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sportsCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('sports gear warehouse server running');
});

app.listen(port, () => {
    console.log('listening port', port);
});