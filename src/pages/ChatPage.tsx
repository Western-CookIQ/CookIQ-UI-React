import {
  Box,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
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
      <Box>
        <Typography marginTop="30px" variant="h4">
          Chat
        </Typography>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText primary={message} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box display="flex" gap="10px" alignItems="center">
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
