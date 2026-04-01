import { S3Config } from '../types/index';

const DEFAULT_PART_SIZE = 5 * 1024 * 1024; // 5MB

export interface S3UploadProgress {
  totalBytes: number;
  uploadedBytes: number;
  percentage: number;
}

/**
 * Uploads a file to AWS S3 using multipart upload
 * @param file - File to upload
 * @param s3Config - S3 configuration with API endpoints
 * @param onProgress - Callback to track upload progress
 * @returns S3 upload result with uploadId and parts
 */
export const uploadToS3 = async (
  file: File,
  s3Config: S3Config,
  onProgress?: (progress: S3UploadProgress) => void
): Promise<{ uploadId: string; parts: Array<{ partNumber: number; eTag: string }> }> => {
  const partSize = s3Config.partSize || DEFAULT_PART_SIZE;
  const fileKey = s3Config.generateFileKey?.(file) || file.name;
  
  // Step 1: Initiate multipart upload
  const uploadId = await s3Config.initiateMultipartApi(fileKey, file.type);
  
  const parts: Array<{ partNumber: number; eTag: string }> = [];
  const totalParts = Math.ceil(file.size / partSize);
  let uploadedBytes = 0;
  
  try {
    // Step 2: Upload each part
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      const partBlob = file.slice(start, end);
      
      // Get presigned URL for this part
      const presignedUrl = await s3Config.getPresignedUrlApi(fileKey, partNumber, uploadId);
      
      // Upload part to S3
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: partBlob,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload part ${partNumber}: ${response.statusText}`);
      }
      
      const eTag = response.headers.get('etag');
      if (!eTag) {
        throw new Error(`No ETag returned for part ${partNumber}`);
      }
      
      parts.push({ partNumber, eTag });
      uploadedBytes += partBlob.size;
      
      // Report progress
      if (onProgress) {
        onProgress({
          totalBytes: file.size,
          uploadedBytes,
          percentage: Math.round((uploadedBytes / file.size) * 100),
        });
      }
    }
    
    // Step 3: Complete multipart upload
    await s3Config.completeMultipartApi(fileKey, uploadId, parts);
    
    return { uploadId, parts };
  } catch (error) {
    console.error('S3 multipart upload failed:', error);
    throw error;
  }
};
