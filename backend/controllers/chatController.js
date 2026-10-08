const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};
