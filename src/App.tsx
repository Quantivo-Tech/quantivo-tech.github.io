import {
  Card,
  CardContent,
  Container,
  createTheme,
  Dialog,
  DialogContent,
  responsiveFontSizes,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { DrawerAppbar } from "./components/DrawerAppbar";
import { ButtonStyled, FooterBox, MissionBox } from "./style/StyledComponents";
import "./style/App.css";

const StyledContainer = styled(Container)({
  padding: "3% 5% 0 5%",
});

const HomeContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.7), rgba(30, 136, 229, 0.7)), url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
  boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.5)",
  height: "600px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: theme.palette.secondary.main,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

const CardStyled = styled(Card)(({ theme }) => ({
  margin: "3%",
  borderRadius: "15px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.4s, box-shadow 0.4s",
  [theme.breakpoints.up("md")]: {
    background: `linear-gradient(270deg, ${theme.palette.primary.main} 25%, ${theme.palette.secondary.main} 50%)`,
  },
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
  cursor: "pointer",
}));

const SERVICE_IMAGES = {
  "Inventory Management":
    "https://www.capterra.com/p/142678/Cin7-Core/screenshots/",
  "Loyalty Programs":
    "https://via.placeholder.com/400x300.png?text=Loyalty+Programs+Sample",
  "Appointment Scheduling":
    "https://via.placeholder.com/400x300.png?text=Appointment+Scheduling+Sample",
  "Task Automation":
    "https://via.placeholder.com/400x300.png?text=Task+Automation+Sample",
};

const App = () => {
  const sectionsRef = useRef({});
  const [activeSection, setActiveSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  let theme = createTheme({
    cssVariables: true,
    palette: {
      primary: {
        light: "#4b9fea",
        main: "#1e88e5",
        dark: "#155fa0",
        contrastText: "#fff",
      },
      secondary: {
        light: "#fff",
        main: "#ffffff",
        dark: "#b2b2b2",
        contrastText: "#333",
      },
    },
  });
  theme = responsiveFontSizes(theme);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      Object.keys(sectionsRef.current).forEach((key) => {
        const section = sectionsRef.current[key];
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 60) {
            currentSection = key;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCardClick = (service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedService("");
  };

  return (
    <ThemeProvider theme={theme}>
      <DrawerAppbar />

      <HomeContainer maxWidth={false}>
        <Typography
          variant="h2"
          style={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Empowering Your Business with Seamless Automation
        </Typography>
        <Typography
          variant="h6"
          style={{
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          At Quantivo Tech, we help local businesses thrive by offering custom
          software solutions like inventory management, loyalty programs,
          appointment scheduling, and task automation.
        </Typography>
        <ButtonStyled
          variant="contained"
          onClick={() => {
            const services = document.getElementById("services");
            if (services) {
              services.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={{ display: "block", margin: "30px auto" }}
        >
          Discover Our Services
        </ButtonStyled>
      </HomeContainer>

      <StyledContainer id="services" maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "5%",
          }}
        >
          Our Services
        </Typography>
        {[
          "Inventory Management",
          "Loyalty Programs",
          "Appointment Scheduling",
          "Task Automation",
        ].map((service) => (
          <CardStyled onClick={() => handleCardClick(service)}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                {service}
              </Typography>
              <Typography variant="body1">
                {service === "Inventory Management"
                  ? "Manage stock efficiently with our tailored inventory solutions."
                  : service === "Loyalty Programs"
                  ? "Boost customer retention with easy-to-use loyalty rewards systems."
                  : service === "Appointment Scheduling"
                  ? "Streamline booking processes with our intuitive scheduling tools."
                  : "Automate repetitive tasks, saving you time and boosting productivity."}
              </Typography>
            </CardContent>
          </CardStyled>
        ))}
      </StyledContainer>

      <StyledContainer id="about" maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="body1"
          style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
        >
          At Quantivo Tech, we believe in the power of innovation to transform
          businesses. Our journey began with a simple mission: to empower local
          businesses through seamless and effective technology solutions. Today,
          we are proud to serve a wide range of industries, helping them thrive
          in an ever-evolving digital landscape.
        </Typography>
        <Typography
          variant="body1"
          style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
        >
          We are more than just a software company—we are your strategic partner
          in growth. Our team consists of visionary developers, creative
          problem-solvers, and customer-centric professionals who are passionate
          about making technology work for you. From boosting customer loyalty
          to streamlining operations, we strive to deliver solutions that not
          only meet your needs but exceed your expectations.
        </Typography>
        <Typography
          variant="body1"
          style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
        >
          Join us as we create meaningful, lasting impacts for businesses across
          the world. We are here to help you grow, adapt, and lead in your
          industry. Let’s build the future together.
        </Typography>
        <MissionBox>
          "Innovation, Growth, Success - Empowering Your Business Every Step of
          the Way"
        </MissionBox>
      </StyledContainer>

      <StyledContainer id="contact">
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
        >
          We'd love to hear from you! Whether you have questions about our
          services, need support, or want to explore how we can help your
          business grow, reach out to us.
        </Typography>
        <ButtonStyled
          variant="contained"
          href="mailto:contact@quantivotech.com"
          className="contact-button"
        >
          Contact Us
        </ButtonStyled>
      </StyledContainer>

      <FooterBox>
        <Typography variant="body2">
          &copy; 2024 Quantivo Tech. All rights reserved.
        </Typography>
      </FooterBox>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <img
            src={SERVICE_IMAGES[selectedService]}
            alt={`${selectedService} Sample`}
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default App;
