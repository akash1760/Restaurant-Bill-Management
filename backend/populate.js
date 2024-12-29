const mongoose = require('mongoose');
const Bill = require('./models/Bill');

mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB");

        const sampleBills = [
            { amount: 100, date: new Date() },
            { amount: 200, date: new Date() }
        ];

        await Bill.insertMany(sampleBills);
        console.log("Sample bills inserted");
        mongoose.disconnect();
    })
    .catch(err => console.error("Error connecting to MongoDB:", err));
