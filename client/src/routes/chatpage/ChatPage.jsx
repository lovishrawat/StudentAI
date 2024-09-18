import React from "react";
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
      <div className="wrapper flex-1 overflow-y-scroll no-scrollbar w-full flex justify-center">
        <div className="chat w-1/2 flex flex-col gap-5">
          {data?.history && data.history.length > 0 ? (
            data.history.map((message, i) => (
              <>
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
                  key={i}
                >
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.parts[0].text}
                  </Markdown>
                </div>
              </>
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
