const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET_NAME;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);

exports.presign = async (req, res) => {
    const { contentType, filename } = req.body;

    if (!ALLOWED_TYPES.has(contentType)) {
        return res.status(400).json({ error: "Invalid file type" });
    }

    try {
        const ext = filename?.split(".").pop() ?? "jpg";
        const key = `recipes/${req.userId}/${Date.now()}.${ext}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
        const imageUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.json({ uploadUrl, imageUrl });
    } catch (err) {
        console.error("Failed to generate pre-signed URL:", err);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
};
