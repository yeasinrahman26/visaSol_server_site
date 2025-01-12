const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yog8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri =
//   "mongodb+srv://visaSol:Iamsafa007@cluster0.yog8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // await client.connect();

    const visaCollection = client.db("visaDB").collection("visa");
    const applicationCollection = client
      .db("visaDB")
      .collection("applications");
    

    app.get("/visas", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/visa", async (req, res) => {
      const email = req.query.email;
      let query = { email: email };
      const cursor = visaCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    
    app.get("/visas/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await visaCollection.findOne(query);
        res.send(result);
    });
    
    app.post("/visas", async (req, res) => {
        const newVisa = req.body;
        console.log(newVisa);
        const result = await visaCollection.insertOne(newVisa);
        res.send(result);
    });

    // add visa updated 
     app.put("/visas/:id", async (req, res) => {
    const id = req.params.id;
    const updatedVisa = req.body;

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: updatedVisa,
    };

    const result = await visaCollection.updateOne(filter, updateDoc);
    res.send(result)

  });


    // added visa delete
    app.delete("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });




    // application post
    app.post("/applications", async (req, res) => {
        const applicationData = req.body;
        const result = await applicationCollection.insertOne(applicationData);
        res.status(201).send(result);

    });
    // my visa application get
    app.get("/applications", async (req, res) => {
      const email = req.query.email;
      let query = { email: email };
      const cursor = applicationCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // visa application cancel
    app.delete("/applications/:id",async (req,res)=>{
      const id=req.params.id;
      const query ={_id: new ObjectId(id)};
      const result=await applicationCollection.deleteOne(query)
      res.send(result)
    });

    


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("visa sol is running");
});
app.listen(port, () => {
  console.log(`visa sol is running on port${port}`);
});
