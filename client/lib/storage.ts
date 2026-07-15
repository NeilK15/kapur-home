import loadImage from "blueimp-load-image";
import { authHeaders } from "./api";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.85;

// HEIC/HEIF can't be decoded by canvas — send those straight to the server.
const CANVAS_SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// iPads running iOS 13+ report "MacIntel" but have touch points.
function isIOS(): boolean {
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
}

// iOS invalidates the File object's underlying data after the page is suspended
// while the camera app is open. blueimp-load-image works around this by reading
// the file through its own iOS-aware pipeline and producing a fresh canvas.
// Desktop browsers don't have this issue, so we send the file directly and let
// the server's sharp handle resizing and conversion.
async function processImageIOS(file: File): Promise<Blob> {
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

function processImageDesktop(file: File): Promise<Blob> {
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
            canvas.toBlob(
                (blob) => resolve(blob ?? file),
                "image/jpeg",
                JPEG_QUALITY
            );
        };

        img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
        img.src = objectUrl;
    });
}

async function processImage(file: File): Promise<Blob> {
    if (!CANVAS_SUPPORTED_TYPES.has(file.type)) {
        return file; // HEIC etc — server handles conversion
    }
    return isIOS() ? processImageIOS(file) : processImageDesktop(file);
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
