// @middlewares/upload.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
module.exports = upload;

// route에서
router.post('/users/avatar', upload.single('avatar'), userController.uploadAvatar);