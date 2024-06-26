import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { searchUsers } from "../api/authenication";
import {
  checkFollowingStatus,
  followUser,
  unfollowUser,
} from "../api/connections";
import { UserPreview } from "../types/AuthResponses";

interface FollowingStatus {
  [userSub: string]: boolean;
}

const ConnectionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState<UserPreview[]>([]);
  const [followingStatus, setFollowingStatus] = useState<FollowingStatus>({});

  const handleFollow = async (userSub: string) => {
    followingStatus[userSub]
      ? await unfollowUser(userSub)
      : await followUser(userSub);

    // Update the following status
    const updatedFollowingStatus = { ...followingStatus };
    updatedFollowingStatus[userSub] = !updatedFollowingStatus[userSub];
    setFollowingStatus(updatedFollowingStatus);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setUserList([]);
      setFollowingStatus({});
      return;
    }
    try {
      const fetchData = async (searchValue: string) => {
        const response = await searchUsers(searchValue);

        if (response.data?.Users === undefined) {
          return;
        }

        const promises = response.data?.Users.map(async (user) => {
          const response = await checkFollowingStatus(user.sub);
          return { [user.sub]: response.data ? response.data : false };
        });

        const results = await Promise.all(promises);

        // Combine the results into a single object
        const combinedResults: FollowingStatus = results.reduce(
          (acc, result) => ({ ...acc, ...result }),
          {}
        );

        setFollowingStatus(combinedResults);
        setUserList(response.data.Users);
      };

      fetchData(searchTerm);
    } catch (error) {
      console.error("Error fetching user list", error);
    }
  }, [searchTerm]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      height="100vh"
    >
      <TextField
        fullWidth
        label="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        sx={{
          marginBottom: "1rem",
          textAlign: "center",
          width: "1 00%",
        }}
      />
      {/* Render the list based on the search term */}
      {userList.map((user, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Typography variant="h6">{user.name}</Typography>
          <Button
            variant="contained"
            onClick={() => handleFollow(user.sub)}
            sx={{ marginLeft: "1rem" }}
          >
            {followingStatus[user.sub] ? "Unfollow" : "Follow"}
          </Button>
          {/* Add divider between users */}
          {index !== userList.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default ConnectionPage;
