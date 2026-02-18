
import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { ADMIN_PASSWORD } from '../constants';

interface SecurityModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onConfirm, onClose }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onConfirm();
      setPassword('');
    } else {
      alert('Invalid Security Key!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brightx-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <h2 className="text-2xl font-black text-brightx-navy mb-2">High-Security Action</h2>
          <p className="text-gray-400 font-medium mb-8">This action requires the Admin Security Key to proceed. All actions are logged in the system audit.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Security Key..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all font-mono text-lg"
            />
            <button 
              type="submit"
              className="w-full bg-brightx-navy text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Authorize Action
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
