//framework for builfing server-side apps that use Node.js. (backend runtime env)
const express = require('express')
//module that loads enviroment variables from a .env (contians private info instead of here)
const dotenv = require("dotenv")
//stands for cross-origin resource sharing that controls which websites (origins) are allowed to make requests to your server
const cors  = require('cors');
//connect to our database
const connectDB = require('../config/databaseconfig')
//our routes
const adminAuth = require("../routes/adminAuth");
const communityRoute = require("../routes/communityRoute");
const issueRoutes = require("../routes/issueRoutes");

//reads the .env file
dotenv.config()

//connects to db
connectDB()

//express applicaiton object
const app = express()

//adds security
app.use(cors({
  origin: ['https://housingassemblymap.vercel.app', "http://localhost:5173"],
  credentials: true
}));

//express middleware that allows the server to parse incoming requests with JSON payloads
//middleware are functions that intercept HTTP requests and responses
app.use(express.json())

//basic test route to see if API runs
app.get('/', (req, res) =>{
    res.send("API running")
})

//connects to routes to be prefixed when calling
app.use('/admin', adminAuth)
app.use('/addcom', communityRoute)
app.use('/addissue', issueRoutes)

// starts sevrer on port and confirms
// const port = 8000
// const server= app.listen(port, console.log(`Server running on port ${port}`))

module.exports = app