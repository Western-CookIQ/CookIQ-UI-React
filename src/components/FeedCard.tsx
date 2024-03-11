import { Box, Paper, Typography, Avatar, IconButton } from "@mui/material";
import {StarRate, StarHalf, Favorite, FavoriteBorder} from '@mui/icons-material';
import { useState } from "react";

import { Post } from "../types/PostResponses";
import { GetUserResponse } from "../types/AuthResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses"

const FeedCard: React.FC<Post & GetUserResponse & RecipeDetailsResponse> = ({ fName: firstName, lName: lastName, name: recipeName, num_likes : prevNumLikes, isLiked: prevLiked, description, picture, rating}) => {

    const [isLiked, setIsLiked] = useState<boolean>(prevLiked);
    const [numLikes, setNumLikes] = useState<number>(+prevNumLikes);

    const stars = []
    for (let i=0; i<Math.floor(rating); i++){
        stars.push(<StarRate fontSize="small" style={{color: "orange"}} key={i}/>)
    }
    if ((rating % 1) !== 0){
        stars.push(<StarHalf fontSize="small" style={{color: "orange"}} key={-1}/>)
    }

    function handleLikeEvent() {
        if (isLiked){
            setNumLikes(numLikes - 1)
            setIsLiked(false)
        }
        else{
            setNumLikes(numLikes + 1)
            setIsLiked(true)
        }
    }

    return (
        <Box>
            <Paper
            elevation={2}
            sx={{
              width: "30vw",
              height: "40vh",
              borderRadius: "10px",
            }}>
                {/* Title */}
                <Box height="20%" display="flex" alignContent="center" alignItems="center" padding="0px 10px">
                    <Avatar
                        alt="Profile Image"
                        src={picture}
                        sx={{
                            width: 50,
                            height: 50,
                            backgroundColor: "transparent",
                            mr: 1,
                        }}
                    />
                    <Typography fontWeight="bold">
                        {`${firstName} ${lastName} `}
                    </Typography>
                    &nbsp;made&nbsp;
                    <Typography fontWeight="bold">
                        {`${recipeName}`}
                    </Typography>
                </Box>
                {/* Image */}
                <Box height="60%">
                    <img
                        src="https://www.eatingwell.com/thmb/hXX1-sWEUFqqCt1jgiI3B9tymZU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Slowcooker-Bean-Kale-and-Barley-Soup-nopinto-2000-43fa55e856f2462a9bb5f2077d2a7587.jpg"
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "fill", opacity: "0.8"}}
                        loading="lazy"
                    />
                </Box>
                {/* Description + Info */}
                <Box height="20%" display="flex" justifyContent="space-between" padding="0px 10px">
                    <Box display="flex" alignContent="center" alignItems="center">
                        <Typography fontWeight="bold" display="inline">
                            {`${firstName}'s Rating:`}
                        </Typography>
                        {/* Stars */}
                        {stars}
                    </Box>
                    <Box display="flex" alignContent="center" alignItems="center">
                        <Typography fontWeight="bold">
                            {`${numLikes} Likes:`}
                        </Typography>
                        <IconButton onClick={handleLikeEvent}>
                            {isLiked ? 
                                <Favorite style={{color: "red"}} /> :
                                <FavoriteBorder style={{color: "red"}} />
                            }
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default FeedCard;