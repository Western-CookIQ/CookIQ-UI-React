import {
  Box,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { getChat } from "../api/recommendations";

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    setMessages([...messages, message]);
    const res = await getChat(message);
    setResponse(res.data?.response ? res.data?.response : "");
    setIsLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100%"
      justifyContent="space-between"
    >
      <Typography marginTop="30px" variant="h4">
        Question Bot
      </Typography>
      <Box flexGrow={1} overflow="auto" maxHeight="calc(100vh-100px)">
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <Avatar></Avatar>
              <Box
                marginLeft="10px"
                padding="10px"
                bgcolor="primary.main"
                color="white"
                borderRadius="10px"
              >
                <Typography variant="body1" noWrap={false}>
                  {message}
                </Typography>
              </Box>
            </ListItem>
          ))}
          {isLoading ? (
            <ListItem
              key={2}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box padding="10px" bgcolor="lightgray" borderRadius="10px">
                <CircularProgress />
              </Box>
            </ListItem>
          ) : (
            response && (
              <ListItem
                key={2}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Box padding="10px" bgcolor="lightgray" borderRadius="10px">
                  <Typography variant="body1" noWrap={false}>
                    {response}
                  </Typography>
                </Box>
              </ListItem>
            )
          )}
        </List>
      </Box>
      <Box display="flex" gap="10px" alignItems="center" marginBottom={2}>
        <Box flexGrow={4}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            placeholder="Message FoodGPT..."
          />
        </Box>
        <Box>
          <Button onClick={handleSend} variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
