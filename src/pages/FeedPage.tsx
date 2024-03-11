import { useEffect, useState } from "react";

import {
    Box,
    Typography,
  } from "@mui/material";

import FeedCard from "../components/FeedCard";

import { getFeed } from "../api/feed";

import { Post } from "../types/PostResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses"
import { GetUserResponse } from "../types/AuthResponses";
import { getUserBySub } from "../api/authenication";

const FeedPage: React.FC = () => {

    const [feed, setFeed] = useState<(Post & RecipeDetailsResponse & GetUserResponse)[]>([])

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
                        if(userInfo.data){
                        posts.push({
                            ...userInfo.data[0],
                            ...post
                        })
                        }else{
                            posts.push({
                                fName: "Josh",
                                lName: "Rabovsky",
                                email: "joshrabovsky@gmail.com",
                                picture: "https://wallpapers.com/images/featured-full/picture-en3dnh2zi84sgt3t.jpg",
                                is_public: true,
                                ...post
                            })
                        }
                    }
                    setFeed(posts)
                }
            }catch (error){
                console.error("Error fetching user feed:", error);
            }
        }
        fetchFeed()
    }, [])

    console.log(feed)

    return (
        <Box marginTop="30px" width="100%">
            <Typography variant="h4">
                Feed
            </Typography>
            {feed.map((feedEl, index) => (
                <Box key={index} display="flex" justifyContent="center" paddingY="20px">
                    <FeedCard {...feedEl}/>
                </Box>
            ))}
        </Box>
    )
}

export default FeedPage;