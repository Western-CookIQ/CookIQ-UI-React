import url from "../config/api.setup";
import {
  RecipeDetailsResponse,
  OnboardRecipeResponse,
} from "../types/RecipeResponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";

// GET: recipe preview -> need to add this endpoint *
export const getRecipePreview = async (
  id: number
): Promise<ApiResponse<OnboardRecipeResponse>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/recipe/${id}?preview=${true}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};

// GET: recipe details
export const getRecipeDetails = async (
  id: number
): Promise<ApiResponse<RecipeDetailsResponse>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/recipe/${id}`);
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};
