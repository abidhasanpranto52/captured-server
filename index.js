const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkms10x.mongodb.net/?retryWrites=true&w=majority`;

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



    const courseCollection = client.db("capturedDb").collection("course");
    const instructorCollection = client.db("capturedDb").collection("instructor");
    const cartsCollection = client.db("capturedDb").collection("cart");



    app.get('/course', async (req,res) => {
        const result = await courseCollection.find().toArray();
        res.send(result)
    })
    app.get('/instructor', async (req,res) => {
        const result = await instructorCollection.find().toArray();
        res.send(result)
    })

    app.get("/instructorInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          instructor: 1,
          email: 1,
          instructor_id: 1,
          instructorImg: 1,
          classTaken: 1,
          postedBy: 1,
          classes: 1,
        },
      };
      const result = await instructorCollection.findOne(query, options);
      res.send(result);
    });

    
//student selected class
    app.post("/carts", async (req, res) => {
      const item = req.body;
      // console.log(item);
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    });
    app.get("/carts", async (req, res) => {
      const item = req.body;
      // console.log(item);
      const result = await cartsCollection.find(item).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Captured Moments Server Running");
  });
  
  app.listen(port, () => {
    console.log(`Captured Moments Server Running on Port ${port}`);
  });
  