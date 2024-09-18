import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="h-full flex flex-col items-center">
      <div className="texts flex-1 flex items-center justify-center flex-col w-1/2 gap-12">
        <div className="logo flex items-center gap-5 opacity-20">
          <img src="/logo.png" className="w-16 h-16" alt="" />
          <h1 className="font-semibold text-6xl lg:text-6xl">
            <span className="bg-clip-text   bg-white text-transparent ">
              VISH
            </span>
            <span className="bg-clip-text bg-white text-transparent"> AI</span>
          </h1>
        </div>
        <div className="options w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 p-4">
          <div className="option flex-1 flex flex-col gap-2 font-light text-[14px] p-5 border border-gray-500 rounded-2xl">
            <img
              className="w-10 h-10 object-cover"
              src="/chat.png"
              alt="Create a new chat"
            />
            <span>Create a new chat</span>
          </div>
          <div className="option flex-1 flex flex-col gap-2 font-light text-[14px] p-5 border border-gray-500 rounded-2xl">
            <img
              className="w-10 h-10 object-cover"
              src="/image.png"
              alt="Analyzes Images"
            />
            <span>Analyzes Images</span>
          </div>
          <div className="option flex-1 flex flex-col gap-2 font-light text-[14px] p-5 border border-gray-500 rounded-2xl">
            <img
              className="w-10 h-10 object-cover"
              src="/code.png"
              alt="Help with my code"
            />
            <span>Help with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer mt-auto w-11/12 md:w-2/3 lg:w-1/2 bg-[#2c2937] rounded-full flex px-2 gap-4 mb-2">
        <form
          className="w-full h-full flex items-center justify-between gap-5"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="flex-1 p-3 bg-transparent border-none outline-none text-[#ececec]"
            autoComplete="off"
          />
          <button
            className="bg-[#605e68] rounded-full border-none cursor-pointer p-[10px] flex items-center justify-center"
            type="Sumbit"
          >
            <img src="/arrow.png" className=" w-4 h-4" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
