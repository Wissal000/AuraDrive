import { Client } from "minio";

// Configure your MinIO client
export const minioClient = new Client({
  endPoint: "localhost",       // MinIO host
  port: 9100,                  // MinIO port
  useSSL: false,               // true if using HTTPS
  accessKey: "BestDrive",     // from your docker-compose env
  secretKey: "admin123",       // from your docker-compose env
});
