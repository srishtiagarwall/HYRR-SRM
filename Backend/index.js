const connectToMongo = require('./db');
const express = require('express');
const app = express(); // Creating an express application
const port = 8080;

connectToMongo(); // Connecting to MongoDB

app.use(express.json()); // Parsing JSON requests

app.use('/api/auth', require('./routes/auth')); // Authentication route

app.get('/', (req, res) => { // Default route
    res.send('Hello!');
});

app.listen(port, () => { // Starting the server
    console.log(`Server is running at http://localhost:${port}`);
});