import { RecipeData } from "../@customTypes/RecipeTypes";
import { Url } from "url";

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

export async function deleteRecipeById(id: string) {
    const res = await fetch(`http://${process.env.REACT_APP_API_URI}/recipes/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error(`failed to delete recipe with id: ${id}`);
    }

    return;
}

export async function addRecipeByUrl(url: Url): Promise<RecipeData> {
    if (!url) throw new Error(`Failed to add recipe by URL, url ${url} invalid`);
    console.log(url);

    const res = await fetch(`http://${process.env.REACT_APP_API_URI}/recipes/addRecipeByUrl`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "request-url": url }),
        cache: "no-store",
    });

    const recipeData = await res.json();

    console.log(recipeData);

    return recipeData as RecipeData;
}
