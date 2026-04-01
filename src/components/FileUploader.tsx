import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, Button, List } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileStatus, FileUploaderProps } from '../types';
import { FileItem } from './FileItem';
import { generatePreview } from '../utils/generatePreview';
import { uploadToS3 } from '../utils/s3Upload';

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload,
  onDelete,
  maxFiles = 5,
  accept = "*",
  renderUploadArea,
  uploadAreaIcon,
  uploadAreaTitle,
  uploadAreaSubtitle,
  s3Config
}) => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    
    const newFiles: FileStatus[] = Array.from(incomingFiles).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending',
      previewUrl: undefined
    }));

    setFiles(prev => {
      const updatedFiles = [...prev, ...newFiles].slice(0, maxFiles);
      
      // Generate previews asynchronously
      updatedFiles.forEach((fileObj, index) => {
        if (!fileObj.previewUrl) {
          generatePreview(fileObj.file).then((previewUrl) => {
            setFiles(current =>
              current.map((f, i) =>
                i === current.findIndex(item => item.id === fileObj.id)
                  ? { ...f, previewUrl }
                  : f
              )
            );
          });
        }
      });

      return updatedFiles;
    });
  };

  const handleDelete = (id: string) => {
    if (onDelete && typeof onDelete === 'function') {
      const newFiles = onDelete?.(files, id);
      setFiles(newFiles);
    } else {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleUpload = async () => {
    if (s3Config) {
      // Upload to S3 using multipart upload
      for (const fileObj of files) {
        if (fileObj.status === 'pending') {
          try {
            setFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id ? { ...f, status: 'uploading' as const } : f
              )
            );

            const result = await uploadToS3(fileObj.file, s3Config, (progress) => {
              setFiles(prev =>
                prev.map(f =>
                  f.id === fileObj.id
                    ? { ...f, progress: progress.percentage }
                    : f
                )
              );
            });

            setFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id
                  ? {
                      ...f,
                      status: 'completed' as const,
                      progress: 100,
                      s3UploadId: result.uploadId,
                      s3Parts: result.parts,
                    }
                  : f
              )
            );
          } catch (error) {
            console.error(`Failed to upload ${fileObj.file.name}:`, error);
            setFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id ? { ...f, status: 'error' as const } : f
              )
            );
          }
        }
      }
    } else {
      // Use default onUpload callback
      onUpload?.(files.map(f => f.file));
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <Paper
        variant="outlined"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          borderStyle: 'dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          accept={accept}
          hidden
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {renderUploadArea ? (
          renderUploadArea(isDragging)
        ) : (
          <>
            {uploadAreaIcon || <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
            <Typography variant="h6">
              {uploadAreaTitle || 'Drag & Drop files here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {uploadAreaSubtitle || `or click to browse (Max ${maxFiles} files)`}
            </Typography>
          </>
        )}
      </Paper>

      <List sx={{ mt: 2 }}>
        {files.map((fileObj) => (
          <FileItem 
            key={fileObj.id}
            fileData={{...fileObj, onDelete: handleDelete}}
          />
        ))}
      </List>

      {files.length > 0 && (
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleUpload}
          sx={{ mt: 2 }}
        >
          Upload {files.length} Files
        </Button>
      )}
    </Box>
  );
};