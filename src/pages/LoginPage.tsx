import {
  Button,
  TextField,
  Link as MuLink,
  Grid,
  Box,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import cookIQLogo from "../assets/CookIQ_Logo_Text.png";
import googleLogo from "../assets/googleLogo.png";
import loginBackground from "../assets/loginPageBackground.jpg";
import { LoginResponse } from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { login } from "../api/authenication";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { postUser, getUser } from "../api/user";
import { User } from "../types/UserResponse";

function Credentials(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"CookIQ Inc. "}
      <MuLink color="inherit" href="#">
        Privacy Policy
      </MuLink>
      {" & "}
      <MuLink color="inherit" href="#">
        Terms of Service
      </MuLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const loginResponse: ApiResponse<LoginResponse> = await login(
      data.get("email") as string,
      data.get("password") as string
    );

    if (loginResponse.data) {
      const decodedToken = jwtDecode(loginResponse.data.sessionToken);
      localStorage.setItem("AccessToken", loginResponse.data.sessionToken);
      localStorage.setItem("UserSub", decodedToken.sub as string);

      try {
        const userDetailsResponse: ApiResponse<User> = await getUser(
          localStorage.getItem("UserSub") as string
        );

        if (userDetailsResponse.error) {
          // the user does not exist in db
          await postUser(localStorage.getItem("UserSub") as string);
          navigate("/InitialRecipeReview");
        } else {
          // check if the user has completed onboarding
          userDetailsResponse.data?.is_first_login
            ? navigate("/InitialRecipeReview")
            : navigate("/recommendations");
        }
      } catch (error) {
        console.log(`A server side error occured: ${error}`);
      }
    }
  };

  return (
    <Grid container>
      {/* Left side (Form) */}
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: "30px",
            minHeight: "90vh",
          }}
        >
          <img
            src={cookIQLogo}
            alt="Logo"
            style={{ width: "180px", height: "auto" }}
          />
          <Typography component="h1" variant="body2" sx={{ textAlign: "left" }}>
            Get recommendations on your next home-cooked meal, post to your
            feed, and see what your friends are making.
          </Typography>
          <Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={googleLogo}
                alt="Google Logo"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              Log In With Google
            </Button>
            <Divider
              sx={{
                width: "100%",
                textAlign: "center",
                mt: 2,
                mb: 1,
              }}
            >
              <Typography
                sx={{ fontSize: "10px", fontWeight: "light", color: "grey" }}
              >
                OR
              </Typography>
            </Divider>

            <Box component="form" onSubmit={handleSubmit} sx={{ my: 0 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <EmailOutlined color="secondary" sx={{ marginRight: 1 }} />
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <LockOutlined color="secondary" sx={{ marginRight: 1 }} />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? (
                          <Visibility sx={{ fontSize: 20 }} />
                        ) : (
                          <VisibilityOff sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  width: "full",
                  display: "flex",
                  flexDirection: "row-reverse",
                  mb: 2,
                }}
              >
                <Link
                  to="/password"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography variant="body2">Forgot password?</Typography>
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
              >
                Log In
              </Button>
            </Box>
          </Box>
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
              New to CookIQ?{" "}
              <Link
                to="/register"
                style={{
                  fontWeight: "bolder",
                  textDecoration: "none",
                  color: "#6AB089",
                }}
              >
                Sign up here!
              </Link>
            </Typography>
          </Box>
          <Credentials sx={{ mt: 3 }} />
        </Box>
      </Grid>

      {/* Right side (Image) */}
      <Grid item xs={12} lg={8}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            position: "absolute",
            maxWidth: "60vw",
            alignItems: "center",
            minHeight: "95vh",
          }}
        >
          <img
            src={loginBackground}
            alt="Login Meal"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
