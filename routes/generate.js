const express = require('express')
const router = express.Router()
const Dish = require('../models/Dish')

// 1. 生成菜单接口，注意路径是 /generate
router.get('/', async (req, res) => {
    const days = parseInt(req.query.days) || 1

    // 按 count 升序并随机打乱同次数组内顺序
    const fetchByType = async (type, need) => {
        const all = await Dish.find({ type }).sort({ count: 1 })
        const groups = all.reduce((acc, d) => {
            (acc[d.count] ||= []).push(d)
            return acc
        }, {})
        const sorted = Object.keys(groups)
            .sort((a, b) => a - b)
            .flatMap(cnt => groups[cnt].sort(() => 0.5 - Math.random()))
        return sorted.slice(0, need)
    }

    const need = { meat: days * 2, vegetable: days * 2, soup: days * 1 }
    const meats = await fetchByType('meat', need.meat)
    const veges = await fetchByType('vegetable', need.vegetable)
    const soups = await fetchByType('soup', need.soup)

    const result = []
    for (let i = 0; i < days; i++) {
        result.push({
            meat: meats.slice(i * 2, i * 2 + 2),
            vegetable: veges.slice(i * 2, i * 2 + 2),
            soup: soups.slice(i, i + 1)
        })
    }

    res.json(result)
})


module.exports = router
