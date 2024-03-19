import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { RecipeDetailsResponse } from "../types/RecipeResponses";
import { postToFeed } from "../api/feed";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import {
  postMealRating,
  getRatedMealsByRecipeId,
  updateBookmarkStatus,
} from "../api/meal";

interface IMealCard {
  type: "preview" | "full";
  index: number;
  setActive: Function;
  details: RecipeDetailsResponse;
  matchScore: number;
  tags: string[];
}

const DashedOutlineButton = styled(Button)(({ theme }) => ({
  border: "1px dashed black",
  borderRadius: theme.shape.borderRadius, // You can adjust the border radius to your preference
  padding: theme.spacing(0.5, 1), // Adjust padding as needed to make the button smaller
  color: "black",
}));

const MealCard: React.FC<IMealCard> = ({
  type,
  setActive,
  index,
  details,
  matchScore,
  tags,
}) => {
  const [isCooked, setIsCooked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const formatSteps = (steps: string) => {
    // Capitalize the first character
    let formattedString = steps.charAt(0).toUpperCase() + steps.slice(1);

    // Remove double spaces
    formattedString = formattedString.replace(/\s+/g, " ");

    // Format commas with spaces after each comma
    formattedString = formattedString.replace(/\s*,\s*/g, ", ");

    // Add a period at the end if there isn't one already
    if (formattedString.charAt(formattedString.length - 1) !== ".") {
      formattedString += ".";
    }

    return formattedString;
  };

  const handleCookedEvent = () => {
    setOpenRating(true);
  };

  const handleBookmarkEvent = async (isBookmarked: boolean) => {
    await updateBookmarkStatus(details.id, !isBookmarked);
    setIsBookmarked(!isBookmarked);
  };

  const handleRatingSubmission = async () => {
    // Send the rating to the backend
    if (rating === null) {
      return;
    }

    const recipe_id = details.id;
    const cookStatus = true;

    await postMealRating(recipe_id, rating, cookStatus);
    await postToFeed(recipe_id);

    setOpenRating(false);
    setIsCooked(cookStatus);
  };

  useEffect(() => {
    const fetchInitalState = async () => {
      const recipe_id = details.id;
      const res = await getRatedMealsByRecipeId(recipe_id);
      if (res.data) {
        setIsCooked(res.data.is_cooked);
        setIsBookmarked(res.data.is_bookmarked);
      }
    };
    fetchInitalState();
  }, [details.id]);

  useEffect(() => {
    if (type !== "preview") {
      const scrollToTop = () => {
        window.scrollTo(0, 0);
      };

      // Delay the scroll operation slightly to ensure component is mounted
      setTimeout(scrollToTop, 0);
    }
  }, [type]);

  return (
    <Box>
      <Modal open={openRating}>
        <Box>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "2vw",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenRating(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
              Congratulations!
            </Typography>
            <Typography variant="body1" color="initial">
              Please rate your experience.
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Rating
                value={rating}
                onChange={(_, value) => setRating(value)}
                precision={0.5} // Allow half-star increments
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleRatingSubmission}
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
      {type === "preview" ? (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "200px",
            borderRadius: "15px",
            padding: "0.5em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={() => setActive(index)}
        >
          <Box
            sx={{
              width: "100%",
              height: "50%",
              position: "relative",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >
            <img
              src={details.url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                opacity: "0.8",
                objectFit: "cover",
              }}
              loading="lazy"
            />
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                background: "white",
                bottom: "10px",
                left: "10px",
                height: "30px",
                padding: "0 10px",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ScheduleIcon fontSize="small" />
              <Typography
                sx={{ fontSize: "0.9rem", fontWeight: 600, ml: "3px" }}
              >
                {details.minutes} min
              </Typography>
            </Paper>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                background: "white",
                top: "10px",
                right: "10px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton onClick={() => handleBookmarkEvent(isBookmarked)}>
                {isBookmarked ? (
                  <BookmarkIcon sx={{ fontSize: "15px" }} />
                ) : (
                  <BookmarkBorderIcon sx={{ fontSize: "15px" }} />
                )}
              </IconButton>
            </Paper>
          </Box>
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "left",
              mt: 1,
              pl: 1,
            }}
          >
            <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
              {details.name.toUpperCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              textAlign: "left",
              pl: 1,
            }}
          >
            {tags.map((tag, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: "12px",
                  color: "black",
                  mr: "3px",
                  opacity: "0.5",
                }}
              >
                {tag[0].toUpperCase() + tag.slice(1)}
                {i === tags.length - 1 ? "" : ", "}
              </Typography>
            ))}
          </Box>
          <Box
            display="flex"
            sx={{ mt: 2, justifyContent: "flex-end", width: "100%" }}
          >
            <Box
              sx={{
                p: "0 4px",
                background: "#6AB089",
                borderRadius: "3px",
              }}
            >
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: "whitesmoke" }}
              >
                {Number(details.calories).toFixed(0)} calories
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                my: 2,
              }}
            >
              <DashedOutlineButton
                onClick={handleCookedEvent}
                disabled={isCooked}
              >
                Cooked
              </DashedOutlineButton>
              <IconButton onClick={() => handleBookmarkEvent(isBookmarked)}>
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>
            <Typography variant="h4" color="initial">
              {details.name}
            </Typography>
            <Typography variant="body1" color="initial" sx={{ mt: 2 }}>
              Chief's Comment: {details.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mt: 2,
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
                  {details.minutes} minute(s)
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
                  {Number(details.calories).toFixed(0)}
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
                  {matchScore === 0 ? "N/A" : `${(matchScore * 100).toFixed(1)}%`}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <img
                src={details.url}
                alt="recipe"
                style={{ width: "20vw", height: "auto" }}
              />
            </Box>
            <Typography
              variant="body1"
              color="initial"
              sx={{ fontWeight: "bold", mt: 3 }}
            >
              Instructions
            </Typography>
            <ol>
              {JSON.parse(details.steps.replace(/'/g, '"')).map(
                (step: string, i: number) => (
                  <li key={i}>{formatSteps(step)}</li>
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
