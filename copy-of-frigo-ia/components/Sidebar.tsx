
import React from 'react';
import { Squares2X2Icon, ChefHatIcon, LightbulbIcon } from './IconComponents';

interface SidebarProps {
  onNavigate: (sectionId: string) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  sectionId: string;
  onClick: (sectionId: string) => void;
}> = ({ icon, label, sectionId, onClick }) => (
  <li>
    <button
      onClick={() => onClick(sectionId)}
      className="flex flex-col items-center justify-center w-full p-3 text-gray-500 rounded-lg hover:bg-white/50 hover:text-[#6d9e7d] transition-colors group"
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-20 bg-white/30 backdrop-blur-xl border-r border-white/40 z-30 flex flex-col items-center py-8">
      <nav className="w-full">
        <ul className="space-y-4 px-2">
           <NavItem 
                icon={<Squares2X2Icon className="w-6 h-6" />}
                label="Dashboard"
                sectionId="root"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          <NavItem 
            icon={<ChefHatIcon className="w-6 h-6" />}
            label="Mon Frigo"
            sectionId="frigo"
            onClick={onNavigate}
          />
          <NavItem 
            icon={<LightbulbIcon className="w-6 h-6" />}
            label="Recettes"
            sectionId="recettes"
            onClick={onNavigate}
          />
        </ul>
      </nav>
    </aside>
  );
};
