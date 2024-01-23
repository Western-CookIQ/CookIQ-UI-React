import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Rating } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { getRecipeDetails } from "../api/recipe"; //All recipe details
import { postMealRating } from "../api/meal";
import { updateUser } from "../api/user";
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";
import { useNavigate } from "react-router-dom";


//https://mui.com/material-ui/material-icons/

const recipeIds = [486261, 486641, 495271, 501408, 493413]; //Static

function toProperCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}

// const PREFIXED_MEALS_ID = [486261, 486641, 495271, 501408, 493413];
//mexican stack up
//moist delicious banana nut bread
//spinach and cheese stuffed chicken breast
//2 ingredients eggs banana pancakes
//loaded potato and buffalo chicken casserole


const InitialRecipeReview: React.FC = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [recipes, setRecipes] = useState<RecipeDetailsResponse[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [openDialog, setOpenDialog] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    // get initial review recipe details
    const recommendedRecipesDetailsResponse: ApiResponse<RecipeDetailsResponse>[] =
      await Promise.all(
        recipeIds.map((recipeId) => getRecipeDetails(recipeId))
      );

    const recipeDetailsArray: RecipeDetailsResponse[] =
      recommendedRecipesDetailsResponse
        .filter((response) => response.data !== undefined) // Filter out responses with no data
        .map((response) => response.data!); // Use ! to assert that data is present (after filtering)

    setRecipes(recipeDetailsArray);
    };
    fetchData();
  }, []);

  const handleNext = () => {
    setScrollIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const handlePrev = () => {
    setScrollIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  const handleRatingChange = (recipeId: number, value: number | null) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [recipeId]: value !== null ? value : 3.5, //default to 3.5 when user does not make selection
    }));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDone = async () => {
    let UserSub = localStorage.getItem("UserSub") as string
    // Iterate through recipes and post ratings
    for (const recipe of recipes) {
      const ratingValue = ratings[recipe.id] || 3.5; // Default to 3.5 if not rated
      await postMealRating(UserSub, recipe.id, false, ratingValue, false); //post the meal with its rating, id, and related user
    }

    //Update the userFlag to indicate that is_First_Login is FALSE
    try {
      // await updateUser(UserSub, false);
    } catch (error) {
      console.error("Error updating user:", error);
    }

    navigate("/recommendations")
  };

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
         {/* Welcome Dialog */}
         <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle component="h1" variant="h6" sx={{ fontSize: "2em", textAlign: "center",  fontWeight: 'bold', color: '#6AB089'}}>Discover Your Palette</DialogTitle>
        <DialogContent style={{textAlign: "center"}}>
          <Typography>
          To begin your CookIQ journey, we need to get to know your taste preferences. Take a moment to 
          rate the following meals – it should only take a minute. Your ratings will help us understand your 
          preferences, ensuring that the meal recommendations are tailored just for you.
          <br />
          <br /> 
          Click the arrows to navigate through the meals, and use the
          star rating to give your feedback!
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={handleDialogClose}  style={{
            backgroundColor: "#6AB089", // Blue color
            color: "#fff", // White text
            borderRadius: 18, // Rounded corners
            margin: 8,
            right: 0,
          }}>Begin</Button>
        </DialogActions>
      </Dialog>

      <Typography component="h1" variant="h6" sx={{ textAlign: "left",  fontWeight: 'bold', color: '#6AB089'}}>
        Before getting started, rate your first five meals!
      </Typography>
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s ease",
          transform: `translateX(-${scrollIndex * 100}%)`,
        }}
      >
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            style={{
              flex: "0 0 100%",
              minWidth: "100%",
              minHeight: "40vw",
              boxSizing: "border-box",
              border: "2px solid #6AB089",
              borderRadius: 8,
              display: "flex",
            }}
          >
            <CardContent
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div>
                <Typography variant="h5">{toProperCase(recipe.name)}</Typography>
                <Typography>{recipe.description}</Typography>
              </div>
              <div style={{ marginTop: "auto", fontSize: "2em" }}>
                <Typography component="legend">Rate this recipe:</Typography>
                <Rating
                  name={`recipe-rating-${recipe.id}`}
                  value={
                    ratings[recipe.id] !== undefined ? ratings[recipe.id] : null
                  }
                  onChange={(_, value) => handleRatingChange(recipe.id, value)}
                  precision={0.5} // Allow half-star increments
                />
              </div>
            </CardContent>
            <div style={{ flex: 1, background: "#f0f0f0" }}>
            <img
                src="https://www.eatingwell.com/thmb/v86G1ptq0Tk_3CDPTvpKdh2Pi7g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/57831531-73819d8ce8f5413cac42cf1c907bc37a.jpg"
                alt=""
                style={{ width: "auto", height: "40vw" }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div style={{ position: "relative", bottom: 0 }}>
        <Button
          onClick={handlePrev}
          style={{
            backgroundColor: "#6AB089", 
            color: "#fff",
            borderRadius: 18,
            margin: 8,
          }}
        >
          <ArrowBackIosIcon />
        </Button>
        <Button
          onClick={handleNext}
          style={{
            backgroundColor: "#6AB089",
            color: "#fff",
            borderRadius: 18,
            margin: 8,
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
        <Button onClick={handleDone}
          style={{
            backgroundColor: "#6AB089", 
            color: "#fff", 
            borderRadius: 18,
            margin: 8,
            position: "absolute",
            right: 0,
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default InitialRecipeReview;
