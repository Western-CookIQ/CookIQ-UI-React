import url from "../config/api.setup";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { ConnectionsResponse } from "../types/ConnectionsResponses";

// follow user in DB
export const followUser = async (
  userSub: string
): Promise<ApiResponse<ConnectionsResponse>> => {
  try {
    const res = await protectedAxios.post(`${url}/api/connections/`, {
      followed_user_id: userSub,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to follow a user.",
    };
  }
};

// unfollow user in DB
export const unfollowUser = async (
  userSub: string
): Promise<ApiResponse<ConnectionsResponse>> => {
  try {
    const res = await protectedAxios.delete(
      `${url}/api/connections/?user=${userSub}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to unfollow a user.",
    };
  }
};

// check if a user is following another user
export const checkFollowingStatus = async (
  userSub: string
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/connections/following?user=${userSub}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to unfollow a user.",
    };
  }
};

// get all users that the user is following
export const getFollowing = async (): Promise<ApiResponse<String[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/connections/following`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to get following userSub.",
    };
  }
};

// get all users that are following the user
export const getFollowers = async (): Promise<ApiResponse<String[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/connections/followers`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to get follers for a user.",
    };
  }
};
