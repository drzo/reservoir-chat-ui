import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export default function ChatMessage({ isBot, message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? 'bg-gray-50' : 'bg-white'} p-4 rounded-lg`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-indigo-600' : 'bg-purple-600'
      }`}>
        {isBot ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}