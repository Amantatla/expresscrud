const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/practice")

const userschema = mongoose.Schema({
    name: String,
    email: String,
    phone: String
})

module.exports = mongoose.model("user", userschema);