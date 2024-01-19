import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ChangeEvent, useRef, useState } from "react";

import {
  ConfirmationResponse,
  ResendConfirmationResponse,
} from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { ColumnContainer, PasswordField } from "../components";
import {
  resendConfirmationCode,
  confirmation,
  forgotPasswordConfirmation,
} from "../api/authenication";
const cookIQLogo = `${process.env.PUBLIC_URL}/image/CookIQ_Logo_Text.png`;

const ConfirmationCodePage: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  );
  const [password, setPassword] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 6 }, () => null)
  );

  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state.type ? "password" : "email";

  const handleCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newCode = event.target.value;

    // Set the new code in the state
    setConfirmationCode((prevCode) => {
      prevCode[index] = newCode;
      return prevCode;
    });

    // Move to the next input box
    const nextIndex = index + 1;
    if (nextIndex < 6 && newCode !== "") {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleInputFocus = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.select();
    }
  };

  const handleConfirmCode = async () => {
    const code = confirmationCode.join("");

    if (type === "email" && code.length === 6) {
      const confirmationResponse: ApiResponse<ConfirmationResponse> =
        await confirmation(location.state.Username, code);

      confirmationResponse.data?.$metadata.httpStatusCode === 200
        ? navigate("/")
        : Promise.reject(
            new Error(
              `HTTP error! Status: ${confirmationResponse.data?.$metadata.httpStatusCode}`
            )
          );
    } else if (type === "password" && code.length === 6 && password !== "") {
      const confirmationResponse: ApiResponse<ConfirmationResponse> =
        await forgotPasswordConfirmation(
          location.state.Username,
          code,
          password
        );

      confirmationResponse.data?.$metadata.httpStatusCode === 200
        ? navigate("/")
        : Promise.reject(
            new Error(
              `HTTP error! Status: ${confirmationResponse.data?.$metadata.httpStatusCode}`
            )
          );
    }
  };

  const handleResendCode = async () => {
    const resendConfirmationReponse: ApiResponse<ResendConfirmationResponse> =
      await resendConfirmationCode(location.state.Username);

    if (resendConfirmationReponse.error) {
      console.error(resendConfirmationReponse.error);
    }

    // resendConfirmationReponse.data?.$metadata.httpStatusCode === 200
    //     ? navigate("/passwordConfirmation")
    //     : Promise.reject(
    //         new Error(
    //           `HTTP error! Status: ${resendConfirmationReponse.data?.$metadata.httpStatusCode}`
    //         )
    //       );
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
          mt: 5,
          width: "full",
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        {type === "password"
          ? "Let's Reset Your Password"
          : "Verify Your Email"}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        We emailed you a six digit email code to {location?.state?.Username}.
        Enter the code below to confirm your email address.
      </Typography>
      <Box>
        <Box
          sx={{
            display: "flex",
            my: type === "email" ? 10 : 5,
            justifyContent: "center",
          }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <TextField
              key={index}
              type="text"
              inputRef={(ref) => (inputRefs.current[index] = ref)}
              variant="outlined"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleCodeChange(event, index)
              }
              inputProps={{ maxLength: 1, style: { fontSize: "45px" } }}
              onFocus={() => handleInputFocus(index)}
              sx={{
                width: "4rem",
                marginRight: "1rem",
              }}
            />
          ))}
        </Box>
        {type === "password" && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Please enter a new password below.
            </Typography>
            <PasswordField
              password={password}
              setPassword={setPassword}
              name="password"
              placeholder="New Password"
            />
          </Box>
        )}
        <Button variant="contained" fullWidth onClick={handleConfirmCode}>
          {type === "password" ? "Reset Password" : "Verify Code"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "full",
          flexWrap: "nowrap",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <Typography variant="body2" color="initial">
          Didn't receive a code?{" "}
          <Link
            onClick={handleResendCode}
            style={{
              cursor: "pointer",
              fontWeight: "bolder",
              textDecoration: "none",
              color: "#6AB089",
            }}
          >
            Resend Code!
          </Link>
        </Typography>
      </Box>
    </ColumnContainer>
  );
};

export default ConfirmationCodePage;
