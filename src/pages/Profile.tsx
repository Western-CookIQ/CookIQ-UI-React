import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Slider,
  Typography,
} from "@mui/material";

import { MealCard } from "../components";
import { useEffect, useState } from "react";
import { getBookmarkedMeals } from "../api/meal";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";


const Profile: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsResponse[]>([]);

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated for the user
      const bookmarkedResponse: ApiResponse<RecipeDetailsResponse[]> =
        await getBookmarkedMeals(localStorage.getItem("UserSub") as string);
      let bookmarkedArray: RecipeDetailsResponse[] =
        bookmarkedResponse.data!;
      if (bookmarkedArray.length === 0) {
        return;
      }
      setRecipes(bookmarkedArray);
    };
    fetchData();
  }, []);

  return (
    <Box marginTop="30px" width="100%">
      <Box sx={{ display: active !== -1 ? "none" : "flex", }}>
        <Typography variant="h4">
          Profile
        </Typography> 
      </Box> 
      <Box sx={{ display: active !== -1 ? "none" : "flex", }}>
        <Typography variant="h5" sx={{ marginTop: "30px", marginBottom: "15px" }}>
          Bookmarked
        </Typography> 
      </Box>
      <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          alignItems: 'center',
          padding: '16px 0',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Grid container={active === -1} columnSpacing={1} wrap="nowrap">
              {recipes.map((recipe, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  sx={{
                    height: "250px",
                    width: "250px",
                    ml:"15px",
                    display: active !== -1 && active !== index ? "none" : "block",
                  }}
                >
                  <MealCard
                    details={recipe}
                    matchScore={0}
                    index={index}
                    type={active === index ? "full" : "preview"}
                    setActive={setActive}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      <Box sx={{ display: active !== -1 ? "none" : "flex", }}>
        <Typography variant="h5">
          Likes
        </Typography> 
      </Box> 
    </Box>
  );
};

export default Profile;