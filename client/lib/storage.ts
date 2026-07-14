import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;

async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width >= height) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) { reject(new Error("Canvas unavailable")); return; }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
                "image/jpeg",
                JPEG_QUALITY
            );
        };

        img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Failed to read image")); };
        img.src = objectUrl;
    });
}

export async function uploadImage(file: File): Promise<string> {
    const compressed = await compressImage(file);

    const res = await fetch(`${import.meta.env.VITE_API_URI}/upload/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ contentType: "image/jpeg", filename: "image.jpg" }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
    }
    const { uploadUrl, imageUrl } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: compressed,
    });

    if (!uploadRes.ok) throw new Error(`S3 upload failed (${uploadRes.status})`);
    return imageUrl;
}
