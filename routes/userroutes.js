const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.put('/update/:id', userController.updateUser);
router.get('/getById/:id', userController.getUserById);
router.delete('/delete/:id', userController.deleteUser);
router.get('/getAllUsers', userController.getAllUsers);


module.exports = router;