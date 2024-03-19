import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Divider, Avatar } from "@mui/material";
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

const properCase = (str: string): string => {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
};

const SearchBar: React.FC = () => {
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

  console.log(userList)

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      height="0vh"
      width="100%"
    >
      <TextField
        fullWidth
        label="Search for Friends to Follow!"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        sx={{
          marginBottom: "0.5rem",
          textAlign: "center",
          width: "100%",
        }}
      />
      {/* Render the list based on the search term */}
      {userList.map((user, index) => (
        <Box
         zIndex={1} // render above all else
         bgcolor="white"
          key={index}
          sx={{
            marginBottom: "0.5rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
                alt="Profile Image"
                src={user.profile_picture}
                sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "transparent",
                    marginRight: "1rem"
                }}
            />
            <Typography variant="h6" sx={{flex: 1}}>{properCase(user.name)}</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => handleFollow(user.sub)}
            sx={{ alignItems: "right" }}
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

export default SearchBar;
