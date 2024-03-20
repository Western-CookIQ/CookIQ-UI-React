import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import { MealCard } from "../components";
import { useEffect, useState } from "react";
import { getBookmarkedMeals } from "../api/meal";
import { ApiResponse } from "../types/utils";
import { getRecipeTagDetails } from "../api/recipe";
import { RecipeDetailsResponse, RecipeTagDetailsResponse, } from "../types/RecipeResponses";
import { motion } from "framer-motion";

const loadingGif = `${process.env.PUBLIC_URL}/image/loading.gif`;
const bookGif = `${process.env.PUBLIC_URL}/image/notebook.gif`;

type RecipeDetailsAndTags = RecipeDetailsResponse & {
  tags: string[];
};

const Profile: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsAndTags[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [isEmpty, setisEmpty] = useState(true);

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated for the user
      const bookmarkedResponse: ApiResponse<RecipeDetailsResponse[]> =
        await getBookmarkedMeals(localStorage.getItem("UserSub") as string);
      let bookmarkedArray: RecipeDetailsResponse[] =
        bookmarkedResponse.data!;
      if (bookmarkedArray.length === 0) {
        setisEmpty(true);
        setisLoading(false);
        return;
      }
      setisEmpty(false);
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
      
      setisLoading(false);
      setRecipes(recipeDetailsArray);
    };
    setisLoading(true);
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
          alignItems: 'center',
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}>
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
                Flipping Pages...
              </Typography>
            </Box>
            ) : isEmpty ? (
                <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  src={bookGif}
                  alt="book-gif"
                  style={{ width: 200, height: 200 }}
                />
                <Typography variant="body1" sx={{ marginTop: "15px", fontWeight: 600, pt: "-50px" }}>
                  No Bookmarks Found
                </Typography>
              </Box>
              ) : ( 
                <Grid container={active === -1} columnSpacing={4} rowSpacing={1}>
                  {recipes.map((recipe, index) => (
                    <Grid
                      item
                      xs={4}
                      key={index}
                      sx={{
                        height: "100%",
                        width: "100%",
                        marginTop: "15px",
                        display:
                          active !== -1 && active !== index ? "none" : "block",
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
                          tags={recipe.tags ? recipe.tags : []}
                          index={index}
                          type={active === index ? "full" : "preview"}
                          setActive={setActive}
                        />
                      </motion.div>
                    </Grid>
                  ))}
            </Grid>
              )}
        </Box> 
    </Box>
  );
};

export default Profile;
