import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, signup, loginWithGoogle, isLoading, error, isAuthenticated } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state or default to home
  const from = location.state?.from || "/";

  // If already authenticated, redirect to the return URL
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password);
    // No need to navigate here, the useEffect will handle it
  };

  const handleSignup = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    await signup(data.username, data.email, data.password);
    // No need to navigate here, the useEffect will handle it
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // No need to navigate here, the useEffect will handle it
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Movie Tic-Tac-Toe
          </h1>
          <p className="text-lg text-gray-600">
            The ultimate movie-themed tic-tac-toe experience
          </p>
        </div>
        <AuthForm
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGoogleLogin={handleGoogleLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default LoginPage;
