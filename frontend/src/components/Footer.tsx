import React from "react";

export default function Footer() {
  return (
    <footer className="py-14 bg-gray-50 dark:bg-[#0B1220] border-t border-gray-200/50 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-center">

          {/* Brand */}
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Live <span className="text-primary">Roadmap</span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 mt-6 md:mt-0 text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-primary transition">Features</a>
            <a href="#pricing" className="hover:text-primary transition">Pricing</a>
            <a href="#demo" className="hover:text-primary transition">Demo</a>
            <a href="/privacy" className="hover:text-primary transition">Privacy</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          © {new Date().getFullYear()} LiveRoadmap. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
