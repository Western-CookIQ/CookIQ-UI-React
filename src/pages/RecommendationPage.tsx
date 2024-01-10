import { Box, Button, Grid, Typography } from "@mui/material";
import { MealCard } from "../components";
import { useEffect, useState } from "react";
import { getRatedMeals } from "../api/meal";
import { getRecipeDetails } from "../api/recipe";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";
import { getContentBasedRecommendations } from "../api/recommendations";
import { ContentBasedRecommedationsResponse } from "../types/RecommendationsReponses";

const RecommendationPage: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsResponse[]>([]);

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated for the user
      const ratedRecipes: ApiResponse<RecipeRatingResponse[]> =
        await getRatedMeals(localStorage.getItem("UserSub") as string);

      const ratedRecipesArray: RecipeRatingResponse[] = ratedRecipes.data!;
      ratedRecipesArray.sort((a, b) => b.rating - a.rating);

      // get recommendations based on rated meals
      const recommendedRecipesResponse: ApiResponse<ContentBasedRecommedationsResponse> =
        await getContentBasedRecommendations(ratedRecipesArray[0].recipe_id);

      if (recommendedRecipesResponse.data === undefined) {
        return;
      }

      //get recipe details for recommended recipes
      const recommendedRecipesIds =
        recommendedRecipesResponse.data.recommendations.slice(0, 6);

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
                display: active !== -1 && active !== index ? "none" : "block",
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
