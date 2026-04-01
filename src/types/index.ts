import React from 'react';

export interface FileStatus {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  previewUrl?: string;
  onDelete?: (id: string) => void;
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
}