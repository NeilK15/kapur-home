import { RecipeData } from "../@customTypes/RecipeTypes";

export async function getRecipes(filter: any, limit: number): Promise<RecipeData[]> {
    const res = await fetch(`http://${process.env.REACT_APP_API_URI}/recipes?filter=${filter}&limit=${limit}`, {
        cache: "no-cache",
    });

    if (!res.ok) {
        throw new Error(`failed to fetch recipes`);
    }

    const rawData = await res.json();

    return new Promise((resolve) => {
        resolve(rawData as RecipeData[]);
    });
}

export async function getRecipeById(id: string): Promise<RecipeData> {
    const res = await fetch(`http://${process.env.REACT_APP_API_URI}/recipes/${id}`, { cache: "no-cache" });

    if (!res.ok) {
        throw new Error(`failed to fetch recipe data with id: ${id}`);
    }

    const rawData = await res.json();

    return new Promise((resolve) => {
        resolve(rawData as RecipeData);
    });
}
