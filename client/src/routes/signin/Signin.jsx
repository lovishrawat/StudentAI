import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <SignIn
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
};

export default Signin;
