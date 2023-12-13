import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ChangeEvent, useRef, useState } from "react";

import {
  ConfirmationResponse,
  ResendConfirmationResponse,
} from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { ColumnContainer } from "../components";
import { resendConfirmationCode, confirmation } from "../api/authenication";
import cookIQLogo from "../assets/CookIQ_Logo_Text.png";

const ConfirmationCodePage: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 6 }, () => null)
  );

  const navigate = useNavigate();
  const location = useLocation();

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
    // Implement your logic for handling the confirmation code here
    const code = confirmationCode.join("");

    if (code.length === 6) {
      const confirmationResponse: ApiResponse<ConfirmationResponse> =
        await confirmation(location.state.Username, code);

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
          width: "full",
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        Verify your email
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        We emailed you a six digit email code to {location?.state?.email}. Enter
        the code below to confirm your email address.
      </Typography>
      <Box>
        <Box
          sx={{
            display: "flex",
            my: 10,
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
        <Button variant="contained" fullWidth onClick={handleConfirmCode}>
          Verify Code
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
