const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['meat', 'vegetable', 'soup'], required: true }
})

module.exports = mongoose.model('Dish', dishSchema)
