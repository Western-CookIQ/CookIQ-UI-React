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
import { getRecipeTagDetails } from "../api/recipe";
import { RecipeDetailsResponse, RecipeTagDetailsResponse, } from "../types/RecipeResponses";
import { motion } from "framer-motion";

type RecipeDetailsAndTags = RecipeDetailsResponse & {
  tags: string[];
};

const Profile: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsAndTags[]>([]);

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

      const recipeTags: RecipeTagDetailsResponse[] =
        await Promise.all(
          bookmarkedArray.map(async (recommendation) => {
            const tagsResponse = await getRecipeTagDetails(recommendation.id);
            return tagsResponse.data as RecipeTagDetailsResponse;
          })
        );

      const recipeDetailsArray: RecipeDetailsAndTags[] =
        bookmarkedArray
          .filter((response, i) => response !== undefined) // Filter out responses with no data
          .map((response, i) => {
            return {
              ...response!,
              tags: recipeTags.find(
                (recommendation) => recommendation.id === response!.id
              )!.tags,
            };
          });

      setRecipes(recipeDetailsArray);
    };
    fetchData();
  }, []);

  return (
    <Box marginTop="30px" width="100%">
      <Box sx={{ display: active !== -1 ? "none" : "flex", mb:"30px"}}>
        <Typography variant="h4">
          Bookmarks
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
              justifyContent: active === -1 ? 'flex-start' : 'center'
            }}
          >
            <Grid container={active === -1} columnSpacing={4} rowSpacing={1} wrap = "nowrap">
              {recipes.map((recipe, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  sx={{
                    height: "100%",
                    minWidth: "250px",
                    display: active !== -1 && active !== index ? "none" : "block",
                  }}
                >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                  <MealCard
                    details={recipe}
                    matchScore={0}
                    tags={recipe.tags}
                    index={index}
                    type={active === index ? "full" : "preview"}
                    setActive={setActive}
                  />
                </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box> 
    </Box>
  );
};

export default Profile;