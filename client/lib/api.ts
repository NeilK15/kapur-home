import { RecipeData } from "../@customTypes/RecipeTypes";
import { CookbookData, CookbookDetailData } from "../@customTypes/CookbookTypes";
import { fetchAuthSession } from "aws-amplify/auth";

async function authHeaders(): Promise<HeadersInit> {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Recipes ────────────────────────────────────────────────────────────────

export async function getRecipes(filter: any, limit: number, cookbookId?: string): Promise<RecipeData[]> {
    const params = new URLSearchParams({ filter, limit: String(limit) });
    if (cookbookId) params.set("cookbookId", cookbookId);

    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes?${params}`, {
        cache: "no-cache",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error(`failed to fetch recipes`);
    return res.json();
}

export async function getRecipeById(id: string): Promise<RecipeData> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes/${id}`, {
        cache: "no-cache",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error(`failed to fetch recipe data with id: ${id}`);
    return res.json();
}

export async function deleteRecipeById(id: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error(`failed to delete recipe with id: ${id}`);
}

export async function updateRecipeById(id: string, recipe: RecipeData): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ method: "manual", recipe }),
        cache: "no-store",
    });

    if (!res.ok) throw new Error(`failed to update recipe with id: ${id}`);
}

export async function createRecipeManually(recipe: Omit<RecipeData, "_id">): Promise<string> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ method: "manual", recipe }),
        cache: "no-store",
    });

    if (!res.ok) throw new Error("failed to create recipe");
    return res.json();
}

export async function addRecipeByUrl(url: string, cookbookId?: string): Promise<string> {
    if (!url) throw new Error(`Failed to add recipe by URL, url ${url} invalid`);

    const res = await fetch(`${import.meta.env.VITE_API_URI}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ url, method: "url", cookbookId }),
        cache: "no-store",
    });

    return res.json();
}

// ─── Cookbooks ───────────────────────────────────────────────────────────────

export async function getCookbooks(): Promise<CookbookData[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/cookbooks`, {
        cache: "no-cache",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error("failed to fetch cookbooks");
    return res.json();
}

export async function getCookbookById(id: string): Promise<CookbookDetailData> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/cookbooks/${id}`, {
        cache: "no-cache",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error(`failed to fetch cookbook with id: ${id}`);
    return res.json();
}

export async function createCookbook(data: { name: string; description: string }): Promise<CookbookData> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/cookbooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify(data),
        cache: "no-store",
    });

    if (!res.ok) throw new Error("failed to create cookbook");
    return res.json();
}

export async function deleteCookbookById(id: string): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/cookbooks/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
    });

    if (!res.ok) throw new Error(`failed to delete cookbook with id: ${id}`);
}
