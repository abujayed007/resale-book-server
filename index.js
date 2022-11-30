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
        // collections
        const booksCategoryCollection = client.db('BooksGallery').collection('categories');
        const booksCollection = client.db('BooksGallery').collection('books');
        const bookingsCollection = client.db('BooksGallery').collection('bookings');
        const usersCollection = client.db('BooksGallery').collection('users');

        // categories
        app.get('/categories', async(req, res)=>{
            const query = {}
            const result = await booksCategoryCollection.find(query).toArray()
            res.send(result)
        });

        app.get('/category/:name', async (req, res)=>{
            const name = req.params.name
            const query = {category_name : name}
            const category = await booksCollection.find(query).toArray()
            res.send(category)
         })

         // books
        app.post('/books', async(req, res)=>{
            const book = req.body;
            const result = await booksCollection.insertOne(book)
            res.send(result)
        })   
        app.get('/books', async(req, res)=>{
            const query= {}
            const books = await booksCollection.find(query).toArray()
            res.send(books)
        });

    //    bookings 
        app.post('/bookings', async(req, res)=>{
            const booking = req.body
            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
        })
        app.get('/bookings', async(req, res)=>{
            const email = req.query.email
            console.log(email);
            const query = {email: email}
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })
        // users 
        app.post('/users', async(req, res)=>{
            const users= req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        });
        
        // sellers 
        app.get('/sellers', async(req, res)=>{
            const query = {
                role:'Seller'
            }
            const seller = await usersCollection.find(query).toArray()
            res.send(seller)
            
        });
        // buyers 
        app.get('/buyers', async(req, res)=>{
            const query = {
                role:'Buyer'
            }
            const seller = await usersCollection.find(query).toArray()
            res.send(seller)
            
        });
        // admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'Admin' });
        });

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'Buyer' });
        });


        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        });
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