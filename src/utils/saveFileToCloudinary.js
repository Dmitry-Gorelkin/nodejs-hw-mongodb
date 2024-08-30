import cloudinary from 'cloudinary';
import * as fs from 'node:fs/promises';
import env from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
});

const saveFileToCloudinary = async file => {
  const response = await cloudinary.v2.uploader.upload(file.path);

  await fs.unlink(file.path);

  return response.secure_url;
};

export default saveFileToCloudinary;