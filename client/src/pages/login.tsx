import React from "react";
import LoginForm from "../components/loginForm";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
