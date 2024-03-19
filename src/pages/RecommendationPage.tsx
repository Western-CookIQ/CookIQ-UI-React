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
import { getRecipeDetails, getRecipeTagDetails } from "../api/recipe";
import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import {
  RecipeDetailsResponse,
  RecipeTagDetailsResponse,
} from "../types/RecipeResponses";
import { getCollaborativeBasedRecommendations } from "../api/recommendations";
import { CollaborativeBasedRecommedationsResponse } from "../types/RecommendationsReponses";
import { motion } from "framer-motion";

const loadingGif = `${process.env.PUBLIC_URL}/image/loading.gif`;

type RecipeDetailsAndMatch = RecipeDetailsResponse & {
  score: number;
  tags: string[] | undefined;
};

const RecommendationPage: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsAndMatch[]>([]);
  const [openCurrentPreferences, setCurrentPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    setCurrentPreferences(false);
  };

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      // get all meals which are rated for the user
      const ratedRecipesResponse: ApiResponse<RecipeRatingResponse[]> =
        await getRatedMeals();
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

      // get recipe details for each recommendation
      const recommendedRecipesDetailsResponse: ApiResponse<RecipeDetailsResponse>[] =
        await Promise.all(
          aggregatedRecommendedRecipes.map((recommendation) =>
            getRecipeDetails(recommendation.id)
          )
        );

      const recommendedRecipesTags: RecipeTagDetailsResponse[] =
        await Promise.all(
          aggregatedRecommendedRecipes.map(async (recommendation) => {
            const tagsResponse = await getRecipeTagDetails(recommendation.id);
            return tagsResponse.data as RecipeTagDetailsResponse;
          })
        );
      // merge all the recommendations into one array
      let aggregatedRecommendedRecipesTags: { id: number; tags: string[] }[] =
        [];
      recommendedRecipesTags.forEach((response) => {
        if (response === undefined) {
          return;
        }
        aggregatedRecommendedRecipesTags.push(response);
      });

      const recipeDetailsArray: RecipeDetailsAndMatch[] =
        recommendedRecipesDetailsResponse
          .filter((response, i) => response.data !== undefined) // Filter out responses with no data
          .map((response, i) => {
            return {
              ...response.data!,
              tags: aggregatedRecommendedRecipesTags.find(
                (recommendation) => recommendation.id === response.data!.id
              )!.tags,
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

      // sort the recipes by score
      filteredRecipeDetailsArray.sort((a, b) => b.score - a.score);

      // remove any duplicate recipe ids
      const seen = new Set();
      const uniqueRecipeDetailsArray = filteredRecipeDetailsArray.filter(
        (recipe) => {
          const duplicate = seen.has(recipe.id);
          seen.add(recipe.id);
          return !duplicate;
        }
      );

      setRecipes(uniqueRecipeDetailsArray);
      setIsLoading(false);
    };
    setIsLoading(true);
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
          <Box>
            <Typography variant="h5">Recommended Recipes</Typography>
            <Typography variant="body1" sx={{ opacity: "0.6" }}>
              Based on your preferences
            </Typography>
          </Box>
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
                Preparing Recommendations...
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
                    height: "250px",
                    width: "100%",
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
                      matchScore={recipe.score}
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
    </>
  );
};

export default RecommendationPage;
