import { SignUp } from "@clerk/clerk-react";
import React from "react";

const Signup = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignUp path="/sign-up" />
    </div>
  );
};

export default Signup;
