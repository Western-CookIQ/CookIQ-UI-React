import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import FeedCard from "../components/FeedCard";
import SearchBar from "../components/SearchBar";

import { getFeed, getIsPostLiked } from "../api/feed";

import { Post } from "../types/PostResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses";
import { GetUserResponse } from "../types/AuthResponses";
import { getUserBySub } from "../api/authenication";

const loadingGif = `${process.env.PUBLIC_URL}/image/loading.gif`;

const FeedPage: React.FC = () => {

    const [feed, setFeed] = useState<(Post & RecipeDetailsResponse & GetUserResponse)[]>([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try{
                const jwtToken = localStorage.getItem("AccessToken");
                if (jwtToken){
                    const sentFeed = await getFeed()
                    let posts : (Post & RecipeDetailsResponse & GetUserResponse)[] = []
                    if(!sentFeed.data){
                        return
                    }
                    for (let post of sentFeed.data){
                        let userInfo = await getUserBySub(post.user_id)
                        let postLikeState = await getIsPostLiked(post.id)
                        if(userInfo.data){
                        posts.push({
                            ...userInfo.data[0],
                            ...post,
                            is_liked: postLikeState.data || false
                        })
                        }
                    }
                    setFeed(posts)
                    setIsLoading(false)
                }
            }catch (error){
                console.error("Error fetching user feed:", error);
            }
        }
        fetchFeed()
    }, [])

    return (
        <Box marginTop="30px" width="100%">
            <Box display="flex" marginBottom="75px" width="100%">
                <SearchBar />
            </Box>
            {isLoading ? (
                <Box
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    }}
                >
                    <img
                    src={loadingGif}
                    alt="loading-gif"
                    style={{ width: 300, height: 250 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 600, pt: "-50px" }}>
                    Preparing Recommendations...
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {feed.map((feedEl, index) => (
                        <Box key={index} display="flex" justifyContent="center" paddingY="20px">
                            <FeedCard {...feedEl}/>
                        </Box>
                    ))}
                </Box>
            )
            }
        </Box>
  );
};

export default FeedPage;
