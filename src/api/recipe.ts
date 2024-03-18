import url from "../config/api.setup";
import {
  RecipeDetailsResponse,
  OnboardRecipeResponse,
  RecipeTagDetailsResponse,
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

// GET: recipe tag details
export const getRecipeTagDetails = async (
  recipeId: number
): Promise<ApiResponse<RecipeTagDetailsResponse>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/recipetag/${recipeId}`);
    res.data = res.data.slice(0, Math.min(res.data.length, 3));

    const tagDescription = await Promise.all(
      res.data.map(async (tagId: any) => {
        const res = await protectedAxios.get(`${url}/api/tag/${tagId}`);
        return res.data.description;
      })
    );

    const filteredTags = tagDescription.filter((tag) => tag.length < 12);
    return { data: { id: recipeId, tags: filteredTags } };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};
