import { Box, Paper, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { RecipeDetailsResponse } from "../types/RecipeResponses";

interface IMealCard {
  type: "preview" | "full";
  index: number;
  setActive: Function;
  details: RecipeDetailsResponse;
  matchScore: number;
}

const MealCard: React.FC<IMealCard> = ({
  type,
  setActive,
  index,
  details,
  matchScore,
}) => {
  // details.steps: string[] = details.steps as unknown as Array<string>;
  return (
    <Box>
      {type === "preview" ? (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "230px",
            borderRadius: "20px",
          }}
          onClick={() => setActive(index)}
        >
          <Box width="100%" height="70%">
            <img
              src={details.url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: "0.8",
              }}
              loading="lazy"
            />
          </Box>
          <Box
            bgcolor="black"
            color="white"
            textAlign="center"
            whiteSpace="nowrap"
            overflow="hidden"
            position="relative"
            top="-10%"
            padding="5px 10px"
            textOverflow="ellipsis"
            maxHeight="40px"
            maxWidth="100%"
          >
            {details.name.toUpperCase()}
          </Box>
          <Box
            display="flex"
            justifyContent="space-around"
            color="#6AB089"
            position="relative"
            top="-10%"
            padding="5px 10px"
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <ScheduleIcon />
              {details.minutes} min
            </Box>
            <Box width="2px" bgcolor="#6AB089"></Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              {details.calories}
              <div></div>
              cals
            </Box>
            <Box width="2px" bgcolor="#6AB089"></Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              {details.sugar}g<div></div>
              sugar
            </Box>
          </Box>
          {/* <Typography
            variant="body1"
            sx={{ width: "100%", textAlign: "center", fontWeight: 800, mb: 1 }}
          >
            {details.name}
          </Typography> */}
          {/* <Box
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
          </Box> */}
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
                  {(matchScore * 100).toFixed(1) + "%"}
                </Typography>
              </Box>
            </Box>
            <img
              src={details.url}
              alt=""
              style={{ width: "20vw", height: "auto" }}
            />
            <Typography variant="h4" color="initial">
              Instructions
            </Typography>
            <ol>
              {JSON.parse(details.steps.replace(/'/g, '"')).map(
                (step: string, i: number) => (
                  <li key={i}>{step}</li>
                )
              )}
            </ol>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MealCard;
