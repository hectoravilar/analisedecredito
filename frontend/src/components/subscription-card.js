import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';

const SubscriptionCard = ({ plan, isPopular, onSelect }) => {
  // Determina quantas folhas mostrar com base no plano
  const getLeafIcons = () => {
    switch (plan.level) {
      case 'basic':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
          </Box>
        );
      case 'standard':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
          </Box>
        );
      case 'premium':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
          </Box>
        );
      case 'enterprise':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
            <SpaIcon sx={{ fontSize: 40, color: '#66bb6a' }} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      elevation={isPopular ? 8 : 2}
      sx={{
        borderRadius: 4,
        overflow: 'visible',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
        },
        border: isPopular ? '2px solid #66bb6a' : 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#66bb6a',
            color: 'white',
            py: 0.5,
            px: 2,
            borderRadius: 16,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          Mais Popular
        </Box>
      )}

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="h2" fontWeight="600" align="center" gutterBottom>
          {plan.name}
        </Typography>

        {getLeafIcons()}

        <Typography variant="h4" component="p" fontWeight="700" align="center" sx={{ mb: 2 }}>
          {plan.price}
          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
            /mês
          </Typography>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3, flexGrow: 1 }}>
          {plan.features.map((feature, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                py: 1,
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"✓"',
                  color: '#66bb6a',
                  fontWeight: 'bold',
                  mr: 1
                }
              }}
            >
              {feature}
            </Typography>
          ))}
        </Box>

        <Button
          variant={isPopular ? 'contained' : 'outlined'}
          color="primary"
          fullWidth
          onClick={() => onSelect(plan)}
          sx={{
            borderRadius: 28,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: isPopular ? '#66bb6a' : 'transparent',
            borderColor: '#66bb6a',
            '&:hover': {
              backgroundColor: isPopular ? '#5caf50' : 'rgba(102, 187, 106, 0.1)'
            }
          }}
        >
          {isPopular ? 'Começar Agora' : 'Selecionar Plano'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;