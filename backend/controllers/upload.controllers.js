import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

// ImageKit is only used when real credentials are configured.
// Placeholder values (e.g. YOUR_IMAGEKIT_ENDPOINT) fall back to local storage,
// which the server already exposes via the /uploads static route.
const isPlaceholder = (value = '') =>
  /YOUR_|PLACEHOLDER|<[^>]+>/.test(value) || value.trim() === '';

const imagekitConfigured =
  /^https?:\/\//.test(process.env.KIT_ENDPOINT || '') &&
  !isPlaceholder(process.env.KIT_PUBLIC_KEY) &&
  !isPlaceholder(process.env.KIT_PRIVATE_KEY);

var imagekit = imagekitConfigured
  ? new ImageKit({
      publicKey: process.env.KIT_PUBLIC_KEY,
      privateKey: process.env.KIT_PRIVATE_KEY,
      urlEndpoint: process.env.KIT_ENDPOINT,
    })
  : null;

if (!imagekit) {
  console.log(
    'ℹ️  ImageKit credentials not configured — documents will be stored locally under /uploads'
  );
}

export const upload = async (filePath, fileName) => {
  // Local storage: multer already wrote the file to uploads/documents,
  // and that folder is served statically at /uploads.
  if (!imagekit) {
    return {
      url: `/uploads/documents/${fileName}`,
      fileId: null,
      local: true,
    };
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    const result = await imagekit.upload({
      file: fileStream,
      fileName: `doc_${Date.now()}.pdf`,
      folder: '/documents',
    });

    return {
      url: result.url,
      fileId: result.fileId,
      local: false,
    };
  } catch (error) {
    console.error(
      'ImageKit upload failed:',
      error?.message || error?.response?.data || error
    );
    throw new Error('File cannot be uploaded');
  }
};

export const deleteFile = async (fileId) => {
  if (!fileId || !imagekit) return null;

  try {
    const result = await imagekit.deleteFile(fileId);
    return result;
  } catch (error) {
    console.error('ImageKit Delete Error:', error?.message || error);
    throw new Error('Could not delete file from cloud storage');
  }
};
