const Post = require('../models/Post');
const Notification = require('../models/Notification');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const postData = { content, author: req.user.id };
    
    if (req.file) {
      postData.mediaUrl = req.file.path; // Assuming upload middleware is used
    }

    const post = new Post(postData);
    await post.save();
    
    await post.populate('author', 'name username avatar');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating post' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
                            .populate('author', 'name username avatar')
                            .sort({ createdAt: -1 })
                            .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
                            .populate('author', 'name username avatar')
                            .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user posts' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    // Cleanup comments
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting post' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isLiked = post.likes.includes(req.user.id);
    if (isLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
      
      // Notify author if someone else likes their post
      if (post.author.toString() !== req.user.id) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.user.id,
          type: 'like',
          post: post._id
        });
        await notification.save();
      }
    }

    await post.save();
    res.json({ message: isLiked ? 'Post unliked' : 'Post liked', likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: 'Server error toggling like' });
  }
};
