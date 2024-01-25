export const buildSrcUrl = (blob?: Blob) => {
  if (!blob) {
    return undefined;
  }

  return URL.createObjectURL(blob);
};
