import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Link as MuLink,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { RegisterResponse } from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { useNavigate } from "react-router-dom";
import { ColumnContainer, PasswordField } from "../components";
import { Link } from "react-router-dom";

import { register } from "../api/authenication";
const cookIQLogo = `${process.env.PUBLIC_URL}/image/CookIQ_Logo_Text.png`;

function Credentials(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"By clicking up Sign Up, you agree to the "}
      <MuLink color="inherit" href="#">
        Privacy Policy
      </MuLink>
      {" & "}
      <MuLink color="inherit" href="#">
        Terms of Service
      </MuLink>
    </Typography>
  );
}
const SignUpPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const registerResponse: ApiResponse<RegisterResponse> = await register(
      data.get("email") as string,
      data.get("password") as string,
      data.get("firstName") as string,
      data.get("lastName") as string
    );

    if (registerResponse.data) {
      navigate("/confirmation", {
        state: {
          Username: registerResponse.data.Username,
          Email: data.get("email") as string,
        },
      });
    } else if (registerResponse.error) {
      console.error(registerResponse.error);
      setShowError(true);
    }
  };

  return (
    <ColumnContainer>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setShowError(false)}
        open={showError}
        autoHideDuration={3000}
      >
        <Alert
          severity="error"
          onClose={() => setShowError(false)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          Unable to signup.
        </Alert>
      </Snackbar>
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
          ml: 3,
          mt: 12,
        }}
      >
        Create your account
      </Typography>
      <Container component="form" onSubmit={handleSubmit} sx={{ w: "5vw" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          placeholder="First Name"
          name="firstName"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          placeholder="Last Name"
          name="lastName"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
        />
        <PasswordField
          password={password}
          setPassword={setPassword}
          name="password"
          placeholder="Password"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ my: 3 }}>
          Sign Up
        </Button>
      </Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "full",
          flexWrap: "nowrap",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <Typography variant="body2" color="initial">
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              fontWeight: "bolder",
              textDecoration: "none",
              color: "#6AB089",
            }}
          >
            Sign in here!
          </Link>
        </Typography>
      </Box>
      <Divider
        sx={{
          width: "100%",
          my: 4,
        }}
      ></Divider>
      <Credentials sx={{ mt: 5 }} />
    </ColumnContainer>
  );
};

export default SignUpPage;
