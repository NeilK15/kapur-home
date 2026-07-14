const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const sharp = require("sharp");

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET_NAME;

// Accept any image/* mimetype; sharp handles the conversion
const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB — covers raw HEIC from camera
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
}).single("image");

exports.multerMiddleware = (req, res, next) => {
    multerUpload(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
};

exports.uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    try {
        const jpegBuffer = await sharp(req.file.buffer)
            .rotate()                                                      // honour EXIF orientation
            .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();

        const key = `recipes/${req.userId}/${Date.now()}.jpg`;

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: jpegBuffer,
            ContentType: "image/jpeg",
        }));

        const imageUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        res.json({ imageUrl });
    } catch (err) {
        console.error("Failed to process/upload image:", err);
        res.status(500).json({ error: "Failed to process image" });
    }
};
