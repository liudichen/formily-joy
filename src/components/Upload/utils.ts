import { isImageMimeType, getFileExtensionFromUrl } from '@iimm/shared';

import type { UploadedFile } from '@/types/index';

const isSameFile = (f1: UploadedFile, f2: UploadedFile) => (!((f1.name !== f2.name || f1.size !== f2.size || f1.type !== f2.type || f1.lastModified !== f2.lastModified)));

export const updateFileList = (newfile: UploadedFile | UploadedFile[], fileList: UploadedFile[]) => {
  const newFileList = Array.isArray(newfile) ? newfile : (newfile ? [ newfile ] : []);
  if (!newFileList.length) return null;
  const nextFileList = [ ...(fileList || []) ];
  for (let i = 0; i < newFileList.length; i++) {
    const file = newFileList[i];
    const fileIndex = nextFileList.findIndex((item) => isSameFile(item, file));
    if (fileIndex === -1) {
      nextFileList.push(file);
    } else {
      nextFileList[fileIndex] = file;
    }
  }
  return nextFileList;
};

export const removeFile = (file: UploadedFile, fileList: UploadedFile[]) => {
  const newFileList = (fileList || []).filter((item) => !isSameFile(item, file));
  if (newFileList.length === (fileList || []).length) {
    return null;
  }
  return newFileList;
};

export const isImage = (file: UploadedFile) => {
  if (file.type && !file.url) {
    return isImageMimeType(file.type);
  }
  const url = file.url || '';
  const extension = getFileExtensionFromUrl(url);
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
  ) {
    return true;
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  }
  if (extension) {
    // other file types which have extension
    return false;
  }
  return false;
};
