export type RecipeNutritionValue = {
  title: string;
  value: number;
  unit: string;
};

export type RecipeIngredient = {
  group: boolean;
  name: string;
  amount: {
    imperial: {
      amt: number;
      unit: string;
    };
    metric: {
      amt: number;
      unit: string;
    };
  };
  notes: string;
};

export type RecipeIngredientGroup = {
  group: boolean;
  title: string;
  ingredients: RecipeIngredient[];
};

export type RecipeInstruction = {
  instruction: string;
  imageUrl: string;
};

export type RecipeInstructionGroup = {
  name: string;
  instructions: RecipeInstruction[];
};

export type RecipeData = {
  id: number;
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
  ingredients: Array<RecipeIngredient | RecipeIngredientGroup>;
  instructions: Array<RecipeInstruction | RecipeInstructionGroup>;
  tips: Array<{ title: string; tip: string }>;
  nutrition: Array<{ title: string; value: number; unit: string }>;
};
