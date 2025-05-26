const express = require('express')
const router = express.Router()
const Dish = require('../models/Dish')

// 获取所有菜
router.get('/', async (req, res) => {
    const dishes = await Dish.find()
    res.json(dishes)
})

// 添加菜
router.post('/', async (req, res) => {
    const { name, type } = req.body
    const newDish = new Dish({ name, type })
    await newDish.save()
    res.status(201).json(newDish)
})

// 删除菜
router.delete('/:id', async (req, res) => {
    await Dish.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

// 修改菜
router.put('/:id', async (req, res) => {
    const { name, type } = req.body
    const updated = await Dish.findByIdAndUpdate(req.params.id, { name, type }, { new: true })
    res.json(updated)
})
// POST /api/dishes/batch
router.post('/batch', async (req, res) => {
    const dishes = req.body // 期望 [{name, type}, {name, type}, ...]

    if (!Array.isArray(dishes)) {
        return res.status(400).json({ message: '请求体必须是数组' })
    }

    // 简单验证
    for (const dish of dishes) {
        if (
            !dish.name ||
            !dish.type ||
            !['meat', 'vegetable', 'soup'].includes(dish.type)
        ) {
            return res.status(400).json({ message: '存在不合法的菜品数据' })
        }
    }

    try {
        await Dish.insertMany(dishes)
        res.status(200).json({ message: '批量添加成功' })
    } catch (error) {
        console.error('批量添加错误:', error)
        res.status(500).json({ message: '服务器内部错误' })
    }
})

module.exports = router
