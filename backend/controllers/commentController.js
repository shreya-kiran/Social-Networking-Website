const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = new Comment({
      text,
      author: req.user.id,
      post: postId
    });

    await comment.save();
    await comment.populate('author', 'name username avatar');

    if (post.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        post: postId
      });
      await notification.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating comment' });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
                                  .populate('author', 'name username avatar')
                                  .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching comments' });
  }
};
