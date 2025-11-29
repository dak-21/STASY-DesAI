import React from 'react';
import { Shield, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg shadow-sm bg-white/0">
            <img src="/logo.svg" alt="STASY logo" className="w-8 h-8" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-gray-900">
            STASY
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <a href="#how-it-works" className="hover:text-brand-dark transition-colors">How It Works</a>
          <a href="#technology" className="hover:text-brand-dark transition-colors">Technology</a>
          <a href="#demo" className="hover:text-brand-dark transition-colors">Live Simulation</a>
          <a href="#use-cases" className="hover:text-brand-dark transition-colors">Use Cases</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#demo" className="hidden md:block px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
            Request Demo
          </a>
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};