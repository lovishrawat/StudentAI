import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";

const Chatlist = () => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="flex flex-col h-full">
      <span className="font-bold text-xs mb-3">DASHBOARD</span>
      <Link className="p-2 rounded-xl hover:bg-[#2c2937]" to="/dashboard">
        Create a new chat
      </Link>
      <Link className="p-2 rounded-xl hover:bg-[#2c2937]" to="/dashboard">
        Explore
      </Link>
      <Link className="p-2 rounded-xl hover:bg-[#2c2937]" to="/dashboard">
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-slate-100 opacity-10 rounded-md my-5" />
      <span className="font-bold text-xs mb-3">RECENT CHATS</span>
      <div className="list flex flex-col overflow-y-scroll no-scrollbar">
        {isPending
          ? "Loading..."
          : isError
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link
                className="p-2 rounded-xl hover:bg-[#2c2937]"
                key={chat._id}
                to={`/dashboard/chats/${chat._id}`}
              >
                {chat.title}
              </Link>
            ))}
      </div>
      <hr className="border-none h-[2px] bg-slate-100 opacity-10 rounded-md my-5" />
      <div className="upgrade mt-auto flex items-center gap-[10px] text-xs">
        <img src="/logo.png" alt="" className="w-6 h-6" />
        <div className="flex flex-col">
          <span className="font-semibold">Upgrade to Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all the features
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
