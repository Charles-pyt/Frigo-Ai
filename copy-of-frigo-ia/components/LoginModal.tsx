
import React, { useState, useEffect } from 'react';
import { LockClosedIcon, XIcon, LightbulbIcon, PlusIcon } from './IconComponents';
import type { UserCredentials } from '../types';
import { Spinner } from './Spinner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: UserCredentials) => Promise<void>;
  onSignUp: (credentials: UserCredentials) => Promise<void>;
}

type Mode = 'login' | 'signup';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSignUp }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMode('login');
      setEmail('');
      setPassword('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await onLogin({ email, password });
      } else {
        await onSignUp({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError(null);
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-sm w-full bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-2xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <XIcon className="w-6 h-6"/>
        </button>

        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#6d9e7d]">
            <LockClosedIcon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="mt-5 text-2xl font-bold text-gray-900 text-center">{mode === 'login' ? 'Connexion' : 'Inscription'}</h3>
        <p className="mt-2 text-gray-600 text-center text-sm">
            {mode === 'login' 
                ? 'Accédez à votre compte pour continuer.' 
                : 'Créez un compte pour profiter des fonctionnalités avancées.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6d9e7d] focus:border-[#6d9e7d] sm:text-sm"
                />
            </div>
             <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6d9e7d] focus:border-[#6d9e7d] sm:text-sm"
                />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#6d9e7d] text-white font-semibold rounded-full shadow-lg hover:bg-[#5a8a69] disabled:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                {isLoading && <Spinner />}
                {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
            {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button onClick={toggleMode} className="font-medium text-[#6d9e7d] hover:underline">
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
            </button>
        </p>
      </div>
    </div>
  );
};
