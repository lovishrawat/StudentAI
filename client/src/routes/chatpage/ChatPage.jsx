import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import NewPrompt from "../../components/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import remarkGfm from "remark-gfm";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const [lastSpokenIndex, setLastSpokenIndex] = useState(-1); // State to track the last spoken message
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false); // State to toggle speech
  const [isSpeaking, setIsSpeaking] = useState(false); // State to check if speaking is ongoing

  // Function to convert text to speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';  
      speech.pitch = 1;      
      speech.rate = 1;        
      speech.volume = 1;      
      speech.onstart = () => setIsSpeaking(true);  // Update speaking state
      speech.onend = () => setIsSpeaking(false);   // Reset speaking state
      window.speechSynthesis.speak(speech);
    } else {
      console.log("Text-to-Speech is not supported in this browser.");
    }
  };

  // Function to stop the ongoing speech
  const stopSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop the speech
      setIsSpeaking(false);
    }
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });

  useEffect(() => {
    if (isSpeechEnabled && data?.history && data.history.length > 0) {
      data.history.forEach((message, index) => {
        if (message.role !== "user" && index > lastSpokenIndex) {
          speakText(message.parts[0].text); // Speak only new bot responses
          setLastSpokenIndex(index); // Update the last spoken index
        }
      });
    }
  }, [data, lastSpokenIndex, isSpeechEnabled]); // Depend on lastSpokenIndex and isSpeechEnabled

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader">
          <span className="loader-inner"></span>
        </span>
      </div>
    );
  if (isError) {
    console.log(error.message);
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="chatpage h-full flex flex-col items-center relative p-4">
      <div className="controls flex justify-between w-full mb-4">
        {/* Toggle Button for Enabling/Disabling Speech */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isSpeechEnabled}
            onChange={() => setIsSpeechEnabled(!isSpeechEnabled)}
          />
          <span className="ml-2">Enable Text-to-Speech</span>
        </label>

        {/* Button to Stop Speech */}
        {isSpeaking && (
          <button
            className="stop-speech-btn bg-red-500 text-white p-2 rounded"
            onClick={stopSpeech}
          >
            Stop Speaking
          </button>
        )}
      </div>

      <div className="wrapper flex-1 overflow-y-scroll no-scrollbar w-full flex justify-center">
        <div className="chat w-1/2 flex flex-col gap-5">
          {data?.history && data.history.length > 0 ? (
            data.history.map((message, i) => (
              <React.Fragment key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={`message ${
                    message.role === "user" ? "message user" : "message"
                  }`}
                >
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.parts[0].text}
                  </Markdown>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div>No messages found.</div>
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
