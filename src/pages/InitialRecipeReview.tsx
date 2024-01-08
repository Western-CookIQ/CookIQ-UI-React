import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Rating } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getRecipeDetails } from "../api/recipe"; //All recipe details
import { ApiResponse } from "../types/utils";
import { RecipeDetailsResponse } from "../types/RecipeResponses";


//https://mui.com/material-ui/material-icons/

interface Recipe {
  id: number;
  name: string;
  description: string;
}

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
  // const userSub = localStorage.getItem("UserSub"); //userID in Cognito and DB

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

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Typography component="h1" variant="h6" sx={{ textAlign: "left" }}>
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
            <div style={{ flex: 1, background: "#f0f0f0" }}>{"picture"}</div>
          </Card>
        ))}
      </div>

      <div style={{ position: "relative", bottom: 0 }}>
        <Button
          onClick={handlePrev}
          style={{
            backgroundColor: "#6AB089", // Blue color
            color: "#fff", // White text
            borderRadius: 18, // Rounded corners
            margin: 8,
          }}
        >
          <ArrowBackIosIcon />
        </Button>
        <Button
          onClick={handleNext}
          style={{
            backgroundColor: "#6AB089", // Blue color
            color: "#fff", // White text
            borderRadius: 18, // Rounded corners
            margin: 8,
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
        <Button
          href="/#"
          style={{
            backgroundColor: "#6AB089", // Blue color
            color: "#fff", // White text
            borderRadius: 18, // Rounded corners
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
