import url from "../config/api.setup";
import axios from "axios";
import protectedAxios from "../config/axois.setup";
import {
  LoginResponse,
  RegisterResponse,
  ConfirmationResponse,
  ForgotPasswordResponse,
  // UpdatePasswordResponse,
  ResendConfirmationResponse,
  GetUserResponse,
  SearchUserResponse,
} from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";


// Register
export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const res = await axios.post(`${url}/api/auth/register`, {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};

// Confirm Email
export const confirmation = async (
  username: string,
  confirmationCode: string
): Promise<ApiResponse<ConfirmationResponse>> => {
  try {
    const res = await axios.post(`${url}/api/auth/confirmation`, {
      username: username,
      confirmationCode: confirmationCode,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Unable to confirm user.",
    };
  }
};

// Resend Confirmation Code
export const resendConfirmationCode = async (
  username: string
): Promise<ApiResponse<ResendConfirmationResponse>> => {
  try {
    const res = await axios.post(`${url}/api/auth/resendConfirmationCode`, {
      username: username,
    });

    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to resend confirmation.",
    };
  }
};

// Forgot Password
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  try {
    const res = await axios.post(`${url}api/auth/forgotPassword`, {
      email: email,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to send confirmation code to User.",
    };
  }
};

// Forgot Password Reset
export const forgotPasswordConfirmation = async (
  username: string,
  code: string,
  password: string
) => {
  try {
    const res = await axios.post(`${url}/api/auth/forgotPasswordConfirmation`, {
      username: username,
      confirmationCode: code,
      password: password,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to reset User password.",
    };
  }
};

// Login
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const res = await axios.post(`${url}/api/auth/login`, {
      email: email,
      password: password,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Unable to login User.",
    };
  }
};

// User Details
export const getUserDetails = async (
  accessToken: string
): Promise<ApiResponse<GetUserResponse>> => {
  try {
    const res = await axios.get(
      `${url}/api/auth/user?accessToken=${accessToken}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to Get User Data.",
    };
  }
};

// Update User Details
export const updateUserDetails = async (
  accessToken: string,
  updatedUser: Partial<GetUserResponse>
): Promise<ApiResponse<GetUserResponse>> => {
  try {
    const res = await axios.put(
      `${url}/api/auth/user?accessToken=${accessToken}`,
      updatedUser
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to Update User Data.",
    };
  }
};

// Update Profile Image
export const updateProfileImage = async (accessToken: string, updatedUser: Partial<GetUserResponse>): Promise<ApiResponse<GetUserResponse>> => {
  try {
    console.log(updatedUser);
    const res = await axios.put(`${url}/api/auth/user?accessToken=${accessToken}`, updatedUser);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to Update User Data.",
    };
  }
};

// Get the presignedURL from the S3 bucket
export const fetchPresignedUrl = async (fileName: string, fileType: string): Promise<ApiResponse<string>> => {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const encodedFileType = encodeURIComponent(fileType);

    // API route for generating a presigned URL
    const res = await axios.get(`${url}/api/auth/generate-presigned-url?fileName=${encodedFileName}&fileType=${encodedFileType}`);
    return { data: res.data.url };
  } catch (error: any) {
    return {
      error: error.message || "Unable to fetch presigned URL.",
    };
  }
};

// Upload the image file to the S3 Bucket
export const uploadFileToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  try {
    // Put request to upload the image URL to S3
    const res = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    console.log('Upload successful', res);
  } catch (error) {
    console.error('Error uploading file to S3', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Update Password
// export const updatePassword = (): Promise<ApiResponse<UpdatePasswordResponse>> => {
// };

export const searchUsers = async (
  search: string,
  paginationToken: string = ""
): Promise<ApiResponse<SearchUserResponse>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/auth/users?search="${search}"${
        paginationToken === "" ? "" : `&paginationToken="${paginationToken}"`
      }`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to Search User Data.",
    };
  }
};

// Logout
export const logout = () => {};
