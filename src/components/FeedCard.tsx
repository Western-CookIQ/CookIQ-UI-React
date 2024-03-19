import { Box, Paper, Typography, Avatar, IconButton, debounce } from "@mui/material";
import {StarRate, StarHalf, StarRateOutlined, Favorite, FavoriteBorder} from '@mui/icons-material';
import { useState } from "react";

import { Post } from "../types/PostResponses";
import { GetUserResponse } from "../types/AuthResponses";
import { RecipeDetailsResponse } from "../types/RecipeResponses"
import { changeLikeStatus } from "../api/feed";

function toTitleCase(phrase: string){
    return phrase.replace(/(\w)(\w*)/g, function (_, i, r) {
        return i.toUpperCase() + (r != null ? r : "");
      }
    )
}

function formatUTCDate(d: string){

    let date = new Date(d)
    let dd = date.getDate(); 
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear(); 

    return d = (dd < 10 ? '0'+dd : dd)+'/'+(mm < 10 ? '0'+mm : mm)+'/'+yyyy

}

const FeedCard: React.FC<Post & GetUserResponse & RecipeDetailsResponse> = ({ id, fName: firstName, lName: lastName, name: recipeName, num_likes : prevNumLikes, is_liked: prevLiked, picture: profile_picture, rating, url: recipe_picture, calories, sugar, carbs, fat, sodium, minutes, upload_date_in_utc: upload_date}) => {

    const [isLiked, setIsLiked] = useState<boolean>(prevLiked);
    const [numLikes, setNumLikes] = useState<number>(+prevNumLikes);

    const nutrition = [
        {
            label: "Calories",
            value: calories,
            bg_color: "#6AB089"
        },
        {
            label: "Sugar",
            value: sugar,
            bg_color: "#F6C7B3"
        },
        {
            label: "Carbs",
            value: carbs,
            bg_color: "#CDE8E6"
        },
        {
            label: "Fat",
            value: fat,
            bg_color: "#C1BBDD"
        },
        {
            label: "Sodium",
            value: sodium,
            bg_color: "#FFABAB"
        },
        {
            label: "Minutes",
            value: minutes,
            bg_color: "#957DAD"
        },
    ]

    const stars = []
    for (let i=0; i<Math.floor(rating); i++){
        stars.push(<StarRate fontSize="small" style={{color: "orange"}} key={i}/>)
    }
    if ((rating % 1) !== 0){
        stars.push(<StarHalf fontSize="small" style={{color: "orange"}} key={-1}/>)
    }
    for (let i=0; i<Math.floor(5-rating-(rating%1)); i++){
        stars.push(<StarRateOutlined fontSize="small" style={{color: "orange"}} key={5+i}/>)
    }

    const handleLikeEvent = debounce(async function () {
        await changeLikeStatus(id, !isLiked)
        if (isLiked){
            setNumLikes(numLikes - 1)
        }
        else{
            setNumLikes(numLikes + 1)
        }
        setIsLiked(!isLiked)
    }, 300)

    return (
        <Box>
            <Paper
            elevation={3}
            style={{
              width: "500px",
              height: "650px",
              borderRadius: "20px"
            }}>
                {/* Image */}
                <Box height="70%">
                    <img
                        src={recipe_picture}
                        alt={recipeName + "photo"}
                        style={{ width: "100%", height: "100%", objectFit: "fill", borderTopLeftRadius: "20px", borderTopRightRadius: "20px"}}
                        loading="lazy"
                    />
                </Box>
                <Box height={"30%"} padding={1.5} borderRadius={"0 0 20px 20px"}>
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} height={"100%"}>
                        <Box display="flex" flexWrap={"initial"}>
                            {nutrition.map((el, i) => {
                                return (
                                    <Typography key={i} p={0.8} m={"0px 4px 0px 0px"} borderRadius={"10px"} display={"inline"} whiteSpace={"nowrap"} bgcolor={el.bg_color} color={"#192841"} sx={{ fontSize: "0.8rem" }}>
                                        {el.value} {el.label}
                                    </Typography>
                                )
                            })}  
                        </Box>
                        <Box whiteSpace={"nowrap"}>
                            <Typography color={"#192841"} overflow={"clip"} textOverflow={"clip"} sx={{ fontSize: "1.5rem", fontWeight: 600, textOverflow: "ellipsis"}}>
                                {toTitleCase(recipeName)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent={"space-between"}>
                            <Box display={"flex"}>
                                <Avatar
                                    alt="Profile Image"
                                    src={profile_picture}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        backgroundColor: "transparent",
                                    }}
                                />
                                <Box marginLeft={1} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                                    <Typography color={"#192841"} fontSize={"0.9rem"}>
                                        {toTitleCase(firstName+" "+lastName)}
                                    </Typography>
                                    <Typography color={"#192841"} fontSize={"0.9rem"} mt={0.5}>
                                        {formatUTCDate(upload_date)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" alignContent="center" alignItems="center">
                                    {/* {stars} */}
                            </Box>
                            <Box display="flex" alignContent="center" alignItems="center">
                                <Typography fontWeight="bold">
                                    {`${numLikes}`}
                                </Typography>
                                <IconButton onClick={handleLikeEvent}>
                                    {isLiked ? 
                                        <Favorite style={{color: "red"}} /> :
                                        <FavoriteBorder style={{color: "red"}} />
                                    }
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default FeedCard;