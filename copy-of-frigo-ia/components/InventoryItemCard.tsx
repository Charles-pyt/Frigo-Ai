
import React from 'react';
import type { InventoryItem } from '../types';
import { XIcon } from './IconComponents';

interface InventoryItemCardProps {
  item: InventoryItem;
  onRemove: (id: string) => void;
  onSelectItem: (item: InventoryItem) => void;
}

const freshnessInfo = (item: InventoryItem): { text: string, color: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (item.expirationDate) {
        const expDate = new Date(item.expirationDate);
        expDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

        if (diffDays < 0) return { text: `Expiré (${Math.abs(diffDays)}j)`, color: "bg-red-200 text-red-900" };
        if (diffDays === 0) return { text: "Expire ajd", color: "bg-red-100 text-red-800 font-bold" };
        if (diffDays <= 3) return { text: `J-${diffDays}`, color: "bg-orange-100 text-orange-800" };
        return { text: `J-${diffDays}`, color: "bg-green-100 text-green-800" };
    }
    
    // Fallback to addDate if no expiration date
    const addDate = new Date(item.addDate);
    const diffDaysAdded = Math.floor((now.getTime() - addDate.getTime()) / (1000 * 3600 * 24));

    if (diffDaysAdded < 3) return { text: "Frais", color: "bg-green-100 text-green-800" };
    if (diffDaysAdded < 7) return { text: "À consommer", color: "bg-orange-100 text-orange-800" };
    return { text: "Urgent", color: "bg-red-100 text-red-800" };
};

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onRemove, onSelectItem }) => {
  const { text, color } = freshnessInfo(item);

  const expirationString = item.expirationDate
    ? new Date(item.expirationDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    : null;
    
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(item.id);
  }

  return (
    <div 
        className="relative p-3 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/50 shadow-md text-center group transition-transform transform hover:-translate-y-1 flex flex-col justify-between h-full cursor-pointer"
        onClick={() => onSelectItem(item)}
    >
        <div>
            <p className="font-semibold text-gray-800 truncate capitalize">{item.name}</p>
            {expirationString && <p className="text-xs text-gray-500">Exp: {expirationString}</p>}
        </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${color}`}>
        {text}
      </span>
      <button
        onClick={handleRemoveClick}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110 z-10"
        aria-label={`Retirer ${item.name}`}
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
