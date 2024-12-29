const mongoose = require('mongoose');

const Reports = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    bills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bill',
        },
    ],
});

const Report= mongoose.model('Report', Reports);
module.exports=  Report;