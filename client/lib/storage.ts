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
async function processImage(file: File): Promise<Blob> {
    if (!isIOS() || !CANVAS_SUPPORTED_TYPES.has(file.type)) {
        return file;
    }

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
