const express = require('express')
require('dotenv').config()
const cors = require('cors')
const router = require('./routes/index')

const PORT = process.env.PORT || 7070
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

const start = async () => {
    try {
        app.listen(PORT, () => console.log('Server is running on port: ', PORT))
    } catch (e) {
        console.log(e)
    }
}

start()
