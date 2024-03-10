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

const FeedPage: React.FC = () => {

    const [feed, setFeed] = useState<(Post & RecipeDetailsResponse & GetUserResponse)[]>([])

    useEffect(() => {
        async function fetchFeed() {
            try{
                const jwtToken = localStorage.getItem("AccessToken");
                if (jwtToken){
                    const sentFeed = await getFeed()
                    if (sentFeed.data){
                        setFeed(sentFeed.data)
                    }
                }
            }catch (error){
                console.error("Error fetching user feed:", error);
            }
        }
        fetchFeed()
    }, [])

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