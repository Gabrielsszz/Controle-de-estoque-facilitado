const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/medicines.controller');

router.post('/', auth, controller.createMedicine);
router.get('/', auth, controller.getMedicines);
router.delete('/:id', auth, controller.deleteMedicine);

module.exports = router;