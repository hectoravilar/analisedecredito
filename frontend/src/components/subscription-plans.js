import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  useTheme
} from '@mui/material';
import SubscriptionCard from './subscription-card';

function SubscriptionPlans() {
  const theme = useTheme();
  
  const plans = [
    {
      name: 'Básico',
      level: 'basic',
      price: 'R$ 49,90',
      features: [
        'Análise de crédito básica',
        'Até 10 consultas por mês',
        'Suporte por email',
        'Relatórios mensais'
      ],
      popular: false
    },
    {
      name: 'Padrão',
      level: 'standard',
      price: 'R$ 99,90',
      features: [
        'Análise de crédito intermediária',
        'Até 50 consultas por mês',
        'Suporte por email e chat',
        'Relatórios semanais',
        'Integração com 1 sistema'
      ],
      popular: true
    },
    {
      name: 'Premium',
      level: 'premium',
      price: 'R$ 199,90',
      features: [
        'Análise de crédito avançada',
        'Até 200 consultas por mês',
        'Suporte prioritário 24/7',
        'Relatórios diários',
        'Integração com 3 sistemas',
        'Dashboard personalizado'
      ],
      popular: false
    },
    {
      name: 'Empresarial',
      level: 'enterprise',
      price: 'R$ 399,90',
      features: [
        'Análise de crédito completa',
        'Consultas ilimitadas',
        'Suporte dedicado 24/7',
        'Relatórios em tempo real',
        'Integração com sistemas ilimitados',
        'Dashboard personalizado',
        'API exclusiva',
        'Gerente de conta exclusivo'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (plan) => {
    console.log('Plano selecionado:', plan);
    // Simulando uma assinatura bem-sucedida
    alert(`Parabéns! Você assinou o plano ${plan.name} com sucesso!`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="700" 
          sx={{ 
            mb: 2,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #81c784 30%, #66bb6a 90%)' 
              : 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Escolha o Plano Ideal
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 700, mx: 'auto' }}
        >
          Quanto mais folhas, mais recursos para sua análise de crédito.
          Escolha o plano que melhor atende às necessidades do seu negócio.
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SubscriptionCard
              plan={plan}
              isPopular={plan.popular}
              onSelect={handleSelectPlan}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Todos os planos incluem acesso ao sistema básico de análise de crédito.
          Para necessidades específicas, entre em contato com nossa equipe comercial.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Preços sujeitos a alterações. Impostos podem ser aplicados.
        </Typography>
      </Box>
    </Container>
  );
}

export default SubscriptionPlans;