import { Box, Container } from "@mui/material";

interface ColumnContainerProps {
  children: React.ReactNode;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ children }) => {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "95vh",
        pt: 10,
      }}
    >
      <Box sx={{ width: "40vw" }}>{children}</Box>
    </Container>
  );
};

export default ColumnContainer;
