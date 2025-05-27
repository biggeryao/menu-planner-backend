const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['meat', 'vegetable', 'soup'], required: true },
    count: { type: Number, default: 0 }    // 新增：记录已排次数
})

module.exports = mongoose.model('Dish', dishSchema)
