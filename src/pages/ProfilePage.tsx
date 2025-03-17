import React from "react";
import Header from "../components/layout/Header";
import UserProfile from "../components/profile/UserProfile";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <UserProfile
          username={user?.name}
          email={user?.email}
          avatarUrl={user?.avatarUrl}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
