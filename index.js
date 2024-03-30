

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express=require('express')
const cors=require('cors')
require('dotenv').config()
const app=express();
const port=process.env.PORT||5000;

//midleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wczlveg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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

const coffeeCollect=client.db('coffeeDB').collection('cofee')

//Firebase for this
const userCollection=client.db('userCollections').collection('user')
//step 3

app.delete('/coffee/:id',async(req,res)=>{
  const id=req.params.id;
console.log('delee id form ',id)
const query={_id: new ObjectId(id)}
const result=await coffeeCollect.deleteOne(query)
res.send(result)

})
//step 4
app.get('/coffee/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=await coffeeCollect.findOne(query)
  res.send(result)
})
//setp5
app.put('/coffee/:id',async(req,res)=>{
  const id=req.params.id;

  const coffeup=req.body
  console.log(id,coffeup)
  const filer={_id: new ObjectId(id)}
  const option={upsert:true}
  const upadated={
    $set:{
      name:coffeup.name,
      photo:coffeup.photo,
      category:coffeup.category,
      chef:coffeup.chef,
      teste:coffeup.teste,
      Details:coffeup.Details,
      Supplier:coffeup.Supplier
    }
  }
const result=await coffeeCollect.updateOne(filer,upadated,option)
 res.send(result);
})





//step 2
app.get('/coffee',async(req,res)=>{
  const coursor=coffeeCollect.find()
  const result=await coursor.toArray()
  res.send(result)
  })
  

//step 1
app.post('/coffee',async(req,res)=>{
  const coffee=req.body;
  console.log('post coffe is suxxe',coffee)
  const result= await coffeeCollect.insertOne(coffee)
  res.send(result)
})












//step 1
// app.post('/coffee',async(req,res)=>{
//   const newCoffee=req.body;
//   console.log(newCoffee)
// })


//user releted  api
app.post('/user',async(req,res)=>{
  const user=req.body;
  console.log(user)
  const result=await userCollection.insertOne(user)
  res.send(result)
});

//red data
app.get('/user',async(req,res)=>{
  const cursor=userCollection.find();
  const users=await cursor.toArray();
  res.send(users)

})

//delete data
app.delete('/user/:id',async(req,res)=>{
  const id =req.params.id;
 const query={_id: new ObjectId(id)}
 const result=await userCollection.deleteOne(query)
 res.send(result)

})
//updat data
app.patch('/user',async(req,res)=>{
  const user=req.body;
 const filter={
  email:user.email
 }
 const upadated={
  $set:{
    lastLoggedAt:user.lastLoggedAt
  }
 }
 const result=await userCollection.updateOne(filter,upadated)
 res.send(result)
})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.log);






















app.get('/',(req,res)=>{
    res.send('coffee server is running ')
})
app.listen(port,()=>{
    console.log(`Coffee server listening on port ${port} `)
})