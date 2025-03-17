import React, { createContext, useContext, useState, useEffect } from "react";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        connectSocket(parsedUser.id);
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    // Cleanup socket connection on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
      const mockUser = {
        id: userId,
        name: email.split("@")[0],
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      connectSocket(userId);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful Google login
      const userId = `google_${Math.random().toString(36).substring(2, 9)}`;
      const randomName = ["MovieFan", "FilmBuff", "CinemaLover"][
        Math.floor(Math.random() * 3)
      ];
      const mockUser = {
        id: userId,
        name: `${randomName}${Math.floor(Math.random() * 1000)}`,
        email: `${randomName.toLowerCase()}@gmail.com`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      connectSocket(userId);
    } catch (err) {
      setError("Failed to login with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful signup
      const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
      const mockUser = {
        id: userId,
        name: username,
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      connectSocket(userId);
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    disconnectSocket();

    // Redirect to login page after logout
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
