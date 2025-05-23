const express = require('express')
const { authUser, registerUser } = require("../controllers/authController")

const router = express.Router()

router.route('/').post(registerUser)
router.post('/login', authUser)


module.exports = router