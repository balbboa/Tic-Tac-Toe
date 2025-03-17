import React from "react";
import Header from "../components/layout/Header";
import UnlockableContent from "../components/store/UnlockableContent";
import { useAuth } from "../context/AuthContext";

const StorePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <UnlockableContent />
      </div>
    </div>
  );
};

export default StorePage;
