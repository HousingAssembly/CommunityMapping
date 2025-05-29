const express = require('express')
const { createCom } = require('../controllers/comController')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
const router = express.Router()

router.route('/').post(createCom)

module.exports = router