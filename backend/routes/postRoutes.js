const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('media'), postController.createPost);
router.get('/', auth, postController.getFeed);
router.get('/user/:userId', auth, postController.getUserPosts);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.toggleLike);

module.exports = router;
