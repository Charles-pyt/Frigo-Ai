
export interface InventoryItem {
  id: string;
  name: string;
  addDate: Date;
  expirationDate?: Date;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
}

export interface UserCredentials {
  email: string;
  password: any;
}
