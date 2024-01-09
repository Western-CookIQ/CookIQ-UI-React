import url from "../config/api.setup";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";

// get all user meals that have been rated
export const getRatedMeals = async (
  userSub: string
): Promise<ApiResponse<RecipeRatingResponse[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/meals/${userSub}`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};


// Post a meal rating by the user
export const postMealRating = async (
  userSub: string,
  recipeId: number,
  isBookmarked: boolean,
  rating: number,
  isCooked: boolean
): Promise<ApiResponse<RecipeRatingResponse[]>> => {
  try {
    const postData = {
      recipe_id: recipeId,
      user_id: userSub,
      is_bookmarked: isBookmarked,
      rating: rating,
      is_cooked: isCooked,
    };
    const res = await protectedAxios.post(`${url}/api/meal`, postData);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};
