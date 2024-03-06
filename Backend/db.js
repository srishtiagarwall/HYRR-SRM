const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/hyrr-srm';

const connectToMongo = async () => {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB!');
};

module.exports = connectToMongo;