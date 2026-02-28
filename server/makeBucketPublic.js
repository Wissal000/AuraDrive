// makeBucketPublic.js
import { minioClient } from "./minioClient.js";

const bucketName = "cars";

async function makeBucketPublic() {
  try {
    // Check if the bucket exists
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Bucket "${bucketName}" does not exist. Creating...`);
      await minioClient.makeBucket(bucketName);
    }

    // Set bucket policy to public
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`Bucket "${bucketName}" is now PUBLIC!`);
  } catch (err) {
    console.error("Error making bucket public:", err);
  }
}

makeBucketPublic();