require('dotenv').config()
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imeoc20.mongodb.net/?retryWrites=true&w=majority`;


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
        // await client.connect();

        const brandCollection = client.db('brandShopDB').collection('brand');
        const userCollection = client.db('brandShopDB').collection('user');

        app.post('/brands', async (req, res) => {
            const brand = req.body;
            console.log(brand);
            const result = await brandCollection.insertOne(brand);
            res.send(result);
        })

        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find();
            const brand = await cursor.toArray();
            res.send(brand);
        })


        app.get('brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await brandCollection.findOne(query);
            res.send(result);
        })

        app.get('/brands/:brandName/products', async (req, res) => {
            const brandName = req.params.brandName;
            try {
                const products = await brandCollection.find({ brand: brandName }).toArray();

                if (products.length === 0) {
                    res.status(404).send('No products available for this brand');
                } else {
                    res.json(products);
                }
            } catch (error) {
                console.error('Error fetching products by brand:', error);
                res.status(500).send('Error fetching products by brand');
            }
        });

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/googleUser', async (req, res) => {
            const googleUser = req.body;
            console.log(googleUser);
            const result = await userCollection.insertOne(googleUser);
            res.send(result);
        })

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const user = await cursor.toArray();
            res.send(user);
        })

        app.patch('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand Shop Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})