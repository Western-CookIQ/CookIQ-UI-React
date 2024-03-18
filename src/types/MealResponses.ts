export type RecipeRatingResponse = {
  recipe_id: number;
  rating: number;
};

export type MealResponses = {
  recipe_id: number;
  rating: number;
  is_cooked: boolean;
  is_bookmarked: boolean;
};
