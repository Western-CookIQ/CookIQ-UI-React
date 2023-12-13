import { Box, Button, Paper, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

interface IMealCard {
  type: "preview" | "full";
  index: number;
  setActive: Function;
  details: RecipeDetailsResponse;
}

const mockInstructions = [
  "Chop up some guac very finely and precisely.",
  "Use the tomatoes to make a smooth paste.",
  "Spread the paste and guac over the pancake.",
  "Add maple syrup and butter to the guac.",
  "Season with cilantro.",
  "Fold pancake in half and enjoy!",
];

const MealCard: React.FC<IMealCard> = ({ type, setActive, index, details }) => {
  return (
    <Box>
      {type === "preview" ? (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "230px",
            padding: 2,
          }}
          onClick={() => setActive(index)}
        >
          <Typography
            variant="body1"
            sx={{ width: "100%", textAlign: "center", fontWeight: 800, mb: 1 }}
          >
            {details.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <img
                src="https://www.eatingwell.com/thmb/v86G1ptq0Tk_3CDPTvpKdh2Pi7g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/57831531-73819d8ce8f5413cac42cf1c907bc37a.jpg"
                alt=""
                style={{ width: "100px", height: "auto" }}
              />
              <Box>
                <Typography>Details </Typography>
                <Typography>Cook Time: {details.minutes}</Typography>
                <Typography>Ingredients: </Typography>
                <Typography>Difficulty: </Typography>
                <Typography>Calories: {details.calories}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: "1px",
                  borderRadius: "50%",
                  borderStyle: "solid",
                  borderColor: "grey",
                  width: 20,
                  height: 20,
                  padding: "1rem",
                  marginRight: 2,
                }}
              >
                <Typography color="primary" sx={{ fontWeight: "bold" }}>
                  9.1
                </Typography>
              </Box>
              <Typography variant="body1" color="initial">
                Estimated Match
              </Typography>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30vw", height: "90vh" }}>
            <Box
              onClick={() => {
                setActive(-1);
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "15px" }} />
              <Typography variant="body1">Back</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h4" color="initial">
                {details.name}
              </Typography>
              {true ? <BookmarkBorderIcon /> : <BookmarkIcon />}
            </Box>
            <Typography variant="body1" color="initial">
              {details.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  color="initial"
                  sx={{ fontWeight: "bold" }}
                >
                  Cook Time
                </Typography>
                <Typography variant="body1" color="initial">
                  {details.minutes}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  color="initial"
                  sx={{ fontWeight: "bold" }}
                >
                  Steps
                </Typography>
                <Typography variant="body1" color="initial">
                  {details.n_steps}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  color="initial"
                  sx={{ fontWeight: "bold" }}
                >
                  Calories
                </Typography>
                <Typography variant="body1" color="initial">
                  {details.calories}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  color="initial"
                  sx={{ fontWeight: "bold" }}
                >
                  Estimated Match
                </Typography>
                <Typography variant="body1" color="primary">
                  ESTIMATED MATCH
                </Typography>
              </Box>
            </Box>
            <img
              src="https://www.eatingwell.com/thmb/v86G1ptq0Tk_3CDPTvpKdh2Pi7g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/57831531-73819d8ce8f5413cac42cf1c907bc37a.jpg"
              alt=""
              style={{ width: "20vw", height: "auto" }}
            />
            <Typography variant="h4" color="initial">
              Instructions
            </Typography>
            <ol>
              {mockInstructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MealCard;
