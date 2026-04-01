import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import { FileStatus } from './types';
import { FileUploader, createUploaderTheme } from '../src';

const theme = createUploaderTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' }
  },
});

export const App = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUploadClick = (files: File[]) => {
    setUploadStatus('Uploading...');
    
    // Send files to your API
    console.log("Files to upload:", files);
    
    setTimeout(() => {
      setUploadStatus('Success!');
    }, 2000);
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