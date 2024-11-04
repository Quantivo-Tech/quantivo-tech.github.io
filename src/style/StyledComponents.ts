import { Box, Button, Card, styled } from "@mui/material";

export const StyledBox = styled(Box)({
  backgroundColor: "#fff",
  color: "#333",
  borderRadius: "15px",
  margin: "5% auto",
});

export const MissionBox = styled(StyledBox)({
  display: "flex",
  justifyItems: "center",
  gap: "200px",
  maxWidth: "500px",
  backgroundColor: "#1E88E5",
  color: "#ffffff",
  padding: "5%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  marginTop: "5%",
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
});
