const mongoose = require('mongoose')

const holdingSchema = new mongoose.Schema({

    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,

});

const holding = mongoose.model('allHolding', holdingSchema);
module.exports = holding;