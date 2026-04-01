import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, Button, List } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileStatus, FileUploaderProps } from './types';
import { FileItem } from './FileItem.tsx';
import { generatePreview } from '../utils/generatePreview';

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload,
  onDelete,
  maxFiles = 5,
  accept = "*",
  renderUploadArea,
  uploadAreaIcon,
  uploadAreaTitle,
  uploadAreaSubtitle
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
          onClick={() => onUpload?.(files.map(f => f.file))}
          sx={{ mt: 2 }}
        >
          Upload {files.length} Files
        </Button>
      )}
    </Box>
  );
};