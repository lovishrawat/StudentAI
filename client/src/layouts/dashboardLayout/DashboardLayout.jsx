import { useAuth } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Chatlist from "../../components/Chatlist";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, navigate, userId]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        {" "}
        <span className="loader">
          <span className="loader-inner"></span>
        </span>{" "}
      </div>
    );
  }

  return (
    <div className="flex gap-12 pt-5 h-full">
      <div className="menu flex-1">
        <Chatlist />
      </div>
      <div className="content flex-[4] bg-[#12101b]">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
