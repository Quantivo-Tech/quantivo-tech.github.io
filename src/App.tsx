import styled from "@emotion/styled";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  Grid2,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { DrawerAppbar } from "./components/DrawerAppbar";

const HeroBox = styled(Box)({
  backgroundImage:
    "linear-gradient(rgba(30, 136, 229, 0.7), rgba(30, 136, 229, 0.7)), url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
  height: "600px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "0 5%",
  boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.5)",
  flexDirection: "column",
});

const ButtonStyled = styled(Button)({
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

const CardStyled = styled(Card)({
  minHeight: "25%",
  textAlign: "center",
  borderRadius: "15px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.4s, box-shadow 0.4s",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
  cursor: "pointer",
});

const FooterBox = styled(Box)({
  backgroundColor: "#1E88E5",
  color: "#fff",
  padding: "2% 3%",
  textAlign: "center",
  marginTop: "auto",
  boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.3)",
});

const SectionBox = styled(Box)({
  padding: "5% 4%",
  textAlign: "left",
  background: "#ffffff",
  borderRadius: "15px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  margin: "5% auto",
  maxWidth: "1000px",
});

const MissionBox = styled(Box)({
  backgroundColor: "#1E88E5",
  color: "#ffffff",
  padding: "5%",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  display: "inline-block",
  marginTop: "5%",
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
});

const App = () => {
  const sectionsRef = useRef({});
  const [activeSection, setActiveSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

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

  const serviceImages = {
    "Inventory Management":
      "https://www.capterra.com/p/142678/Cin7-Core/screenshots/",
    "Loyalty Programs":
      "https://via.placeholder.com/400x300.png?text=Loyalty+Programs+Sample",
    "Appointment Scheduling":
      "https://via.placeholder.com/400x300.png?text=Appointment+Scheduling+Sample",
    "Task Automation":
      "https://via.placeholder.com/400x300.png?text=Task+Automation+Sample",
  };

  return (
    <>
      <DrawerAppbar />

      <HeroBox>
        <Container>
          <Typography
            variant="h2"
            component="h1"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "2.5rem",
            }}
          >
            Empowering Your Business with Seamless Automation
          </Typography>
          <Typography
            variant="h6"
            style={{
              marginTop: "20px",
              fontSize: "1.25rem",
              textAlign: "left",
            }}
          >
            At Quantivo Tech, we help local businesses thrive by offering custom
            software solutions like inventory management, loyalty programs,
            appointment scheduling, and task automation.
          </Typography>
          <ButtonStyled
            variant="contained"
            onClick={() =>{
              const services = document.getElementById("services");
              if (services) {
                services.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{ display: "block", margin: "30px auto" }}
          >
            Discover Our Services
          </ButtonStyled>
        </Container>
      </HeroBox>

      <Container id="services" style={{ padding: "5% 0" }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "5%",
          }}
        >
          Our Services
        </Typography>
        <Grid2 container spacing={6} justifyContent="center">
          {[
            "Inventory Management",
            "Loyalty Programs",
            "Appointment Scheduling",
            "Task Automation",
          ].map((service) => (
            <Grid2 key={service}>
              <CardStyled onClick={() => handleCardClick(service)}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    color="primary"
                    gutterBottom
                  >
                    {service}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: "10px" }}>
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
            </Grid2>
          ))}
        </Grid2>
      </Container>

      <SectionBox id="about">
        <Typography
          variant="h4"
          component="h2"
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
          paragraph
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
          paragraph
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
      </SectionBox>

      <SectionBox id="contact">
        <Typography
          variant="h4"
          component="h2"
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
          paragraph
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
      </SectionBox>

      <FooterBox>
        <Typography variant="body2">
          &copy; 2024 Quantivo Tech. All rights reserved.
        </Typography>
      </FooterBox>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <img
            src={serviceImages[selectedService]}
            alt={`${selectedService} Sample`}
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;
