// types/user.types.ts

export interface LoadDataResponse {
  message: string;
  success: boolean;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  message: string;
  data?: any;
}
