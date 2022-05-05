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
        const reviewCollection = client.db("sports-gear-warehouse").collection("reviews");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = sportsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // get review
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // find one 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await sportsCollection.findOne(query);
            res.send(result);
        });

        // user items
        app.post('/products', async (req, res) => {
            const doc = req.body;
            const result = await sportsCollection.insertOne(doc);
            res.send(result);
        });


        // update
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            console.log(updatedData);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedData.newQuantity
                }
            }
            const result = await sportsCollection.updateOne(filter, updatedDoc, options);
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