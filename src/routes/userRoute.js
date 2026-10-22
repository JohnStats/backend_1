const express = require('express');
const router = express.Router();
const userController = require('@controllers/userController');
const auth = require('@middlewares/authMiddleware');
const upload = require('@middlewares/uploadMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', auth, userController.me);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.get('/', userController.list)

module.exports = router;