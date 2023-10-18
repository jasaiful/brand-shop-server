const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Brand Shop Server is running')
})

app.listen(port, () => {
    console.log(`Brand-Shop Server is running on PORT: ${port}`)
})