const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lugl172.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const booksCategoryCollection = client.db('BooksGallery').collection('categories');

        app.get('/categories', async(req, res)=>{
            const query = {}
            const result = await booksCategoryCollection.find(query).toArray()
            res.send(result)
        })
    }

    finally{

    }
}
run().catch(error => console.error(error));


app.get('/', (req, res)=>{
    res.send('Server On')
})

app.listen(port, ()=>{
    console.log(`Book Gallery sever running on port ${port}`);
})