import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Free',
    price: '3%',
    minFee: '$20/month',
    maxFee: null, // No maximum fee for Free Plan
    description: [
      'Unlimited active customers',
      'Basic points-based rewards system',
      'Basic analytics dashboard(e.g. points earned/redeemed)',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    price: '5%',
    minFee: '$30/month',
    maxFee: null, // No maximum fee for Professional Plan
    description: [
      'All Basic Plan Features',
      'Birthday and anniversary rewards',
      'Referral program for customer growth.',
      'Advanced analytics and reports (e.g. top customers, monthly reports only)',
      'Priority email support for faster responses'
    ],
    buttonText: 'Start now',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  {
    title: 'Enterprise',
    price: '5%',
    minFee: '$50/month',
    maxFee: '$300/month', // Cap fee for Enterprise Plan
    description: [
      'Unlimited active customers',
      'Tiered loyalty levels (e.g. Silver, Gold, Platinum)',
      'White-label branding',
      'Advanced analytics dashboard (lifetime reports)',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
];

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Select a loyalty plan that fits your business needs. 
        Whether you're just starting out or looking to take your 
        customer engagement to the next level, we've got you covered.
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
      >
        {tiers.map((tier) => (
          <Grid
            size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 4 }}
            key={tier.title}
          >
            <Card
              sx={[
                {
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                },
                tier.title === 'Professional' &&
                  ((theme) => ({
                    border: 'none',
                    background:
                      'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
                    boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                    ...theme.applyStyles('dark', {
                      background:
                        'radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))',
                      boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                    }),
                  })),
              ]}
            >
              <CardContent>
  <Box
    sx={[
      {
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      },
      tier.title === 'Professional'
        ? { color: 'grey.100' }
        : { color: '' },
    ]}
  >
    <Typography component="h3" variant="h6">
      {tier.title}
    </Typography>
    {tier.title === 'Professional' && (
      <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
    )}
  </Box>
  <Box
    sx={[
      {
        display: 'flex',
        alignItems: 'baseline',
      },
      tier.title === 'Professional'
        ? { color: 'grey.50' }
        : { color: null },
    ]}
  >
    <Typography component="h3" variant="h2">
      {tier.price}
    </Typography>
    <Typography component="h3" variant="h6">
      &nbsp; of loyalty program revenue
    </Typography>
  </Box>

  {/* Added Minimum and Maximum Fee Section */}
  <Box
    sx={[
      {
        display: 'flex',
        flexDirection: 'column',
        mt: 2,
      },
      tier.title === 'Professional'
        ? { color: 'grey.50' }
        : { color: 'text.secondary' },
    ]}
  >
    <Typography variant="body2">
      {`Minimum Fee: ${tier.minFee}`}
    </Typography>
    {tier.maxFee && (
      <Typography variant="body2">
        {`Maximum Fee: ${tier.maxFee}`}
      </Typography>
    )}
  </Box>
  {/* End of Added Section */}

  <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
  {tier.description.map((line) => (
    <Box
      key={line}
      sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
    >
      <CheckCircleRoundedIcon
        sx={[
          {
            width: 20,
          },
          tier.title === 'Professional'
            ? { color: 'primary.light' }
            : { color: 'primary.main' },
        ]}
      />
      <Typography
        variant="subtitle2"
        component={'span'}
        sx={[
          tier.title === 'Professional'
            ? { color: 'grey.50' }
            : { color: null },
        ]}
      >
        {line}
      </Typography>
    </Box>
  ))}
</CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as 'outlined' | 'contained'}
                  color={tier.buttonColor as 'primary' | 'secondary'}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
