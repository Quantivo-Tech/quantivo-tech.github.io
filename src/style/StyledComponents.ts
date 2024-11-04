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

export const FooterBox = styled(StyledBox)({
  backgroundColor: "#1E88E5",
  color: "#fff",
  padding: "2% 3%",
  textAlign: "center",
  boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.3)",
});

export const ButtonStyled = styled(Button)({
  backgroundColor: "#FFD700",
  color: "#004C99", // Dark blue text color for contrast
  marginTop: "3%",
  padding: "1rem 2rem",
  fontSize: "1.1rem",
  fontWeight: "bold",
  borderRadius: "30px",
  boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#FFC107", // Softer gold for hover
    transform: "translateY(-5px)",
    boxShadow: "0 15px 25px rgba(0, 0, 0, 0.3)",
  },
});
