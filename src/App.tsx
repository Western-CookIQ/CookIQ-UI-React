import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  LoginPage,
  ConfirmationCodePage,
  SignUpPage,
  ForgotPasswordPage,
  RecommendationPage,
  Settings,
  InitialRecipeReview,
  FeedPage,
  ConnectionPage,
} from "./pages";
import { Sidebar } from "./components";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6AB089",
    },
    secondary: {
      main: "#FF7A3C",
    },
  },
  typography: {
    h4: {
      fontSize: 32,
      fontStyle: "normal",
      fontWeight: 500,
    },
    h5: {
      color: "#546d64",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
          fontWeight: "bold",
        },
      },
    },
  },
});

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container component="main" sx={{ padding: 1 }}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/confirmation" element={<ConfirmationCodePage />} />
          <Route path="/password" element={<ForgotPasswordPage />} />
          <Route
            path="/InitialRecipeReview"
            element={<InitialRecipeReview />}
          />
          <Route
            path="/*"
            element={
              <Sidebar>
                <Routes>
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route
                    path="/recommendations"
                    element={<RecommendationPage />}
                  />
                  <Route path="/connections" element={<ConnectionPage />} />
                </Routes>
              </Sidebar>
            }
          />
        </Routes>
      </Router>
    </Container>
  </ThemeProvider>
);

export default App;
