import { useRef, useState } from "react";
import { uploadImage } from "../../lib/storage";

type Props = {
    currentUrl: string;
    alt: string;
    className?: string;
    onUpload: (url: string) => void;
};

const ImageUpload = ({ currentUrl, alt, className, onUpload }: Props) => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file);
            onUpload(url);
        } catch (err) {
            alert(`Failed to upload image: ${err instanceof Error ? err.message : "unknown error"}`);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="image_upload">
            {currentUrl && <img src={currentUrl} alt={alt} className={className} />}
            <button
                type="button"
                disabled={uploading}
                className="image_upload__button"
                onClick={() => inputRef.current?.click()}
            >
                {uploading ? "Uploading..." : currentUrl ? "Change Image" : "Add Image"}
            </button>
            <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </div>
    );
};

export default ImageUpload;
