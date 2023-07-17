export type RecipeData = {
  id: string;
  name: string;
  prepTime: number;
  prepTimeUnit: string;
  cookTime: number;
  cookTimeUnit: string;
  totalTime: number;
  totalTimeUnit: string;
  course: string;
  cuisine: string;
  keywords: Array<string>;
  servings: number;
  author: string;
  url: string;
  imageUrl: string;
  description: string;
  ingredientGroups: Array<{
    title: string;
    ingredients: Array<{
      name: string;
      amount: {
        amt: string;
        unit: string;
        scale: string;
      };
      notes: string;
    }>;
  }>;
  instructionGroups: Array<{
    title: string;
    instructions: Array<{
      instruction: string;
      imageUrl: string;
    }>;
  }>;
  notes: Array<{
    title: string;
    note: string;
  }>;
  nutrition: Array<{ title: string; value: number; unit: string }>;
};
