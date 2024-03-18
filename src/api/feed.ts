import url from "../config/api.setup";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { Post } from "../types/PostResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses"

// follow user in DB
export const getFeed = async (
): Promise<ApiResponse<(Post & RecipeDetailsResponse)[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/feed`);
    const data : (Post & RecipeDetailsResponse)[] = res.data
    return { data: data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to follow a user.",
    };
  }
};