import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_URL = 'http://localhost:5000/api';

export default function CreditAnalysis({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    cpf: '',
    carModel: '',
    carValue: '',
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const steps = ['Dados do Cliente', 'Dados do Veículo', 'Análise de Crédito', 'Resultado'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatar CPF
    if (name === 'cpf') {
      const formattedCpf = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
      
      setFormData({
        ...formData,
        [name]: formattedCpf
      });
      return;
    }
    
    // Formatar valor do carro
    if (name === 'carValue') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = numericValue ? parseInt(numericValue, 10) / 100 : '';
      
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      submitAnalysis();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/credit-analysis`,
        formData,
        {
          withCredentials: true
        }
      );
      
      setAnalysisResult(response.data);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao realizar análise de crédito');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.clientName && formData.cpf && formData.cpf.length === 14;
      case 1:
        return formData.carModel && formData.carValue;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome do Cliente"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="000.000.000-00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Modelo do Veículo"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Valor do Veículo (R$)"
              name="carValue"
              value={formData.carValue ? `R$ ${formData.carValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    R$
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Analisando crédito...
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={submitAnalysis}
                sx={{ mt: 2 }}
              >
                Iniciar Análise
              </Button>
            )}
          </Box>
        );
      case 3:
        return renderAnalysisResults();
      default:
        return null;
    }
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    const scoreData = {
      labels: ['Serasa', 'Boa Vista', 'Quod'],
      datasets: [
        {
          data: [
            analysisResult.serasaScore,
            analysisResult.boaVistaScore,
            analysisResult.quodScore
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };

    const rateData = {
      labels: analysisResult.interestRates.map(rate => rate.provider),
      datasets: [
        {
          label: 'Taxa de Juros (%)',
          data: analysisResult.interestRates.map(rate => rate.rate),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const rateOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Comparativo de Taxas de Juros',
        },
      },
    };

    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Análise de crédito concluída com sucesso!
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pontuação de Crédito
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={scoreData} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Taxas de Juros
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={rateData} options={rateOptions} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumo da Análise
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Cliente:</strong> {analysisResult.clientName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>CPF:</strong> {analysisResult.cpf}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Veículo:</strong> {analysisResult.carModel}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Valor do Veículo:</strong> R$ {analysisResult.carValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Limite de Crédito:</strong> R$ {analysisResult.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Melhor Taxa:</strong> {Math.min(...analysisResult.interestRates.map(rate => rate.rate))}% ao mês
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setActiveStep(0);
              setFormData({
                clientName: '',
                cpf: '',
                carModel: '',
                carValue: '',
              });
              setAnalysisResult(null);
            }}
          >
            Nova Análise
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AssessmentIcon sx={{ mr: 1 }} /> Análise de Crédito
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent()}
        
        {activeStep !== steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid() || loading}
            >
              {activeStep === steps.length - 2 ? 'Finalizar' : 'Próximo'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}