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
  RecipeOnboardingPage,
  FeedPage,
  ConnectionPage,
  Profile,
  ChatPage,
} from "./pages";
import AuthenticatedLayout from "./types/AuthenticatedLayout";
import { AuthProvider } from "./types/AuthContext";
import ProtectedRoute from "./types/ProtectedRoute";

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

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" sx={{ padding: 1 }}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<SignUpPage />} />
              <Route path="/confirmation" element={<ConfirmationCodePage />} />
              <Route path="/password" element={<ForgotPasswordPage />} />
              <Route
                path="/*"
                element={
                  <Routes>
                    <Route
                      path="/recipe-onboarding"
                      element={
                        <ProtectedRoute>
                            <RecipeOnboardingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Settings />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/feed"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <FeedPage />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recommendations"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <RecommendationPage />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/connections"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ConnectionPage />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookmarks"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Profile />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ChatPage />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </Container>
    </ThemeProvider>
  );
};

export default App;
