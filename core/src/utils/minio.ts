import { Client } from "minio";
import dotenv from 'dotenv';
dotenv.config();

export const  minioClient = new Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
});

export const screenshotBucket = "screenshots";
export const region = "ap-south-1";
export const publicBaseUrl = process.env.MINIO_S3_PUBLIC_BASE_URL!;