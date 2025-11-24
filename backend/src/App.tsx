import React from "react";
import Landing from "./pages/Landing";
import RoadmapPage from "./pages/RoadmapPage";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  // 👇 Default for visitors
  if (!user) return <Landing />;

  // 👇 After login
  return (
    <div className="min-h-screen bg-gray-100">
      <RoadmapPage />
    </div>
  );
}
