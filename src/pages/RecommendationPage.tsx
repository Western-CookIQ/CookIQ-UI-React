import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import { MealCard } from "../components";
import { useEffect, useState } from "react";
// import { getRatedMeals } from "../api/meal";
import { getRecipeDetails } from "../api/recipe";
// import { RecipeRatingResponse } from "../types/MealResponses";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

const RecommendationPage: React.FC = () => {
  const [active, setActive] = useState(-1);
  const [recipes, setRecipes] = useState<RecipeDetailsResponse[]>([]);
  const [openCurrentPreferences, setCurrentPreferences] = useState(false);

  // RECOMMENDATION CALL
  useEffect(() => {
    const fetchData = async () => {
      const recommendedRecipesIds = [
        336098, 268463, 511497, 202416, 482681, 383088,
      ];

      const recommendedRecipesDetailsResponse: ApiResponse<RecipeDetailsResponse>[] =
        await Promise.all(
          recommendedRecipesIds.map((recipeId) => getRecipeDetails(recipeId))
        );

      const recipeDetailsArray: RecipeDetailsResponse[] =
        recommendedRecipesDetailsResponse
          .filter((response) => response.data !== undefined)
          .map((response) => response.data!);

      setRecipes(recipeDetailsArray);
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
