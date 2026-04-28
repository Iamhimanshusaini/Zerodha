const { Schema, default: mongoose } = require('mongoose')
const { model } = require('mongoose')


const postionSechma = new Schema(
    {
        product: String,
        name: String,
        qty: Number,
        avg: Number,
        price: Number,
        net: String,
        day: String,
        isLoss: Boolean,
    }
);

const position = model('position', postionSechma);

module.exports = position;