const express = require('express')
const dotenv = require("dotenv")
const connectDB = require('./config/databaseconfig')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())


const port = 8000
const server= app.listen(port, console.log(`Server running on port ${port}`))

