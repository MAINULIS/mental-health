const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Health is wealth")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fxhf2q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection = client.db("mentalHealth").collection("service");

    // 1. insert a service to db
    app.post("/service", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    })

    // 2.get all service data
    app.get("/all-services", async(req, res) => {
      const services = serviceCollection.find();
      const result = await services.toArray();
      res.send(result);
    })

    // 2.1 get a specific data
    app.get("/services/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(filter);
      res.send(result)
    })
    // 3. update a service
    app.patch("/services/:id", async(req, res) => {
      const id = req.params.id;
      const updatedService = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          ...updatedService
        }
      }
      const result = await serviceCollection.updateOne(filter, updatedDoc);
      res.send(result)

    })
    // 4. delete
    app.delete("/services/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await serviceCollection.deleteOne(filter);
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.log);



app.listen(port, () => {
  console.log(`port is running on ${port}`)
})