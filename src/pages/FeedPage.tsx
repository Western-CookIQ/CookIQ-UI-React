import {
    Box,
    Typography,
  } from "@mui/material";

import FeedCard from "../components/FeedCard";

const FeedPage: React.FC = () => {

    const feed = [
        {
            firstName: "Nancy",
            lastName: "Finnegan",
            imageURL: "",
            rating: 5,
            prevNumLikes: 15,
            prevLiked: false,
            description: "Great recipe, literally the best I've ever had",
            recipeName: "Beef Heart Stew"
        },
        {
            firstName: "Nancy",
            lastName: "Finnegan",
            imageURL: "",
            rating: 4.5,
            prevNumLikes: 15,
            prevLiked: false,
            description: "Great recipe, literally the best I've ever had",
            recipeName: "Beef Heart Stew"
        },
        {
            firstName: "Nancy",
            lastName: "Finnegan",
            imageURL: "",
            rating: 4.5,
            prevNumLikes: 15,
            prevLiked: false,
            description: "Great recipe, literally the best I've ever had",
            recipeName: "Beef Heart Stew"
        },
        {
            firstName: "Nancy",
            lastName: "Finnegan",
            imageURL: "",
            rating: 4.5,
            prevNumLikes: 15,
            prevLiked: false,
            description: "Great recipe, literally the best I've ever had",
            recipeName: "Beef Heart Stew"
        },
    ]

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