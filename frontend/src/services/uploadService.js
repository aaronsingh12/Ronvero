import api from './axiosInstance.js';

export const uploadService = {
  upload: (files, folder) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('folder', folder);
    return api.post('/upload', formData).then((response) => response.data);
  },
};
