import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;
const COMPRESS_TIMEOUT_MS = 10000;

async function compressImage(file: File): Promise<Blob> {
    // createImageBitmap is promise-based and more reliable than new Image() on iOS.
    // toDataURL is synchronous and avoids the silent-hang risk of canvas.toBlob().
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;
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
    if (!ctx) throw new Error("Canvas unavailable");

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    return fetch(dataUrl).then((r) => r.blob());
}

export async function uploadImage(file: File): Promise<string> {
    let blob: Blob;
    let contentType: string;

    try {
        const compressed = await Promise.race([
            compressImage(file),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), COMPRESS_TIMEOUT_MS)
            ),
        ]);
        blob = compressed;
        contentType = "image/jpeg";
    } catch (err) {
        console.warn("Compression failed, uploading original:", err);
        blob = file;
        contentType = file.type || "image/jpeg";
    }

    const res = await fetch(`${import.meta.env.VITE_API_URI}/upload/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ contentType, filename: "image.jpg" }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
    }

    const { uploadUrl, imageUrl } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: blob,
    });

    if (!uploadRes.ok) throw new Error(`S3 upload failed (${uploadRes.status})`);
    return imageUrl;
}
