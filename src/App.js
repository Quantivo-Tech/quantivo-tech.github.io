import React, { useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Card, CardContent, Grid, Box } from '@mui/material';
import styled from '@emotion/styled';
import './App.css';

const AppBarStyled = styled(AppBar)({
  backgroundColor: '#004c99',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  position: 'fixed',
  width: '100%',
  top: 0,
  zIndex: 1000,
});

const HeroBox = styled(Box)({
  backgroundImage: 'linear-gradient(rgba(0, 76, 153, 0.7), rgba(0, 76, 153, 0.7)), url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
  height: '600px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0 5%',
  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
  flexDirection: 'column',
  marginTop: '0',
  '@media (max-width: 600px)': {
    height: '400px',
    padding: '0 5%',
    marginTop: '0',
  },
});

const ButtonStyled = styled(Button)({
  backgroundColor: '#ffd700',
  color: '#004c99',
  marginTop: '3%',
  padding: '3% 6%',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '50px',
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#ffcc00',
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3)',
  },
  '@media (max-width: 600px)': {
    padding: '3% 6%',
    fontSize: '0.8rem',
  },
});

const CardStyled = styled(Card)({
  minHeight: '25%',
  textAlign: 'center',
  borderRadius: '15px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.4s, box-shadow 0.4s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  '@media (max-width: 600px)': {
    minHeight: '20%',
  },
});

const FooterBox = styled(Box)({
  backgroundColor: '#004c99',
  color: '#fff',
  padding: '5% 3%',
  textAlign: 'center',
  marginTop: 'auto',
  boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.3)',
  '@media (max-width: 600px)': {
    padding: '5% 3%',
  },
});

const SectionBox = styled(Box)({
  padding: '5% 4%',
  textAlign: 'left',
  background: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  margin: '5% auto',
  maxWidth: '1000px',
  '@media (max-width: 600px)': {
    padding: '5% 4%',
    margin: '5% auto',
  },
});

const MissionBox = styled(Box)({
  backgroundColor: '#004c99',
  color: '#ffffff',
  padding: '5%',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'inline-block',
  marginTop: '5%',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '1rem',
    padding: '5%',
  },
});

const App = () => {
  const sectionsRef = useRef({});
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      Object.keys(sectionsRef.current).forEach((key) => {
        const section = sectionsRef.current[key];
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 60) {
          currentSection = key;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <AppBarStyled position="fixed">
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'center' }}>
            Quantivo Tech
          </Typography>
          {['Home', 'Services', 'About', 'Contact'].map((section) => (
            <Button
              key={section}
              color="inherit"
              onClick={() => {
                document.getElementById(section.toLowerCase()).scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ margin: '0 auto' }}
            >
              {section}
            </Button>
          ))}
        </Toolbar>
      </AppBarStyled>

      <HeroBox>
        <Container>
          <Typography variant="h2" component="h1" style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '2.5rem', '@media (max-width: 600px)': { fontSize: '5vw' } }}>
            Empowering Your Business with Seamless Automation
          </Typography>
          <Typography variant="h6" style={{ marginTop: '20px', fontSize: '1.25rem', textAlign: 'left', '@media (max-width: 600px)': { fontSize: '4vw' } }}>
            At Quantivo Tech, we help local businesses thrive by offering custom software solutions like inventory management, loyalty programs, appointment scheduling, and task automation.
          </Typography>
          <ButtonStyled variant="contained" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} style={{ display: 'block', margin: '30px auto' }}>
            Discover Our Services
          </ButtonStyled>
        </Container>
      </HeroBox>

      <Container id="services" style={{ padding: '5% 0' }}>
        <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '5%' }}>
          Our Services
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          {['Inventory Management', 'Loyalty Programs', 'Appointment Scheduling', 'Task Automation'].map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service}>
              <CardStyled>
                <CardContent>
                  <Typography variant="h5" component="h3" color="primary" gutterBottom>
                    {service}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    {service === 'Inventory Management'
                      ? 'Manage stock efficiently with our tailored inventory solutions.'
                      : service === 'Loyalty Programs'
                      ? 'Boost customer retention with easy-to-use loyalty rewards systems.'
                      : service === 'Appointment Scheduling'
                      ? 'Streamline booking processes with our intuitive scheduling tools.'
                      : 'Automate repetitive tasks, saving you time and boosting productivity.'}
                  </Typography>
                </CardContent>
              </CardStyled>
            </Grid>
          ))}
        </Grid>
      </Container>

      <SectionBox id="about">
        <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          About Us
        </Typography>
        <Typography variant="body1" paragraph style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          At Quantivo Tech, we believe in the power of innovation to transform businesses. Our journey began with a simple mission: to empower local businesses through seamless and effective technology solutions. Today, we are proud to serve a wide range of industries, helping them thrive in an ever-evolving digital landscape.
        </Typography>
        <Typography variant="body1" paragraph style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          We are more than just a software company—we are your strategic partner in growth. Our team consists of visionary developers, creative problem-solvers, and customer-centric professionals who are passionate about making technology work for you. From boosting customer loyalty to streamlining operations, we strive to deliver solutions that not only meet your needs but exceed your expectations.
        </Typography>
        <Typography variant="body1" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          Join us as we create meaningful, lasting impacts for businesses across the world. We are here to help you grow, adapt, and lead in your industry. Let’s build the future together.
        </Typography>
        <MissionBox>
          "Innovation, Growth, Success - Empowering Your Business Every Step of the Way"
        </MissionBox>
      </SectionBox>

      <SectionBox id="contact">
        <Typography variant="h4" component="h2" gutterBottom style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          We'd love to hear from you! Whether you have questions about our services, need support, or want to explore how we can help your business grow, reach out to us.
        </Typography>
        <ButtonStyled variant="contained" href="mailto:contact@quantivotech.com" className="contact-button">
          Contact Us
        </ButtonStyled>
      </SectionBox>

      <FooterBox>
        <Typography variant="body2">&copy; 2024 Quantivo Tech. All rights reserved.</Typography>
      </FooterBox>
    </div>
  );
};

export default App;
