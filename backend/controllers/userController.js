const User = require('../models/User');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
                           .select('-password')
                           .populate('followers', 'name username avatar')
                           .populate('following', 'name username avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    
    if (req.file) {
      updateData.avatar = req.file.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      
      // Create notification
      const notification = new Notification({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow'
      });
      await notification.save();
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully', isFollowing: !isFollowing });
  } catch (error) {
    res.status(500).json({ error: 'Server error toggling follow' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).select('name username avatar').limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error searching users' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all posts
    await Post.deleteMany({ author: userId });
    
    // Remove user references from followers/following (simplified cleanup)
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting account' });
  }
};
