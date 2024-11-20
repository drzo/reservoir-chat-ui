import React from 'react';
import { Brain, Code, Bug, Zap, BookOpen } from 'lucide-react';

export default function WelcomeCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Welcome to ReservoirChat!</h1>
      </div>
      
      <p className="text-gray-600 mb-6 text-center">
        Your expert companion for Reservoir Computing, powered by ReservoirPy - the leading Python library for reservoir computing neural networks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
          <Code className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Implementation Help</h3>
            <p className="text-sm text-gray-600">Get assistance with reservoir computing models</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
          <Bug className="w-5 h-5 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Debugging Support</h3>
            <p className="text-sm text-gray-600">Help with troubleshooting your code</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <Zap className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Performance Tips</h3>
            <p className="text-sm text-gray-600">Optimize your models and workflows</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Learning Resources</h3>
            <p className="text-sm text-gray-600">Access documentation and examples</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 border-t pt-4">
        <p className="mb-2">
          Developed by Inria Bordeaux's Mnemosyne Lab and supported by BrainGPT (Inria) and DeepPool (ANR) projects.
        </p>
        <p className="text-xs">
          ⚠️ Beta version - Please verify critical information and avoid sharing personal data. Usage data analyzed for research purposes.
        </p>
      </div>
    </div>
  );
}