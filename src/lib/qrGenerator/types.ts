export type GenQrWorkerResponse = {
  id: number;
  data?: string;
  error?: string;
};

export type GenQrWorkerRequest = {
  id: number;
  data: string;
};
