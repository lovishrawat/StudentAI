import React, { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const endRef = useRef(null);
  const formRef = useRef(null);

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: data?.history.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    })),
    generationConfig: {
      // maxOutputTokens: 1000,
    },
  });

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const addMessage = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
    setAnswer(""); // Clear the previous answer stored in the state
    try {
      let accumulatedText = "";
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );

      // Stream each chunk as it arrives
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        // Update the answer state progressively
        setAnswer((prev) => prev + chunkText);
      }

      mutation.mutate();
    } catch (error) {
      console.log(error);
      setAnswer("Oops! Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    addMessage(text, false);
    e.target.text.value = "";
  };
  //In Production we don't need it because it loads our page one time only but now it will run twice and useEffect will run twice so we use hasRun.
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        addMessage(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.isLoading && <div className="text-white">Loading image...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
          className="mx-auto my-4 rounded-lg"
        />
      )}
      {question && (
        <div className="message user animate-slideIn">{question}</div>
      )}

      {answer && (
        <div className="message ai animate-slideIn">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endChat pb-24" ref={endRef}></div>
      <form
        className="newForm w-11/12 md:w-2/3 lg:w-1/2 mx-auto bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2c2937] rounded-full flex items-center gap-4  px-2 shadow-lg absolute"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Upload setImg={setImg} />
        <input type="file" multiple={false} id="file" hidden />
        <input
          className="flex-1 p-3 border-none outline-none bg-transparent text-[#ececec] placeholder-gray-500"
          name="text"
          type="text"
          placeholder="Ask me anything..."
          autoComplete="off"
        />
        <button
          className="rounded-full bg-[#605e68] p-[10px] flex items-center justify-center cursor-pointer hover:bg-[#4f4c56] transition-all duration-200"
          type="submit"
        >
          <img src="/arrow.png" className="w-4 h-4" alt="Send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
