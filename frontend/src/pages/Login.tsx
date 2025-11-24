// src/pages/Login.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await login(name.trim());
    if (res.success) {
      window.location.href = "/"; // redirect to roadmap
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome</h2>

        <label className="block text-sm mb-2">Enter your name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="e.g. Mridul"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
