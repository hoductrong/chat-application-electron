const textEncoder = new TextEncoder();

export const stringToUint8Array = (content: string): Uint8Array => {
  return textEncoder.encode(content);
};
