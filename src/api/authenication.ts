import url from "../config/api.setup";
import axios from "axios";
import {
  LoginResponse,
  RegisterResponse,
  ConfirmationResponse,
  ForgotPasswordResponse,
  // UpdatePasswordResponse,
  ResendConfirmationResponse,
  GetUserResponse,
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

// Forgot Password Email Confirmation
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  console.log(url);
  try {
    const res = await axios.post(`${url}/api/auth/forgotPassword`, {
      username: email,
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

// Update Password
// export const updatePassword = (): Promise<ApiResponse<UpdatePasswordResponse>> => {
// };

// Logout
export const logout = () => {};
