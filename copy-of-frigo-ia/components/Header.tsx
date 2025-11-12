
import React from 'react';
import { FridgeIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from './IconComponents';

interface HeaderProps {
    isLoggedIn: boolean;
    currentUser: string | null;
    onLoginClick: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, currentUser, onLoginClick, onLogout }) => {
  return (
    <header className="bg-transparent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <FridgeIcon className="w-8 h-8 text-[#6d9e7d]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-3">
              Frigo <span className="text-[#6d9e7d]">IA</span>
            </h1>
        </div>
        <div className="flex items-center space-x-2">
            {isLoggedIn ? (
                <>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-100/70 text-green-900 rounded-full text-sm font-medium">
                        <UserCircleIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline truncate max-w-[150px]">{currentUser}</span>
                    </div>
                     <button 
                        onClick={onLogout}
                        className="p-2 bg-white/50 border border-gray-300/50 text-gray-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Déconnexion"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                    </button>
                </>
            ) : (
                <button 
                    onClick={onLoginClick}
                    className="px-4 py-2 bg-white/50 border border-gray-300/50 text-gray-700 rounded-full text-sm font-semibold hover:bg-white/80 transition-colors"
                >
                    Connexion
                </button>
            )}
        </div>
      </div>
    </header>
  );
};
