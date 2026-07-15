import loadImage from "blueimp-load-image";
import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;

// HEIC/HEIF can't be decoded by canvas — send those straight to the server.
const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function processImage(file: File): Promise<Blob> {
    if (!CANVAS_SUPPORTED_TYPES.has(file.type)) {
        return file;
    }

    // blueimp-load-image handles iOS EXIF orientation and file reading quirks,
    // and produces a canvas element fully disconnected from the original File.
    const result = await loadImage(file, {
        canvas: true,
        orientation: true,
        maxWidth: MAX_DIMENSION,
        maxHeight: MAX_DIMENSION,
    });

    const canvas = result.image as HTMLCanvasElement;
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Canvas produced no output"))),
            "image/jpeg",
            JPEG_QUALITY
        );
    });
}

export async function uploadImage(file: File): Promise<string> {
    const blob = await processImage(file);

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
