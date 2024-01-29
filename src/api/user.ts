import url from "../config/api.setup";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { User } from "../types/UserResponse";

  // add user to DB
  export const postUser = async (
    userSub: string
  ): Promise<ApiResponse<RecipeRatingResponse[]>> => {
    try {
      const res = await protectedAxios.post(`${url}/api/client/`, {
        id: userSub,
        is_first_login: true,
        is_public: false,
      });
      return { data: res.data };
    } catch (error: unknown) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to register user to db.",
      };
    }
  };

// update user in DB test
export const updateUser = async (
  userSub: string,
  isFirstLogin: boolean = false
): Promise<ApiResponse<RecipeRatingResponse[]>> => {
  try {
    const res = await protectedAxios.put(`${url}/api/client/${userSub}`, {
      is_first_login: isFirstLogin,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to update user in the db.",
    };
  }
};

// TODO: get user is in the db
export const getUser = async (userSub: string): Promise<ApiResponse<User>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/client/${userSub}`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to get user details.",
    };
  }
};

// update user is in the db
// export const updateUser = async (userSub: string, updatedUser: Partial<User>): Promise<ApiResponse<User>> => {
//   try {
//     const res = await protectedAxios.put(`${url}/api/client/${userSub}`, updatedUser);
//     return { data: res.data };
//   } catch (error: unknown) {
//     return {
//       error:
//         error instanceof Error ? error.message : "Unable to get user details.",
//     };
//   }
// };