const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
    name: String,
    price: Number,
    percent: String,
    isDown: Boolean,
})

const watchData = new mongoose.model('watchData', watchlistSchema)

module.exports = watchData;