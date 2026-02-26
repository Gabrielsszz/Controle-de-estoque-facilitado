const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/stock.controller');

router.post('/entry', auth, controller.entry);
router.post('/exit', auth, controller.exit);

module.exports = router;