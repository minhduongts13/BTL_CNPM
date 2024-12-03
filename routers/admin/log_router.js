const express = require('express')
const router = express.Router();

const logController = require("../../controllers/admin/log_controller")

router.get('/', logController.home)

module.exports = router