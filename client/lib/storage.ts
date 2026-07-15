import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;
const COMPRESS_THRESHOLD_BYTES = 4 * 1024 * 1024; // 4 MB

// HEIC/HEIF can't be decoded by canvas on iOS — send those straight to the server.
// JPEG, PNG, WebP load fine in a canvas on iOS Safari.
const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function compressForUpload(file: File): Promise<Blob> {
    if (file.size <= COMPRESS_THRESHOLD_BYTES || !CANVAS_SUPPORTED_TYPES.has(file.type)) {
        return file;
    }

    return new Promise((resolve) => {
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
            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // toDataURL is synchronous — avoids the silent-hang risk of toBlob on iOS
            const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
            fetch(dataUrl)
                .then((r) => r.blob())
                .then(resolve)
                .catch(() => resolve(file));
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };

        img.src = objectUrl;
    });
}

export async function uploadImage(file: File): Promise<string> {
    const blob = await compressForUpload(file);

    const formData = new FormData();
    formData.append("image", blob, "image.jpg");

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
