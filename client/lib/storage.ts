import loadImage from "blueimp-load-image";
import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;

// HEIC/HEIF can't be decoded by canvas — send those straight to the server.
const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function mb(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function processImage(file: File): Promise<Blob> {
    if (!CANVAS_SUPPORTED_TYPES.has(file.type)) {
        return file;
    }

    // blueimp-load-image handles iOS EXIF orientation, file reading quirks,
    // and produces a canvas element fully disconnected from the original File.
    const result = await loadImage(file, {
        canvas: true,
        orientation: true,
        maxWidth: MAX_DIMENSION,
        maxHeight: MAX_DIMENSION,
    });

    const canvas = result.image as HTMLCanvasElement;
    // toDataURL is synchronous; fetch(dataUrl) converts base64 → Blob in-memory.
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    return fetch(dataUrl).then((r) => r.blob());
}

export type UploadDebugInfo = {
    fileType: string;
    fileSize: string;
    processed: boolean;
    blobSize: string;
    failedAt: "processing" | "fetch" | "server" | null;
};

export async function uploadImage(
    file: File,
    onDebug?: (info: UploadDebugInfo) => void
): Promise<string> {
    const debug: UploadDebugInfo = {
        fileType: file.type || "unknown",
        fileSize: mb(file.size),
        processed: false,
        blobSize: mb(file.size),
        failedAt: null,
    };

    let blob: Blob;
    try {
        blob = await processImage(file);
        debug.processed = blob !== file;
        debug.blobSize = mb(blob.size);
    } catch (err) {
        debug.failedAt = "processing";
        onDebug?.(debug);
        throw new Error(`Image processing error: ${err instanceof Error ? err.message : err}`);
    }

    let res: Response;
    try {
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");
        res = await fetch(`${import.meta.env.VITE_API_URI}/upload/image`, {
            method: "POST",
            headers: { ...(await authHeaders()) },
            body: formData,
        });
    } catch (err) {
        debug.failedAt = "fetch";
        onDebug?.(debug);
        throw new Error(`Network error sending to server: ${err instanceof Error ? err.message : err}`);
    }

    if (!res.ok) {
        debug.failedAt = "server";
        onDebug?.(debug);
        const body = await res.json().catch(() => ({}));
        throw new Error(`Server error ${res.status}: ${body.error ?? "unknown"}`);
    }

    onDebug?.(debug);
    const { imageUrl } = await res.json();
    return imageUrl;
}
