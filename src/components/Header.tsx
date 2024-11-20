import React from 'react';
import { Brain, Github, BookOpen, MessageSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <span className="font-bold text-xl">ReservoirChat</span>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="https://reservoirpy.readthedocs.io/" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Docs</span>
            </a>
            <a href="https://github.com/reservoirpy/reservoirpy" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}