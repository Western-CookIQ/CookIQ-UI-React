import url from "../config/api.setup";
import { ApiResponse } from "../types/utils";
import protectedAxios from "../config/axois.setup";
import { Post } from "../types/PostResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses"
import { GetUserResponse } from "../types/AuthResponses";

// follow user in DB
export const getFeed = async (
): Promise<ApiResponse<(Post & RecipeDetailsResponse & GetUserResponse)[]>> => {
  try {
    const res = await protectedAxios.get(`${url}/api/feed`);
    const data : (Post & RecipeDetailsResponse)[] = res.data

    let posts : (Post & RecipeDetailsResponse & GetUserResponse)[] = []
    for (let post of data){
        // let userInfo = await getUser(post.user_id)
        // posts.push({
        //   ...userInfo,
        //   ...post
        // })
        let userInfo : GetUserResponse = {
          fName: "Josh",
          lName: "Rabovsky",
          email: "joshrabovsky@gmail.com",
          picture: "https://wallpapers.com/images/featured-full/picture-en3dnh2zi84sgt3t.jpg",
          is_public: true,
        }
        posts.push({
          ...userInfo,
          ...post
        })
    }
    
    return { data: posts };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to follow a user.",
    };
  }
};