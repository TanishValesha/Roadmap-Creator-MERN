import React from "react";
import { Map, GitBranch, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src="hero-logo.png" alt="Logo" className="w-8" />
            <span className="text-xl font-bold text-gray-900">Mapper</span>
          </div>
          <div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => {
                navigate("/auth");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
