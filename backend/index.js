import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import model from "./gemini.js";
// import 'dotenv/config'; // Load environment variables from .env

const port = process.env.PORT || 4000;
const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to MONGODB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

// Initialize ImageKit
const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY,
});

// Route to get ImageKit authentication parameters
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Route to create a new chat
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });

    if (userChats.length === 0) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    res.status(201).send(newChat._id);
  } catch (err) {
    console.log("Error creating chat:", err);
    res.status(500).send("Error creating chat!");
  }
});

// Route to fetch user's chats
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });

    if (userChats.length > 0) {
      res.status(200).send(userChats[0].chats);
    } else {
      res.status(404).send("No chats found for this user.");
    }
  } catch (err) {
    console.log("Error fetching user chats:", err);
    res.status(500).send("Error fetching user chats!");
  }
});

// Route to fetch a specific chat by ID
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log("Error fetching chat:", err);
    res.status(500).send("Error fetching chat!");
  }
});

// Route to update a chat with new conversation
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log("Error updating chat:", err);
    res.status(500).send("Error adding conversations!");
  }
});

// Route to generate quiz questions
app.get('/api/quiz/generate', async (req, res) => {
  const { topic, numQuestions } = req.query;

  if (!topic || !numQuestions) {
    return res.status(400).json({ error: 'Topic and number of questions are required.' });
  }

  try {
    console.log("Hello Lovish")
    const prompt = `Generate a quiz about ${topic} with ${numQuestions} questions. Each question should have a correct answer. Format the output as a JSON array of objects, where each object has a "question" field and an "answer" field.`;

    const result = await model.generateContent(prompt);  // Using the gemini model
    const response = await result.response;
    const generatedQuiz = JSON.parse(response.text());  // Parsing response text to JSON

    res.json(generatedQuiz);  // Send quiz questions as response
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions.' });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Internal server error!");
});

// Start the server and connect to MongoDB
app.listen(port, () => {
  connect();
  console.log(`Server running on port ${port}`);
});
