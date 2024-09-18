import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="flex flex-col lg:flex-row items-center h-full gap-8 lg:gap-24 text-white">
      <img
        src="/orbital.png"
        alt=""
        className="absolute left-0 bottom-0 opacity-5 -z-10"
      />
      <div className="left flex-1 flex flex-col items-center justify-center gap-6 text-center p-6">
        <h1 className="font-semibold text-4xl lg:text-7xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            VISH
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
            {" "}
            AI
          </span>
        </h1>
        <h2 className="text-lg lg:text-2xl text-gray-400">
          Supercharge your creativity and productivity
        </h2>
        <h3 className="font-light lg:max-w-lg max-w-3xl text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur,
          nesciunt cumque omnis eos tenetur dolorum.
        </h3>
        <Link
          to={"/dashboard"}
          className="px-6 py-3 bg-white text-black rounded-md text-sm hover:bg-gray-200 active:bg-gray-300 mt-5"
        >
          Get Started
        </Link>
      </div>

      <div className="right flex-1 flex items-center justify-center h-full">
        <div className="imgContainer flex items-center justify-center rounded-lg w-4/5 h-1/2 relative p-6">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
            <div className="w-full h-full bg-cover bg-center opacity-20 bg-[url('/bg.png')] animate-slideBg"></div>
          </div>
          <img
            src="/bot.png"
            alt=""
            className="w-full h-full object-contain animate-rotateScale"
          />
          <div className="chat absolute -bottom-7 -right-12 lg:flex items-center gap-2 py-2 px-3 bg-gray-900 hidden max-[1280px]:right-0 rounded-full">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "/bot.png"
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <TypeAnimation
              sequence={[
                "Human: We produce food for Mice",
                2000,
                () => setTypingStatus("bot"),
                "Bot: We produce food for Hamsters",
                2000,
                () => setTypingStatus("human2"),
                "Human: We produce food for Guinea Pigs",
                2000,
                () => setTypingStatus("bot"),
                "Bot: We produce food for Chinchillas",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
              className="text-white"
            />
          </div>
        </div>
      </div>

      <div className="terms absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <img src="/logo.png" className="w-4 h-4" alt="" />
        <div className="links flex gap-3 text-gray-400 text-xs">
          <Link to="/">Terms of service</Link>
          <span> | </span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
