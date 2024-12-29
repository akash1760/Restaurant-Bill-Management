const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now } // Ensure this field is set correctly
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
    