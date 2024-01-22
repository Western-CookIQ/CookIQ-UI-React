import url from "../config/api.setup";
import { ContentBasedRecommedationsResponse } from "../types/RecommendationsReponses";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";

// GET: recipe recommendations based on content based
export const getContentBasedRecommendations = async (
  id: number
): Promise<ApiResponse<ContentBasedRecommedationsResponse>> => {
  try {
    const res = await protectedAxios.get(
      `${url}/api/recommendations/content-based/${id}`
    );
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to register user.",
    };
  }
};
