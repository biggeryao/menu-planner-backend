const express = require('express')
const router = express.Router()
const Dish = require('../models/Dish')

router.get('/', async (req, res) => {
    const days = parseInt(req.query.days) || 1
    const all = await Dish.find()

    const meat = all.filter(d => d.type === 'meat')
    const vegetable = all.filter(d => d.type === 'vegetable')
    const soup = all.filter(d => d.type === 'soup')

    const randomSelect = (arr, n) =>
        arr.sort(() => 0.5 - Math.random()).slice(0, n)

    const result = []

    for (let i = 0; i < days; i++) {
        result.push({
            meat: randomSelect(meat, 2),
            vegetable: randomSelect(vegetable, 2),
            soup: randomSelect(soup, 1)
        })
    }

    res.json(result)
})

module.exports = router
