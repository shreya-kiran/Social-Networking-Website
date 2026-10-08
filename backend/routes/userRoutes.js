const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', auth, userController.searchUsers);
router.get('/:username', auth, userController.getUserProfile);
router.put('/me', auth, upload.single('avatar'), userController.updateProfile);
router.post('/:id/follow', auth, userController.toggleFollow);
router.delete('/me', auth, userController.deleteAccount);

module.exports = router;
