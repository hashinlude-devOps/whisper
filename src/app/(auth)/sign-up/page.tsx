import AuthForm from "@/components/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="flex-grow flex items-center justify-center w-full">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-4">
        <AuthForm initialType="signup" />
      </div>
    </div>
  );
};

export default page;
