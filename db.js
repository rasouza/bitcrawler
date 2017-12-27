const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/bitcoin', { useMongoClient: true })

const tradeSchema = mongoose.Schema({

})

module.exports = { Mongoose: mongoose }