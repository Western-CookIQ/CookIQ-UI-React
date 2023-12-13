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
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import { useNavigate } from "react-router-dom";
import profileImage from "../assets/Profile_Image.jpg";

const icons = [
  AssignmentOutlinedIcon,
  BarChartOutlinedIcon,
  AccountCircleOutlinedIcon,
];

const drawerWidth = 240;

const fName = "Joe";
const lName = "Smith";

interface ISidebar {
  children: React.ReactNode;
}

const Sidebar: React.FC<ISidebar> = ({ children }) => {
  const navigate = useNavigate();

  const handleItemClick = (route: any) => {
    navigate(route);
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
              src={profileImage}
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "transparent",
                ml: 1,
                mb: 0,
                mt: 2,
              }}
            />
          </ListItem>
          <ListItem sx={{ ml: 1 }}>
            <ListItemText primary={fName + " " + lName} />
          </ListItem>
        </List>

        <Divider />
        <List>
          {["Recommendations", "Feed", "Profile"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(`/${text.toLowerCase()}`)}
              >
                <ListItemIcon>{React.createElement(icons[index])}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
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
        </List>
      </Drawer>
      {children}
    </Box>
  );
};

export default Sidebar;
