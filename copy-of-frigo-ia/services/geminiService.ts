
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const identifyFoodInImage = async (imageFile: File): Promise<string[]> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: "Identifie les aliments dans cette image. Réponds uniquement avec un tableau JSON de chaînes de caractères (string[]), contenant le nom de chaque aliment en français. Par exemple: [\"tomate\", \"concombre\", \"poulet\"]. Ne mets pas la réponse dans un bloc de code markdown." },
                imagePart,
            ],
        },
        config: {
            responseMimeType: "application/json",
        },
    });

    try {
        const resultText = response.text.trim();
        const result = JSON.parse(resultText);
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            return result;
        }
        return [];
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("L'IA n'a pas pu identifier les aliments. Veuillez réessayer avec une autre image.");
    }
};

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
    const prompt = `Génère 3 recettes de cuisine créatives et réalisables en utilisant principalement les ingrédients suivants: ${ingredients.join(', ')}. Tu peux supposer la présence d'ingrédients de base comme l'huile, le sel, le poivre, l'eau.
    Pour chaque recette, fournis le titre, une courte description, le temps de préparation, la liste des ingrédients avec quantités, et les instructions étape par étape.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        prepTime: { type: Type.STRING },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    quantity: { type: Type.STRING },
                                },
                                required: ["name", "quantity"]
                            },
                        },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ["title", "description", "prepTime", "ingredients", "instructions"],
                },
            },
        },
    });

    try {
        const resultText = response.text.trim();
        const recipes = JSON.parse(resultText);
        return recipes as Recipe[];
    } catch (e) {
        console.error("Failed to parse recipes from Gemini response:", response.text);
        throw new Error("L'IA n'a pas pu générer de recettes. Veuillez réessayer.");
    }
};
