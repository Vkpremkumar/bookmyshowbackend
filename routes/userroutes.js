const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.put('/update/:id', verifyTokenAndAdmin, userController.updateUser);
router.get('/getById/:id', verifyTokenAndAdmin, userController.getUserById);
router.delete('/delete/:id', verifyTokenAndAdmin, userController.deleteUser);
router.get('/getAllUsers', verifyTokenAndAdmin, userController.getAllUsers);


module.exports = router;