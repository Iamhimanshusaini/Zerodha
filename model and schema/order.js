const mongoose = require('mongoose');

const orderSechma = new mongoose.Schema({
    name: String,
    qty: Number,
    price: Number,
    userId: String,
    mode: String,
})
const Order = mongoose.model('Order', orderSechma)

module.exports = Order;