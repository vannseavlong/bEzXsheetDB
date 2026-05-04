import React from 'react';
import { Smartphone } from 'lucide-react';

export const UnsupportedBrowser: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] px-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <Smartphone size={48} className="text-red-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsupported Environment</h1>
    </div>
  );
};
