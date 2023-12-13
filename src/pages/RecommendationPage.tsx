import { Box, Button, Grid, Typography } from "@mui/material";
import { MealCard } from "../components";
import { useEffect, useState } from "react";
import { getRatedMeals } from "../api/meal";
import { getRecipeDetails } from "../api/recipe";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

const RecommendationPage: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsResponse[]>([]);

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated
      const ratedRecipes: ApiResponse<RecipeRatingResponse[]> =
        await getRatedMeals(localStorage.getItem("UserSub") as string);

      // TODO: MAKE REQUEST TO MODEL HERE!

      // Sort based on highest rating

      const recommendedRecipesIds = [
        336098, 268463, 511497, 202416, 482681, 383088,
      ];

      const recommendedRecipesDetailsResponse: ApiResponse<RecipeDetailsResponse>[] =
        await Promise.all(
          recommendedRecipesIds.map((recipeId) => getRecipeDetails(recipeId))
        );

      const recipeDetailsArray: RecipeDetailsResponse[] =
        recommendedRecipesDetailsResponse
          .filter((response) => response.data !== undefined) // Filter out responses with no data
          .map((response) => response.data!); // Use ! to assert that data is present (after filtering)

      setRecipes(recipeDetailsArray);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: active !== -1 ? "none" : "flex",
          my: 4,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Recommendations</Typography>
        <Button variant="contained">Update Preferences</Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid container={active === -1} columnSpacing={4} rowSpacing={1}>
          {recipes.map((recipe, index) => (
            <Grid
              item
              xs={4}
              key={index}
              sx={{
                height: "250px",
                width: "100%",
                display: active !== -1 && active != index ? "none" : "block",
              }}
            >
              <MealCard
                details={recipe}
                index={index}
                type={active === index ? "full" : "preview"}
                setActive={setActive}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default RecommendationPage;
