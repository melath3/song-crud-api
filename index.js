require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const cors = require('cors');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})

const routes = require('./routes/routes');
app.use('/api', routes)


