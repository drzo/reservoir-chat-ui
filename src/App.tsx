import React, { useState } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeCard from './components/WelcomeCard';
import ReservoirDemo from './components/ReservoirDemo';
import { Brain, Play } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  const handleSendMessage = (text: string) => {
    if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('show example')) {
      setShowDemo(true);
    }
    
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text, isBot: false },
      { 
        id: Date.now() + 1, 
        text: text.toLowerCase().includes('demo') 
          ? "I've loaded the ReservoirPy demo interface below. You can experiment with different parameters and see how they affect the Echo State Network's performance."
          : "I'm currently in development. Please visit https://chat.reservoirpy.inria.fr/ to use the actual chat interface.", 
        isBot: true 
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <WelcomeCard />
            <div className="flex justify-center">
              <button
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Launch Interactive Demo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                isBot={message.isBot}
                message={message.text}
              />
            ))}
          </div>
        )}
        
        {showDemo && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Interactive Reservoir Computing Demo</h2>
              </div>
            </div>
            <ReservoirDemo />
          </div>
        )}
      </main>

      <div className="sticky bottom-0">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;