import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ColumnContainer } from "../components";
import { ForgotPasswordResponse } from "../types/AuthResponses";
import { forgotPassword } from "../api/authenication";
import { ApiResponse } from "../types/utils";
const cookIQLogo = `${process.env.PUBLIC_URL}/image/CookIQ_Logo_Text.png`;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const forgotPasswordResponse: ApiResponse<ForgotPasswordResponse> =
      await forgotPassword(data.get("email") as string);

    if (forgotPasswordResponse.error) {
      console.error(forgotPasswordResponse.error);
    } else {
      forgotPasswordResponse.data?.$metadata.httpStatusCode === 200
        ? navigate("/passwordCodeConfirmation", {
            state: { Username: data.get("email") as string },
          })
        : Promise.reject(
            new Error(
              `HTTP error! Status: ${forgotPasswordResponse.data?.$metadata.httpStatusCode}`
            )
          );
    }
  };

  return (
    <ColumnContainer>
      <Box
        sx={{
          width: "inherit",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "2rem",
        }}
      >
        <img
          src={cookIQLogo}
          alt="Logo"
          style={{ width: "180px", height: "auto" }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          width: "full",
          textAlign: "left",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Forgot your password?
      </Typography>
      <Typography variant="body2">
        No problem, please enter your details below to reset your password.
      </Typography>
      <Box component={"form"} onSubmit={handleSubmit} sx={{ my: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          placeholder="Email"
          name="email"
          autoComplete="email"
        />
        <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
          Send Reset Code
        </Button>
      </Box>
      <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          textDecoration: "none",
          color: "inherit",
          marginTop: "3rem",
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "15px" }} />
        <Typography variant="body2" component="span" sx={{ marginLeft: "8px" }}>
          Back to log in
        </Typography>
        <Button variant="text" color="secondary"></Button>
      </Link>
    </ColumnContainer>
  );
};

export default ForgotPasswordPage;
