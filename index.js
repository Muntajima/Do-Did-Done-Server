require('dotenv').config()
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oi99s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function run() {
  try {

    const userCollection = client.db('task-management').collection('users');
    const taskCollection = client.db('task-management').collection('tasks')

    app.get('/users', async(req, res) =>{
      console.log(req.headers);
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    app.post('/users', async(req, res) =>{
      const newUser = req.body;
      console.log("new user", newUser);

      const query = {email: newUser.email}
      const existingUser = await userCollection.findOne(query)
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })

    app.get('/tasks', async(req, res) =>{
      const cursor = taskCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.delete('/tasks/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  })



    //https://do-did-done-server.vercel.app/


    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run();


app.get('/', (req, res) =>{
    res.send("do your task")
})

app.listen(port, () =>{
    console.log(`we are waiting from the port of: ${port}`)
})