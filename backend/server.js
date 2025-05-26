const express = require('express')
const dotenv = require("dotenv")
const cors    = require('cors');
const connectDB = require('./config/databaseconfig')
const adminAuth = require("./routes/adminAuth");

dotenv.config()
connectDB()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json())

app.get('/', (req, res) =>{
    res.send("API running")
})

app.use('/admin', adminAuth)


const port = 8000
const server= app.listen(port, console.log(`Server running on port ${port}`))