import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import { FileStatus } from '../src';
import { FileUploader, createUploaderTheme } from '../src';

const theme = createUploaderTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' }
  },
});

export const App = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUploadClick = async (files: FileStatus[], updateProgress: (fileId: string, progress: number) => void) => {
    if (files.length === 0) return;
    
    setUploadStatus('Uploading...');
    
    // Upload files and update progress asynchronously
    await Promise.all(files.map(async (fileObj) => {
      try {
        // Simulate API upload with progress updates
        for (let i = 0; i <= 100; i += 10) {
          updateProgress(fileObj.id, i);
          await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
        }
      } catch (error) {
        console.error(`Upload failed for ${fileObj.file.name}`, error);
      }
    }));
    
    setUploadStatus(`Successfully uploaded ${files.length} file(s)`);
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleDeleteClick = (files: FileStatus[], id: string) => {
    return files.filter(f => f.id !== id);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            File Uploader
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A lightweight, themed dropzone for Material UI.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <FileUploader
            maxFiles={5}
            accept="*"
            onUpload={handleUploadClick}
            onDelete={handleDeleteClick}
          />
          
          {uploadStatus && (
            <Typography 
              textAlign="center" 
              color="primary" 
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              {uploadStatus}
            </Typography>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);