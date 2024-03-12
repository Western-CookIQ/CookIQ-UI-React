import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

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
    <div>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      {/* Render the list based on the search term */}
      {userList.map((user, index) => (
        <Box key={index} sx={{ border: 1 }}>
          {/* Render the user information here */}
          <p>{user.name}</p>
          <p>{user.sub}</p>
          <Button variant="contained" onClick={() => handleFollow(user.sub)}>
            {followingStatus[user.sub] ? "unfollow user" : "follow user"}
          </Button>
        </Box>
      ))}
    </div>
  );
};

export default ConnectionPage;
