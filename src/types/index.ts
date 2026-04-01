import React from 'react';

export interface FileStatus {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  previewUrl?: string;
  onDelete?: (id: string) => void;
  // S3 multipart upload tracking
  s3UploadId?: string;
  s3Parts?: Array<{ partNumber: number; eTag: string }>;
}

/** S3 API Configuration for multipart upload */
export interface S3Config {
  /** API endpoint to get presigned URL for uploading a part */
  getPresignedUrlApi: (fileKey: string, partNumber: number, uploadId: string) => Promise<string>;
  /** API endpoint to initiate multipart upload */
  initiateMultipartApi: (fileKey: string, mimeType: string) => Promise<string>;
  /** API endpoint to complete multipart upload */
  completeMultipartApi: (fileKey: string, uploadId: string, parts: Array<{ partNumber: number; eTag: string }>) => Promise<void>;
  /** Generate S3 key from file. Default: Uses file name */
  generateFileKey?: (file: File) => string;
  /** Part size in bytes. Default: 5MB */
  partSize?: number;
}

export interface FileUploaderProps {
  onUpload?: (files: File[]) => void;
  onDelete?: (files: FileStatus[], id: string) => FileStatus[];
  maxFiles?: number;
  accept?: string; // e.g., "image/*,application/pdf"
  renderUploadArea?: (isDragging: boolean) => React.ReactNode;
  uploadAreaIcon?: React.ReactNode;
  uploadAreaTitle?: React.ReactNode;
  uploadAreaSubtitle?: React.ReactNode;
  // S3 multipart upload configuration (optional)
  s3Config?: S3Config;
}