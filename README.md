# react-mui-file-uploader

A lightweight, customizable file uploader component for React using Material-UI (MUI). Features drag-and-drop support, file previews (images, videos), progress tracking, and full theme customization.

## Key Features

- 📁 **Drag & Drop Support** - Intuitive drag-and-drop file uploads
- 🖼️ **Smart Previews** - Auto-generates previews for images and videos (first frame)
- 🎨 **Fully Customizable** - Customize upload area, icons, text, and theme
- 📦 **TypeScript Support** - Built with TypeScript for better developer experience
- 🎭 **Material-UI Styled** - Seamless integration with MUI theme system
- ⚡ **Lightweight** - Minimal dependencies, fast and performant
- 📱 **Responsive** - Works perfectly on all screen sizes

## Installation

### Prerequisites

Before installing `react-mui-file-uploader`, make sure you have the required peer dependencies installed:

```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### Install the Package

```bash
npm install react-mui-file-uploader
```

---

## Quick Start

```tsx
import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import { FileUploader, createUploaderTheme, FileStatus } from 'react-mui-file-uploader';

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
```

---

## Props Documentation

### `FileUploader` Component

The main component for file uploads with drag-and-drop support.

#### FileUploaderProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onUpload` | `(files: File[]) => void` | No | - | Callback triggered when user clicks the Upload button. Receives array of File objects. |
| `onDelete` | `(files: FileStatus[], id: string) => FileStatus[]` | No | - | Callback when a file is deleted. Receives current files array and file ID. Must return updated files array. |
| `maxFiles` | `number` | No | `5` | Maximum number of files allowed in the uploader. |
| `accept` | `string` | No | `"*"` | File type filter (e.g., "image/*", "image/*,video/*", ".pdf"). |
| `renderUploadArea` | `(isDragging: boolean) => React.ReactNode` | No | - | Custom render function for the entire upload area. Receives dragging state. |
| `uploadAreaIcon` | `React.ReactNode` | No | `CloudUploadIcon` | Custom icon for the upload area. |
| `uploadAreaTitle` | `React.ReactNode` | No | `"Drag & Drop files here"` | Custom title text for the upload area. |
| `uploadAreaSubtitle` | `React.ReactNode` | No | `"or click to browse (Max {maxFiles} files)"` | Custom subtitle text for the upload area. |

#### FileStatus

Object representing a file in the uploader.

```typescript
interface FileStatus {
  file: File;                                    // The actual File object
  id: string;                                    // Unique identifier for the file
  progress: number;                              // Upload progress (0-100)
  status: 'pending' | 'uploading' | 'completed' | 'error';  // File status
  previewUrl?: string;                           // Preview image URL (auto-generated for images/videos)
  onDelete?: (id: string) => void;              // Delete callback
}
```

---

## Customization Examples

### 1. Basic Upload Area Customization

Customize individual elements of the upload area:

```tsx
import { FileUploader } from 'react-mui-file-uploader';
import { CloudDone } from '@mui/icons-material';

<FileUploader
  maxFiles={10}
  uploadAreaIcon={<CloudDone sx={{ fontSize: 64, color: 'success.main' }} />}
  uploadAreaTitle="Upload your files!"
  uploadAreaSubtitle="Drag files here or click to select"
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

### 2. Complete Custom Upload Area

Provide a fully custom render function:

```tsx
<FileUploader
  maxFiles={5}
  renderUploadArea={(isDragging) => (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: isDragging ? 'primary.light' : 'background.paper',
        border: isDragging ? '3px solid' : '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 2,
        transition: 'all 0.2s ease'
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" fontWeight="bold">
        {isDragging ? 'Drop it here!' : 'Drop files to upload'}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Supporting images, videos, and documents
      </Typography>
    </Box>
  )}
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

### 3. Icon-Only Upload Area

```tsx
import { CloudUpload } from '@mui/icons-material';

<FileUploader
  maxFiles={5}
  uploadAreaIcon={<CloudUpload sx={{ fontSize: 80 }} />}
  uploadAreaTitle="Drop files here"
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

---

## Theme Customization

The FileUploader integrates seamlessly with Material-UI's theming system using `createUploaderTheme`.

### Basic Theme Customization

```tsx
import { createUploaderTheme } from 'react-mui-file-uploader';
import { ThemeProvider } from '@mui/material/styles';

const customTheme = createUploaderTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
});

export const App = () => (
  <ThemeProvider theme={customTheme}>
    <FileUploader
      maxFiles={5}
      onUpload={handleUpload}
      onDelete={handleDelete}
    />
  </ThemeProvider>
);
```

### Dark Theme Example

```tsx
const darkTheme = createUploaderTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

<ThemeProvider theme={darkTheme}>
  <FileUploader maxFiles={5} onUpload={handleUpload} />
</ThemeProvider>
```

---

## Complete Example with All Features

```tsx
import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { FileStatus } from 'react-mui-file-uploader';
import { FileUploader, createUploaderTheme } from 'react-mui-file-uploader';

const theme = createUploaderTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' },
  },
});

export const App = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadClick = async (files: File[]) => {
    setUploadStatus('Uploading...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadStatus(`Successfully uploaded ${files.length} file(s)`);
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleDeleteClick = (files: FileStatus[], id: string) => {
    setUploadStatus(`Deleted file`);
    return files.filter(f => f.id !== id);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            📁 File Uploader Pro
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Drag, drop, preview, and upload files with ease
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <FileUploader
            maxFiles={5}
            accept="image/*,video/*,.pdf"
            uploadAreaIcon={<ImageIcon sx={{ fontSize: 64, color: 'primary.main' }} />}
            uploadAreaTitle="Upload Images, Videos, or PDFs"
            uploadAreaSubtitle="Drag files here or click to browse"
            onUpload={handleUploadClick}
            onDelete={handleDeleteClick}
          />
          
          {uploadStatus && (
            <Typography 
              textAlign="center" 
              color="primary" 
              sx={{ mt: 3, fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              ✓ {uploadStatus}
            </Typography>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};
```

---

## License

MIT License - see LICENSE file for details

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
