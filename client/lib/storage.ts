import { authHeaders } from "./api";

export async function uploadImage(file: File): Promise<string> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/upload/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ contentType: file.type, filename: file.name }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
    }
    const { uploadUrl, imageUrl } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    if (!uploadRes.ok) throw new Error(`S3 upload failed (${uploadRes.status})`);
    return imageUrl;
}
