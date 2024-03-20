import {
  Box,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  Avatar,
} from "@mui/material";
import { useState } from "react";

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
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
        Chat
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
