import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  Stack,
  Avatar,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { ColumnContainer } from "../components";
import { GetUserResponse } from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { getUserDetails, updateUserDetails, updateProfileImage, fetchPresignedUrl, uploadFileToS3} from "../api/authenication";

const Settings: React.FC = () => {
  const [fNameEdit, setFNameEdit] = useState(true);
  const [lNameEdit, setLNameEdit] = useState(true);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false);
  const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz_PnL4lnzSDKighhjBQlZwv1M5LKWGlRgxw&usqp=CAU://png.pngtree.com/element_our/20200610/ourmid/pngtree-default-avatar-image_2237213.jpg"

  const handleFNameChange = async () => {
    if (!fNameEdit) {
      const jwtToken = localStorage.getItem('AccessToken');

      if (jwtToken) {
        const updatedFields: Partial<GetUserResponse> = {
          fName: fName,
        };
        const result = await updateUserDetails(jwtToken, updatedFields);

        if (!result.error) {
          setFName(fName);
          console.log('User updated successfully:', result.data);
        } else {
          console.error('Error updating user:', result.error);
        }
      } else {
        console.error('JWT token not found in local storage');
      }
      console.log(`Updated first name to ${fName}`);
    }
    setFNameEdit(!fNameEdit);
  };
  const handleLNameChange = async () => {
    if (!lNameEdit) {
      const jwtToken = localStorage.getItem('AccessToken');

      if (jwtToken) {
        const updatedFields: Partial<GetUserResponse> = {
          lName: lName,
        };
        const result = await updateUserDetails(jwtToken, updatedFields);

        if (!result.error) {
          setLName(lName);
          console.log('User updated successfully:', result.data);
        } else {
          console.error('Error updating user:', result.error);
        }
      } else {
        console.error('JWT token not found in local storage');
      }
      console.log(`Updated last name to ${lName}`);
    }
    setLNameEdit(!lNameEdit);
  };
  const handleFNameText = (event: any) => {
    setFName(event.target.value);
  };
  const handleLNameText = (event: any) => {
    setLName(event.target.value);
  };

  const handleImageChange = async (event: any) => {
    //get uploaded file
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    //get access token
    const jwtToken = localStorage.getItem('AccessToken');
    if (!jwtToken) {
      console.error('JWT token not found in local storage');
      return;
    }
  
    try {
      //Fetch the presigned URL
      const fileName = selectedFile.name;
      const fileType = selectedFile.type;

      //Get preSigned URL from S3
      const presignedUrlResponse = await fetchPresignedUrl(fileName, fileType);
      if (!presignedUrlResponse.data || presignedUrlResponse.error) {
        throw new Error('Failed to fetch presigned URL');
      }
      const presignedUrl = presignedUrlResponse.data;
      // Upload the file to S3 using the presigned URL
      await uploadFileToS3(presignedUrl, selectedFile);
  
      // Access the Image URL from the presignedURL
      const imageUrl = presignedUrl.split('?')[0]; 

      // Update the user profile with the image URL
      const updatedFields: Partial<GetUserResponse> = {
        picture: imageUrl,
      };
      const result = await updateProfileImage(jwtToken, updatedFields);
  
      if (result.error) {
        throw new Error(`Error updating user: ${result.error}`);
      }
  
      setImage(selectedFile ? URL.createObjectURL(selectedFile) : defaultImage);
      console.log('User updated successfully:', result.data);
    } catch (error: unknown) {
      console.error((error as Error).message || 'An error occurred');
    }
  };

  const handleSwitchChange = async (event: any) => {
    const userSub = localStorage.getItem('UserSub');
    setPublicProfileEnabled(event.target.checked);

    if (userSub) {
      const updatedFields: Partial<GetUserResponse> = {
        is_public: event.target.checked,
      };
      const accessToken = localStorage.getItem("AccessToken");
      if (accessToken && updatedFields){
          const result = await updateUserDetails(accessToken, updatedFields);
          if (!result.error) {
            console.log('User updated successfully:', result.data);
          } else {
            setPublicProfileEnabled(!event.target.checked);
            console.error('Error updating user:', result.error);
          }
      }else {
        console.error('JWT token not found in local storage');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("AccessToken");

        if (jwtToken) {
          const userInfo: ApiResponse<GetUserResponse> = await getUserDetails(jwtToken);          
          if (userInfo.data) {
            setFName(userInfo.data.fName);
            setLName(userInfo.data.lName);
            setEmail(userInfo.data.email);
            setImage(userInfo.data.picture);
            setPublicProfileEnabled(userInfo.data.is_public === 'true')
          }
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
            {image && (
              <Avatar
                alt="Profile Image"
                src={image}
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: "transparent",
                  ml: 3,
                }}
              />
            )}
        </Stack>

          <Button
            variant="text"
            component="label"
            sx={{ color: "black", mr: 2 }}
          >
            Upload Image
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange}/>
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
            value={email}
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          ></TextField>
        </Container>
        <FormGroup sx={{ alignItems: "center", mt: 2, mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={publicProfileEnabled} onChange={handleSwitchChange} />}
            label="Enable Public Profile"
            labelPlacement="start"
          />
        </FormGroup>
      </Paper>
    </ColumnContainer>
  );
};

export default Settings;
