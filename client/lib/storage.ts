import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;

const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function mb(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Copy the file's bytes into a plain ArrayBuffer in the JS heap.
// On iOS, File objects from the camera can have their underlying filesystem
// reference invalidated after the page is suspended while the camera is open.
// Reading into an ArrayBuffer keeps the data alive regardless of iOS lifecycle.
function readIntoMemory(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsArrayBuffer(file);
    });
}

async function compressForUpload(blob: Blob, type: string): Promise<Blob> {
    if (!CANVAS_SUPPORTED_TYPES.has(type)) {
        return blob;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(blob);

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
            if (!ctx) { resolve(blob); return; }

            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
            fetch(dataUrl)
                .then((r) => r.blob())
                .then(resolve)
                .catch(() => resolve(blob));
        };

        img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(blob); };
        img.src = objectUrl;
    });
}

export type UploadDebugInfo = {
    fileType: string;
    fileSize: string;
    readIntoMemory: boolean;
    compressed: boolean;
    blobSize: string;
    failedAt: "read" | "compression" | "fetch" | "server" | null;
};

export async function uploadImage(
    file: File,
    onDebug?: (info: UploadDebugInfo) => void
): Promise<string> {
    const debug: UploadDebugInfo = {
        fileType: file.type || "unknown",
        fileSize: mb(file.size),
        readIntoMemory: false,
        compressed: false,
        blobSize: mb(file.size),
        failedAt: null,
    };

    // Read into memory first, before any other async work
    let safeBlob: Blob;
    try {
        const buffer = await readIntoMemory(file);
        safeBlob = new Blob([buffer], { type: file.type });
        debug.readIntoMemory = true;
    } catch (err) {
        debug.failedAt = "read";
        onDebug?.(debug);
        throw new Error(`Could not read file: ${err instanceof Error ? err.message : err}`);
    }

    let blob: Blob;
    try {
        blob = await compressForUpload(safeBlob, file.type);
        debug.compressed = blob !== safeBlob && blob.size < safeBlob.size;
        debug.blobSize = mb(blob.size);
    } catch (err) {
        debug.failedAt = "compression";
        onDebug?.(debug);
        throw new Error(`Compression error: ${err instanceof Error ? err.message : err}`);
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
