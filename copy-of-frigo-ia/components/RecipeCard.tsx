
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ChevronDownIcon } from './IconComponents';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-xl text-gray-900">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                <p className="text-xs text-[#6d9e7d] font-semibold mt-2">{recipe.prepTime}</p>
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-2 border-t border-white/60">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-800">Ingrédients</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="font-medium">{ing.name}:</span> {ing.quantity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Instructions</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
