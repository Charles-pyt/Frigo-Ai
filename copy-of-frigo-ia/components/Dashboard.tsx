
import React from 'react';
import type { InventoryItem, Recipe } from '../types';
import { InventoryItemCard } from './InventoryItemCard';
import { RecipeCard } from './RecipeCard';
import { Spinner } from './Spinner';
import { LightbulbIcon, ChefHatIcon, EmptyFridgeIcon } from './IconComponents';

interface DashboardProps {
  inventory: InventoryItem[];
  recipes: Recipe[];
  onRemoveItem: (id: string) => void;
  onGenerateRecipes: () => void;
  isLoadingRecipes: boolean;
  error: string | null;
  onSelectItem: (item: InventoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  inventory,
  recipes,
  onRemoveItem,
  onGenerateRecipes,
  isLoadingRecipes,
  error,
  onSelectItem,
}) => {
  return (
    <div className="space-y-8">
      <div id="frigo">
        <h2 className="text-2xl font-bold mb-4 flex items-center pt-4"><ChefHatIcon className="w-7 h-7 mr-3 text-[#6d9e7d]"/> Mon Frigo</h2>
        {inventory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {inventory.map(item => (
              <InventoryItemCard key={item.id} item={item} onRemove={onRemoveItem} onSelectItem={onSelectItem}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-sm">
            <EmptyFridgeIcon className="w-16 h-16 mx-auto text-gray-400"/>
            <p className="mt-4 text-gray-600">Votre frigo est vide.</p>
            <p className="text-sm text-gray-500">Cliquez sur le '+' pour scanner vos aliments.</p>
          </div>
        )}
      </div>

      <div id="recettes" className="p-6 bg-white/30 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center pt-4"><LightbulbIcon className="w-7 h-7 mr-3 text-[#ff9800]"/> Idées Recettes</h2>
        <div className="flex flex-col items-center">
            <button
            onClick={onGenerateRecipes}
            disabled={isLoadingRecipes || inventory.length === 0}
            className="flex items-center justify-center px-8 py-3 bg-[#6d9e7d] text-white font-semibold rounded-full shadow-lg hover:bg-[#5a8a69] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
            {isLoadingRecipes ? (
                <>
                <Spinner />
                <span className="ml-2">Génération en cours...</span>
                </>
            ) : (
                "Trouver une recette avec mon frigo"
            )}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {recipes.length > 0 && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        )}

        {recipes.length === 0 && !isLoadingRecipes && (
            <div className="text-center py-10 mt-6">
                <p className="text-gray-600">Générez des recettes basées sur le contenu de votre frigo.</p>
                <p className="text-sm text-gray-500">C'est simple, rapide et anti-gaspillage !</p>
            </div>
        )}
      </div>
    </div>
  );
};
