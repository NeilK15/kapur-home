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
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        setUploading(true);
        setErrorMsg(null);

        try {
            const url = await uploadImage(file);
            onUpload(url);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="image_upload">
            {currentUrl && <img src={currentUrl} alt={alt} className={className} />}
            <div style={{ position: "relative", display: "inline-block" }}>
                <button type="button" disabled={uploading} className="image_upload__button">
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
            {errorMsg && (
                <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "6px" }}>
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
