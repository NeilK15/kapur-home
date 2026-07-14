import { useState } from "react";
import { uploadImage } from "../../lib/storage";

type Props = {
    currentUrl: string;
    alt: string;
    className?: string;
    onUpload: (url: string) => void;
};

const ImageUpload = ({ currentUrl, alt, className, onUpload }: Props) => {
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        // Reset so the same file can be re-selected later
        e.target.value = "";

        setUploading(true);
        try {
            const url = await uploadImage(file);
            onUpload(url);
        } catch (err) {
            alert(`Failed to upload image: ${err instanceof Error ? err.message : "unknown error"}`);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="image_upload">
            {currentUrl && <img src={currentUrl} alt={alt} className={className} />}
            {/*
             * Overlay pattern: the invisible <input> sits on top of the visible button.
             * iOS Safari only opens the file picker for direct taps on native inputs —
             * programmatic .click() from a React handler is often blocked as non-trusted.
             */}
            <div style={{ position: "relative", display: "inline-block" }}>
                <button
                    type="button"
                    disabled={uploading}
                    className="image_upload__button"
                >
                    {uploading ? "Uploading..." : currentUrl ? "Change Image" : "Add Image"}
                </button>
                {!uploading && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
