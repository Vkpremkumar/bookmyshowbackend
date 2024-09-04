const express = require('express');
const router = express.Router();
const stateController = require('../controllers/statecontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken')


router.post('/addState', verifyTokenAndAdmin, stateController.addState);
router.get('/getAllState', stateController.getAllState);

module.exports = router;