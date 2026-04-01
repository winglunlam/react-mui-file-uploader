import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, LinearProgress, IconButton, Box } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileStatus } from './types';

export const FileItem: React.FC<{ fileData: FileStatus }> = ({ fileData }) => {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" onClick={() => fileData.onDelete?.(fileData.id)}>
          <DeleteIcon />
        </IconButton>
      }
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
    >
      <ListItemAvatar>
        <Avatar src={fileData.previewUrl} variant="rounded">
          <InsertDriveFileIcon />
        </Avatar>
      </ListItemAvatar>
      <Box sx={{ width: '100%', mr: 2 }}>
        <ListItemText 
          primary={fileData.file.name} 
          secondary={`${(fileData.file.size / 1024).toFixed(1)} KB`} 
        />
        <LinearProgress 
          variant="determinate" 
          value={fileData.progress} 
          sx={{ mt: 1, height: 6, borderRadius: 3 }} 
        />
      </Box>
    </ListItem>
  );
};