export const generatePreview = (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const fileType = file.type;

    // Handle images
    if (fileType.startsWith('image/')) {
      resolve(URL.createObjectURL(file));
      return;
    }

    // Handle videos - extract first frame
    if (fileType.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 0.1; // Seek to 0.1 seconds to get first frame
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        } else {
          resolve(undefined);
        }
        video.remove();
      };
      video.onerror = () => {
        resolve(undefined);
        video.remove();
      };
      video.src = URL.createObjectURL(file);
      document.body.appendChild(video);
      return;
    }

    // Handle PDFs - for now, return undefined
    if (fileType === 'application/pdf') {
      resolve(undefined);
      return;
    }

    // Default - no preview
    resolve(undefined);
  });
};
