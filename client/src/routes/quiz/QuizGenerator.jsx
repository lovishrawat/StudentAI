import React, { useState } from "react";
import QuizGenerator from "./QuizGenerator";

const chatbotStyles = {
  container: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    backgroundColor: "#333",
    color: "#ffffff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    marginRight: "10px",
    fontSize: "16px",
    width: "calc(100% - 20px)",
    marginTop: "10px",
  },
  messages: {
    marginBottom: "20px",
  },
  message: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
  },
  userMessage: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
  },
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleUserInput = (input) => {
    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);

    if (input.toLowerCase().includes("quiz me on")) {
      setShowQuiz(true);
    } else {
      // Process other intents and add bot response
      // This is a placeholder for your chatbot logic
      const botResponse =
        "I'm sorry, I can only start quizzes at the moment. Try saying 'Quiz me on [topic]'.";
      setMessages([...newMessages, { text: botResponse, user: false }]);
    }

    setInputText("");
  };

  return (
    <div style={chatbotStyles.container}>
      {showQuiz ? (
        <QuizGenerator />
      ) : (
        <div>
          <div style={chatbotStyles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...chatbotStyles.message,
                  ...(message.user
                    ? chatbotStyles.userMessage
                    : chatbotStyles.botMessage),
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <input
            style={chatbotStyles.input}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleUserInput(inputText);
              }
            }}
            placeholder="Type your message..."
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
