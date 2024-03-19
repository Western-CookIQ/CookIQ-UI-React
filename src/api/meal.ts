import url from "../config/api.setup";
import { MealResponses, RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

// get all user meals that have been rated
export const getRatedMeals = async (): Promise<
  ApiResponse<RecipeRatingResponse[]>
> => {
  try {
    const res = await protectedAxios.get(`${url}/api/meal`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to get user meal ratings.",
    };
  }
};

// get meal by user id and recipe id
export const getRatedMealsByRecipeId = async (
  recipe_id: number
): Promise<ApiResponse<MealResponses>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/meal/${recipe_id}`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to get user meal ratings.",
    };
  }
};

// Post a meal rating by the user
export const postMealRating = async (
  recipeId: number,
  rating: number,
  isCooked: boolean = false
): Promise<ApiResponse<RecipeRatingResponse[]>> => {
  try {
    const postData = {
      recipe_id: recipeId,
      rating: rating,
      is_cooked: isCooked,
    };
    const res = await protectedAxios.put(`${url}/api/meal`, postData);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to post meal rating.",
    };
  }
};

// update bookmark status
export const updateBookmarkStatus = async (
  recipeId: number,
  isBookmarked: boolean
): Promise<ApiResponse<RecipeRatingResponse[]>> => {
  try {
    const postData = {
      recipe_id: recipeId,
      is_bookmarked: isBookmarked,
    };
    const res = await protectedAxios.put(`${url}/api/meal`, postData);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to update bookmark status.",
    };
  }
};

// get bookmarked meals for the user
export const getBookmarkedMeals = async (
  userSub: string
): Promise<ApiResponse<RecipeDetailsResponse[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/meal/bookmarks/${userSub}`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to get bookmarked meals.",
    };
  }
};
