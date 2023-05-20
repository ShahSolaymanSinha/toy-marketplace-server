const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB Integration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v7nx3ri.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const allToyCarsCollection = client.db("assignment11DB").collection("allCarCollection");
        const toyTruckCollection = client.db("assignment11DB").collection("toyTruckCollection");
        const miniPoliceCarCollection = client.db("assignment11DB").collection("miniPoliceCarCollection");

        const addedToyCollection = client.db("assignment11DB").collection("addedToyCollection");

        // ---------------------------------------- Get ------------------------------------
        // All Car Data Fetch
        app.get("/cars", async (req, res) => {
            const cursor = allToyCarsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = allToyCarsCollection.find({ _id: new ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result);
        });

        // Toy Truck Data Fetch
        app.get("/trucks", async (req, res) => {
            const cursor = toyTruckCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/trucks/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = toyTruckCollection.find({ _id: new ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result);
        });

        // Mini Police Car Data Fetch
        app.get("/police-cars", async (req, res) => {
            const cursor = miniPoliceCarCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/police-cars/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = miniPoliceCarCollection.find({ _id: new ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result);
        });

        // User Added Toys Data Fetch
        app.get("/added-toys", async (req, res) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const cursor = addedToyCollection
                .find()
                .skip((page - 1) * limit)
                .limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/added-single-toy/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = addedToyCollection.find({ _id: new ObjectId(id) });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/my-all-toys", async (req, res) => {
            const email = req.query.email;
            const cursor = addedToyCollection.find({ sellerEmail: email });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/my-toys", async (req, res) => {
            const email = req.query.email;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const cursor = addedToyCollection
                .find({ sellerEmail: email })
                .skip((page - 1) * limit)
                .limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        });

        // -------------------------------------- Post --------------------------------------
        app.post("/add-toy", (req, res) => {
            const toy = req.body;
            addedToyCollection.insertOne(toy);
            res.send(JSON.stringify("Toy added successfully"));
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
    res.send("I am running on port " + port);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
