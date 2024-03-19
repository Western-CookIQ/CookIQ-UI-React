import React from "react";
import {
  Avatar,
  List,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";

// @ts-ignore
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from "@mui/icons-material/Logout";
import { GetUserResponse } from "../types/AuthResponses";
import { ApiResponse } from "../types/utils";
import { getUserDetails, logout } from "../api/authenication";
import { useAuth } from "../types/AuthContext";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ISidebar {
  children: React.ReactNode;
}

const Sidebar: React.FC<ISidebar> = ({ children }) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [image, setImage] = useState("");
  const { setIsAuthenticated } = useAuth();

  const navigate = useNavigate();

  const icons = [
    AssignmentOutlinedIcon,
    BarChartOutlinedIcon,
    BookmarkIcon,
    ChatIcon,
  ];

  const drawerWidth = 240;

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
            setImage(userInfo.data.picture);
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

  const handleItemClick = (route: any) => {
    navigate(route);
  };

  const LogOut = async () => {
    const jwtToken = localStorage.getItem("AccessToken");

    if (jwtToken) {
      try {
        const result = await logout(jwtToken);

        if (!result.error) {
          console.log("User logged out successfully");
        } else {
          console.error("Error logging out:", result.error);
        }
      } catch (error) {
        console.error("Unexpected error during logout:", error);
      }
    } else {
      console.error("JWT token not found in local storage");
    }
    localStorage.removeItem("AccessToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem>
            <Avatar
              alt="Profile Image"
              src={image}
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "transparent",
                ml: 1,
                mb: 0,
                mt: 2,
              }}
              onClick={() => handleItemClick(`/settings`)}
            />
            <ListItemButton
              
            ></ListItemButton>
          </ListItem>
          <ListItem sx={{ ml: 1 }}>
            <ListItemText primary={fName + " " + lName} />
          </ListItem>
        </List>

        <Divider />
        <List>
          {["Recommendations", "Feed", "Bookmarks", "Chat"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(`/${text.toLowerCase()}`)}
                >
                  <ListItemIcon>
                    {React.createElement(icons[index])}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
        <Divider sx={{ marginTop: "auto" }} />
        <List>
          <ListItem>
            <ListItemButton onClick={() => handleItemClick(`/settings`)}>
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => LogOut()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {children}
    </Box>
  );
};

export default Sidebar;
