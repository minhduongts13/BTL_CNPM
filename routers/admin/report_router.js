const express = require('express')
const router = express.Router();

const reportController = require("../../controllers/admin/report_controller")

router.get('/', reportController.home)

module.exports = router