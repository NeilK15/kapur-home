import { authHeaders } from "./api";

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    // Do NOT set Content-Type — browser sets it automatically with the multipart boundary
    const res = await fetch(`${import.meta.env.VITE_API_URI}/upload/image`, {
        method: "POST",
        headers: { ...(await authHeaders()) },
        body: formData,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
    }

    const { imageUrl } = await res.json();
    return imageUrl;
}
