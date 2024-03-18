export type OnboardRecipeResponse = {
  name: string;
  description: string;
};

export type RecipeDetailsResponse = {
  id: number;
  name: string;
  description: string;
  n_steps: number;
  minutes: number;
  steps: string;
  calories: number;
  fat: number;
  sugar: number;
  sodium: number;
  protein: number;
  sat_fat: number;
  carbs: number;
  url: string;
};
