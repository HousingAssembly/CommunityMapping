const express = require('express')
const { createCom, allComs } = require('../controllers/comController')

const router = express.Router()

router.route('/').post(createCom)
router.get('/fetch', allComs)

module.exports = router