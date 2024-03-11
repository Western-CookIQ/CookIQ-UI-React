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
import CloseIcon from "@mui/icons-material/Close";
import { getRatedMeals } from "../api/meal";
import { getRecipeDetails } from "../api/recipe";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";
import { getCollaborativeBasedRecommendations } from "../api/recommendations";
import { CollaborativeBasedRecommedationsResponse } from "../types/RecommendationsReponses";

type RecipeDetailsAndMatch = RecipeDetailsResponse & { score: number };

const RecommendationPage: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsAndMatch[]>([]);
  const [openCurrentPreferences, setCurrentPreferences] = useState(false);

  const handleClose = () => {
    setCurrentPreferences(false);
  };

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated for the user
      const ratedRecipesResponse: ApiResponse<RecipeRatingResponse[]> =
        await getRatedMeals(localStorage.getItem("UserSub") as string);
      let ratedRecipesArray: RecipeRatingResponse[] =
        ratedRecipesResponse.data!;
      if (ratedRecipesArray.length === 0) {
        return;
      }

      // filter the recipes based on the rating 3 and above
      ratedRecipesArray = ratedRecipesArray.filter(
        (recipe) => recipe.rating >= 3
      );

      // get all the recommendations for each rated recipe
      const recommendedRecipesResponse: CollaborativeBasedRecommedationsResponse[] =
        await Promise.all(
          ratedRecipesArray.map(async (ratedRecipe) => {
            const response = await getCollaborativeBasedRecommendations(
              ratedRecipe.recipe_id
            );
            return response.data as CollaborativeBasedRecommedationsResponse;
          })
        );

      // merge all the recommendations into one array
      let aggregatedRecommendedRecipes: { id: number; score: number }[] = [];
      recommendedRecipesResponse.forEach((response) => {
        if (response === undefined) {
          return;
        }
        aggregatedRecommendedRecipes.push(...response.recommendations);
      });

      const recommendedRecipesDetailsResponse: ApiResponse<RecipeDetailsResponse>[] =
        await Promise.all(
          aggregatedRecommendedRecipes.map((recommendation) =>
            getRecipeDetails(recommendation.id)
          )
        );

      const recipeDetailsArray: RecipeDetailsAndMatch[] =
        recommendedRecipesDetailsResponse
          .filter((response) => response.data !== undefined)
          .map((response) => {
            return {
              ...response.data!,
              score: aggregatedRecommendedRecipes.find(
                (recommendation) => recommendation.id === response.data!.id
              )!.score,
            };
          });

      // Drop any recomendations that fails this JSON.parse(details.steps.replace(/'/g, '"')) check
      const filteredRecipeDetailsArray = recipeDetailsArray.filter((recipe) => {
        try {
          JSON.parse(recipe.steps.replace(/'/g, '"'));
          return true;
        } catch (e) {
          return false;
        }
      });

      setRecipes(filteredRecipeDetailsArray);
    };
    fetchData();
  }, []);

  const [values, setValues] = useState({
    property1: [20, 50],
    property2: [30, 70],
    property3: [10, 90],
  });

  const handleSliderChange = (
    property: string,
    newValue: number | number[]
  ) => {
    setValues({
      ...values,
      [property]: newValue,
    });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Modal open={openCurrentPreferences}>
          <Box>
            <Paper
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "2vw",
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h5">Preferences</Typography>
              {Object.keys(values).map((property) => (
                <Box key={property} sx={{ width: 300 }}>
                  <Typography id="range-slider" gutterBottom>
                    {property}
                  </Typography>
                  <Slider
                    value={values[property as keyof typeof values]}
                    onChange={(event, newValue) =>
                      handleSliderChange(property, newValue)
                    }
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                  />
                </Box>
              ))}
            </Paper>
          </Box>
        </Modal>
        <Box
          sx={{
            display: active !== -1 ? "none" : "flex",
            my: 4,
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">Recommendations</Typography>
          <Button
            variant="contained"
            onClick={() => setCurrentPreferences(true)}
          >
            Update Preferences
          </Button>
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
                  matchScore={recipe.score}
                  index={index}
                  type={active === index ? "full" : "preview"}
                  setActive={setActive}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default RecommendationPage;
