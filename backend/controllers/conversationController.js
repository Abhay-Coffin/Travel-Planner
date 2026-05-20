import Conversation from "../models/Conversation.js";

// Create conversation
export const createConversation = async (req, res) => {
  try {
    const { title, messages } = req.body;

    const conversation = new Conversation({
      userId: req.user._id,
      title: title || "Travel Planning Chat",
      messages: messages || [],
    });

    const savedConversation = await conversation.save();

    res.status(201).json({
      success: true,
      data: savedConversation,
    });
  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

// Get user conversations
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// Update conversation
export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { messages, title } = req.body;

    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        messages,
        title,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedConversation,
    });
  } catch (error) {
    console.error("UPDATE CONVERSATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update conversation",
    });
  }
};

// Delete conversation
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    await Conversation.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (error) {
    console.error("DELETE CONVERSATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};