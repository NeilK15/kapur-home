import { RecipeData } from "./RecipeTypes";

export type CookbookData = {
    _id: string;
    name: string;
    description: string;
    coverImageUrl: string;
    createdBy: string;
    createdAt: string;
    recipeCount?: number;
};

export type CookbookDetailData = CookbookData & {
    recipes: RecipeData[];
};
