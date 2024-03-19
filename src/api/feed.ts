import url from "../config/api.setup";
import { $metadata, ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { Post } from "../types/PostResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

// get a user's feed
export const getFeed = async (): Promise<
  ApiResponse<(Post & RecipeDetailsResponse)[]>
> => {
  try {
    const res = await protectedAxios.get(`${url}/api/feed`);
    const data: (Post & RecipeDetailsResponse)[] = res.data;
    return { data: data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to get user's feed.",
    };
  }
};

export const getIsPostLiked = async (post_id: number): Promise<
  ApiResponse<(boolean)>
> => {
  try {
    const res = await protectedAxios.get(`${url}/api/feed/${post_id}`);
    const data = res.data;
    return { data: data };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to get user's feed.",
    };
  }
};

export const changeLikeStatus = async (
  post_id: number,
  new_like_status: boolean
) : Promise<ApiResponse<null>> => {
    try {
      const res = await protectedAxios.post(`${url}/api/feed/${post_id}?is_liked=${new_like_status}`);
      return { data: res.data };
    } catch (error: unknown) {
      return {
        error: error instanceof Error ? error.message : "Unable to post to feed.",
      };
    }
}

// post to a user's feed
export const postToFeed = async (
  recipe_id: number
): Promise<ApiResponse<$metadata>> => {
  try {
    const res = await protectedAxios.post(`${url}/api/feed`, {
      recipe_id,
    });
    return { data: res.data };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Unable to post to feed.",
    };
  }
};
