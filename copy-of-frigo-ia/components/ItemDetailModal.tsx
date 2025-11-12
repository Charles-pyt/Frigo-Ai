
import React from 'react';
import type { InventoryItem, Recipe } from '../types';
import { XIcon, ChefHatIcon } from './IconComponents';
import { RecipeCard } from './RecipeCard';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  recipes: Recipe[];
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, recipes, onClose }) => {
  if (!item) return null;

  const associatedRecipes = recipes.filter(recipe => 
    recipe.ingredients.some(ingredient => 
      ingredient.name.toLowerCase().includes(item.name.toLowerCase())
    )
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full bg-white/60 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <XIcon className="w-6 h-6"/>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 capitalize mb-4 text-[#6d9e7d]">{item.name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-white/50 p-3 rounded-lg">
                <p className="font-semibold text-gray-700">Date d'ajout</p>
                <p className="text-gray-600">{formatDate(item.addDate)}</p>
            </div>
            <div className={`p-3 rounded-lg ${item.expirationDate ? 'bg-white/50' : 'bg-gray-100/50'}`}>
                <p className="font-semibold text-gray-700">Date de péremption</p>
                <p className={item.expirationDate ? "text-gray-600" : "text-gray-400"}>
                    {item.expirationDate ? formatDate(item.expirationDate) : 'Non spécifiée'}
                </p>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ChefHatIcon className="w-6 h-6 mr-2 text-[#6d9e7d]"/>
                Recettes Associées
            </h3>
            {associatedRecipes.length > 0 ? (
                <div className="space-y-4">
                    {associatedRecipes.map((recipe, index) => (
                        <RecipeCard key={index} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 px-4 bg-white/30 rounded-lg">
                    <p className="text-gray-600">Aucune recette générée ne contient cet aliment pour le moment.</p>
                    <p className="text-sm text-gray-500 mt-1">Générez des idées recettes depuis le dashboard !</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
