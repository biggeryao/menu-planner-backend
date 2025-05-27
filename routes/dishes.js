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

// —— 把批量删除放到这里 ——
// DELETE /api/dishes/batch
router.delete('/batch', async (req, res) => {
    const { ids } = req.body
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: '请提供要删除的菜品 ID 数组' })
    }
    try {
        const result = await Dish.deleteMany({ _id: { $in: ids } })
        return res.status(200).json({
            message: '批量删除成功',
            deletedCount: result.deletedCount
        })
    } catch (err) {
        console.error('批量删除错误：', err)
        return res.status(500).json({ message: '服务器内部错误，批量删除失败' })
    }
})

// 删除菜（单个）
router.delete('/:id', async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (err) {
        console.error('删除错误：', err)
        res.status(500).json({ message: '删除失败' })
    }
})

// 修改菜
router.put('/:id', async (req, res) => {
    const { name, type } = req.body
    const updated = await Dish.findByIdAndUpdate(
        req.params.id,
        { name, type },
        { new: true }
    )
    res.json(updated)
})

// 批量添加接口保持不变
router.post('/batch', async (req, res) => {
    const dishes = req.body.dishes
    const force = req.body.force || false

    if (!Array.isArray(dishes)) {
        return res.status(400).json({ message: '请求体必须是数组' })
    }

    // 验证
    for (const dish of dishes) {
        if (!dish.name || !dish.type || !['meat', 'vegetable', 'soup'].includes(dish.type)) {
            return res.status(400).json({ message: '存在不合法的菜品数据' })
        }
    }

    const names = dishes.map(d => d.name)
    const existing = await Dish.find({ name: { $in: names } }).select('name -_id')

    const existingNames = existing.map(d => d.name)
    const newDishes = dishes.filter(d => !existingNames.includes(d.name))

    if (!force && existingNames.length > 0) {
        return res.status(200).json({
            message: '存在重复',
            existing: existingNames,
            toAdd: newDishes
        })
    }

    try {
        if (newDishes.length > 0) {
            await Dish.insertMany(newDishes)
        }
        res.status(200).json({ message: '添加成功', added: newDishes.length })
    } catch (err) {
        console.error('添加失败:', err)
        res.status(500).json({ message: '服务器错误' })
    }
})
// 确认接口：编辑后统计 count
router.post('/confirm', async (req, res) => {
    const { ids } = req.body
    if (!Array.isArray(ids)) return res.status(400).end()
    await Dish.updateMany({ _id: { $in: ids } }, { $inc: { count: 1 } })
    res.json({ message: '统计次数更新成功' })
})
module.exports = router
