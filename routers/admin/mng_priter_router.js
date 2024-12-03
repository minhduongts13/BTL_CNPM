const express = require('express')
const router = express.Router();

const mngPrinterController = require("../../controllers/admin/mng_printer_controller")

router.get('/', mngPrinterController.home)

module.exports = router