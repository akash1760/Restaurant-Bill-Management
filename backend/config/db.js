const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Make sure the connection string is correctly set in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected: ' + conn.connection.host);
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
