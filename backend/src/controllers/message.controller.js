import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    return res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in getAllContacts controller ::", err.message);
  }
};

export const getMessagesByUserId = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { receiverId, senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in the getMessagesByUserId controller ::", err.message);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    
    if (!text || !image)
      return res.status(400).json({ message: "Text or image is required!" });

    let imageUrl = "";
    if (image) {
      imageUrl = await cloudinary.uploader.upload(image).secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    return res.status(200).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller ::", err.message);
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartnerIds = [
      ...new Set(
        messages
          .map((msg) => {
            const senderId = msg.senderId.toString();
            const receiverId = msg.receiverId.toString();
            const userId = loggedInUserId.toString();

            if (senderId === userId) {
              return receiverId;
            }
            if (receiverId === userId) {
              return senderId;
            }
            // If the user is neither sender nor receiver, return null
            return null;
          })
          .filter((id) => id !== null)
      ),
    ];
    chatPartners.push(loggedInUserId.toString()); // to yourself
    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    return res.status(200).json(chatPartners);
  } catch (err) {
    console.log("Error in the getChatPartner controller ::", err.message);
  }
};
