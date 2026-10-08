// Import the Mongoose Message model to perform queries on the 'messages' collection
const Message = require('../models/Message');
// CONTROLLER: Get Chat History
// Fetches conversation history between the logged-in user and another specified user (GET /api/messages/:userId)
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
