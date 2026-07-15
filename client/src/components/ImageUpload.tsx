import { useState } from "react";
import { uploadImage, UploadDebugInfo } from "../../lib/storage";

type Props = {
    currentUrl: string;
    alt: string;
    className?: string;
    onUpload: (url: string) => void;
};

const ImageUpload = ({ currentUrl, alt, className, onUpload }: Props) => {
    const [uploading, setUploading] = useState(false);
    const [debugInfo, setDebugInfo] = useState<UploadDebugInfo | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        setUploading(true);
        setErrorMsg(null);
        setDebugInfo(null);

        try {
            const url = await uploadImage(file, setDebugInfo);
            onUpload(url);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "unknown error");
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

            {debugInfo && (
                <div
                    style={{
                        marginTop: "8px",
                        padding: "8px",
                        background: errorMsg ? "#3b0000" : "#003b00",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        color: "#eee",
                        lineHeight: "1.6",
                        wordBreak: "break-word",
                    }}
                >
                    <strong>Upload debug</strong>
                    <br />
                    Type: {debugInfo.fileType}
                    <br />
                    Original size: {debugInfo.fileSize}
                    <br />
                    Processed via blueimp: {debugInfo.processed ? `yes → ${debugInfo.blobSize}` : `no (${debugInfo.blobSize})`}
                    <br />
                    {errorMsg ? (
                        <>
                            Failed at: <strong>{debugInfo.failedAt}</strong>
                            <br />
                            Error: {errorMsg}
                        </>
                    ) : (
                        <strong style={{ color: "#7fff7f" }}>Upload succeeded</strong>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
