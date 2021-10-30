const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j06rk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('time-travel');
        const packagesCollection = database.collection('packages');
        const countryCollection = database.collection('countrys');
        const orderCollection = database.collection('orders');

        // Get Api
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        app.get('/packages/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const pack = await packagesCollection.findOne(query);
            console.log('load package  id:', id);
            res.send(pack);
        });
        app.get('/countrys', async (req, res) => {
            const cursor = countryCollection.find({});
            const countrys = await cursor.toArray();
            res.send(countrys);
        });

        app.get('/countrys/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const country = await countryCollection.findOne(query);
            console.log('load package  id:', id);
            res.send(country);
        });
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        app.get('/orders/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query);
            console.log('load package  id:', id);
            res.send(order);
        });
        // post API
        app.post('/packages', async (req, res) => {
            const newPack = req.body;
            const result = await packagesCollection.insertOne(newPack);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            // // check the data
            // console.log('hiting the post', req.body);
            res.json(result);
        });
        app.post('/countrys', async (req, res) => {
            const newPack = req.body;
            const result = await countryCollection.insertOne(newPack);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            // // check the data
            // console.log('hiting the post', req.body);
            res.json(result);
        });
        app.post('/orders', async (req, res) => {
            const newPack = req.body;
            const result = await orderCollection.insertOne(newPack);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            // // check the data
            // console.log('hiting the post', req.body);
            res.json(result);
        });
        // UPDATE API
        app.put('/packages/:id', async (req, res) => {
            const { id } = req.params;
            const updatedPackages = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedPackages.name,
                    information: updatedPackages.information,
                    price: updatedPackages.price,
                    cover: updatedPackages.cover,
                },
            };
            const result = await packagesCollection.updateOne(filter, updateDoc, options);
            // console.log('update packages', req);
            res.json(result);
        });

        // Delete API
        app.delete('/packages/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);

            console.log('delete pack with id ', result);
            res.json(result);
        });
        app.delete('/countrys/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await countryCollection.deleteOne(query);

            console.log('delete country with id ', result);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

// app METHOD
app.get('/', (req, res) => {
    res.send('Wellcome');
});

app.listen(port, () => {
    console.log('running server port at');
});
