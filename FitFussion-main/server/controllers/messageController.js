import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation Check
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing required form data." });
    }

    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Database save crash error:", error.message);
    res.status(500).json({ success: false, message: "Internal server fault." });
  }
};