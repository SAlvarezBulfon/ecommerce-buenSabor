import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import BenefitsSection from './BenefitsSection';
import TestimonialsSection from './TestimonialsSection';
import ContactSection from './ContactSection';
import AboutUsSection from './AboutUsSection';

const Main: React.FC = () => {
  return (
    <div>
      <Container sx={{ my: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Buen Sabor: Deliciosa Comida Rápida
            </Typography>
            <Typography variant="body1" paragraph>
              Disfruta de una amplia variedad de comidas rápidas deliciosas entregadas directamente a tu puerta.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src="https://plus.unsplash.com/premium_photo-1713793236003-bf10d934825e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Comida Rápida" style={{ width: '100%', height: 'auto', borderRadius: '1rem' }} />
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ my: 4 }}>
        <BenefitsSection />
      </Box>
      <Container sx={{ my: 4 }}>
        <TestimonialsSection />
      </Container>
      <Box sx={{ my: 4 }}>
        <AboutUsSection />
      </Box>
      <Container sx={{ my: 4 }}>
        <ContactSection />
      </Container>
    </div>
  );
};

export default Main;
