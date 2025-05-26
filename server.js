require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// 路由
const dishRoutes = require('./routes/dishes')
const generateRoutes = require('./routes/generate')

app.use('/api/dishes', dishRoutes)
app.use('/api/generate', generateRoutes)
app.use('/api/batch', dishRoutes)

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`))
    })
    .catch(err => console.error('❌ MongoDB connection error:', err))
