import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  Stack,
  Avatar,
  Typography,
  Paper,
} from "@mui/material";

import { ColumnContainer } from "../components";
import profileImage from "../assets/Profile_Image.jpg";
import { GetUserResponse } from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { getUserDetails } from "../api/authenication";

const Settings: React.FC = () => {
  const [fNameEdit, setFNameEdit] = useState(true);
  const [lNameEdit, setLNameEdit] = useState(true);
  const [passwordEdit, setPasswordEdit] = useState(true);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFNameChange = () => {
    if (!fNameEdit) {
      //Update server
      console.log(`Updated name to ${fName}`);
    }
    setFNameEdit(!fNameEdit);
  };
  const handleLNameChange = () => {
    if (!lNameEdit) {
      //Update server
      console.log(`Updated name to ${lName}`);
    }
    setLNameEdit(!lNameEdit);
  };
  const handlePasswordChange = () => {
    setPasswordEdit(!passwordEdit);
  };
  const handleFNameText = (event: any) => {
    setFName(event.target.value);
  };
  const handleLNameText = (event: any) => {
    setLName(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("AccessToken");

        if (jwtToken) {
          const userInfo: ApiResponse<GetUserResponse> = await getUserDetails(
            jwtToken
          );
          if (userInfo.data) {
            setFName(userInfo.data.fName);
            setLName(userInfo.data.lName);
            //setEmail(userInfo.data.email);
          }

          console.log(userInfo);
        } else {
          console.error("JWT token not found in local storage");
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ColumnContainer>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "2rem",
          bottom: "2rem",
          width: "inherit",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            width: "full",
            textAlign: "center",
            fontWeight: "bold",
            ml: 3,
            mt: 3,
          }}
        >
          Settings
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: "relative",
            padding: "15px",
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Typography variant="caption" sx={{ color: "#555555" }}>
              Profile Image
            </Typography>
            <Avatar
              alt="Profile Image"
              src={profileImage}
              sx={{
                width: 100,
                height: 100,
                backgroundColor: "transparent",
                ml: 3,
              }}
            />
          </Stack>

          <Button
            variant="text"
            component="label"
            sx={{ color: "black", mr: 2 }}
          >
            Upload Image
            <input type="file" accept="image/*" style={{ display: "none" }} />
          </Button>
          <div
            className="underline"
            style={{
              position: "absolute",
              left: "25px",
              right: "25px",
              bottom: 0,
              height: "1px",
              backgroundColor: "#A9A9A9",
            }}
          />
        </Stack>
        <Container sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            margin="normal"
            label="First Name"
            onChange={handleFNameText}
            value={fName}
            variant="standard"
            InputProps={{
              readOnly: fNameEdit ? true : false,
            }}
            fullWidth
          ></TextField>
          <Button
            variant="text"
            onClick={handleFNameChange}
            sx={{ color: "black", ml: 2 }}
          >
            {fNameEdit ? "Edit" : "Save"}
          </Button>
        </Container>
        <Container sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            margin="normal"
            label="Last Name"
            onChange={handleLNameText}
            value={lName}
            variant="standard"
            InputProps={{
              readOnly: lNameEdit ? true : false,
            }}
            fullWidth
          ></TextField>
          <Button
            variant="text"
            onClick={handleLNameChange}
            sx={{ color: "black", ml: 2 }}
          >
            {lNameEdit ? "Edit" : "Save"}
          </Button>
        </Container>
        <Container sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            margin="normal"
            label="Email"
            defaultValue="joesmith@gmail.com"
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          ></TextField>
        </Container>

        {passwordEdit ? (
          <Container sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              margin="normal"
              label="Password"
              variant="standard"
              defaultValue="Joe123"
              fullWidth
              type="password"
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              variant="text"
              onClick={handlePasswordChange}
              sx={{ color: "black", ml: 2 }}
            >
              {passwordEdit ? "Edit" : "Save"}
            </Button>
          </Container>
        ) : (
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              margin="normal"
              id="standard-required"
              label="Password"
              variant="standard"
              fullWidth
              type="password"
            />
            <TextField
              margin="normal"
              id="standard-required"
              label="Confirm Password"
              variant="standard"
              fullWidth
              type="password"
            />
            <Button
              variant="text"
              onClick={handlePasswordChange}
              sx={{ color: "black", ml: 2 }}
            >
              {passwordEdit ? "Edit" : "Save"}
            </Button>
          </Container>
        )}
        <FormGroup sx={{ alignItems: "center", mt: 2, mb: 2 }}>
          <FormControlLabel
            control={<Switch />}
            label="Enable Public Profile"
            labelPlacement="start"
          />
        </FormGroup>
      </Paper>
    </ColumnContainer>
  );
};

export default Settings;
