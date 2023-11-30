export interface newJobReturnType {
  id: number;
  time: Date;
  newJob: boolean;
}

export interface CustomError extends Error {
  code?: string;
}
