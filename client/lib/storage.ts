import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;
const COMPRESS_THRESHOLD_BYTES = 4 * 1024 * 1024; // 4 MB

const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function mb(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

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
            if (!ctx) { resolve(file); return; }

            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
            fetch(dataUrl)
                .then((r) => r.blob())
                .then(resolve)
                .catch(() => resolve(file));
        };

        img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
        img.src = objectUrl;
    });
}

export type UploadDebugInfo = {
    fileType: string;
    fileSize: string;
    compressed: boolean;
    blobSize: string;
    failedAt: "compression" | "fetch" | "server" | null;
};

export async function uploadImage(
    file: File,
    onDebug?: (info: UploadDebugInfo) => void
): Promise<string> {
    const debug: UploadDebugInfo = {
        fileType: file.type || "unknown",
        fileSize: mb(file.size),
        compressed: false,
        blobSize: mb(file.size),
        failedAt: null,
    };

    let blob: Blob;
    try {
        blob = await compressForUpload(file);
        debug.compressed = blob !== file && blob.size < file.size;
        debug.blobSize = mb(blob.size);
    } catch (err) {
        debug.failedAt = "compression";
        onDebug?.(debug);
        throw new Error(`Compression error: ${err instanceof Error ? err.message : err}`);
    }

    // iOS suspends Safari while the camera app is open; the network connection may need
    // a moment to recover when the user returns. Retry once after a short pause.
    let res: Response | undefined;
    let fetchErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 1500));
        try {
            const formData = new FormData();
            formData.append("image", blob, "image.jpg");
            res = await fetch(`${import.meta.env.VITE_API_URI}/upload/image`, {
                method: "POST",
                headers: { ...(await authHeaders()) },
                body: formData,
            });
            fetchErr = undefined;
            break;
        } catch (err) {
            fetchErr = err;
        }
    }
    if (fetchErr || !res) {
        debug.failedAt = "fetch";
        onDebug?.(debug);
        throw new Error(`Network error sending to server: ${fetchErr instanceof Error ? fetchErr.message : fetchErr}`);
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
