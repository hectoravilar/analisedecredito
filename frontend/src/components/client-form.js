import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ptBR from 'date-fns/locale/pt-BR';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ClientForm({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    cpf: '',
    birthDate: null,
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    fipeValue: '',
    vehicleValue: '',
    downPayment: '',
    externalCredentialId: ''
  });
  const [availableCredentials, setAvailableCredentials] = useState([]);
  const [step, setStep] = useState(1);

  // Buscar credenciais disponíveis ao carregar o componente
  React.useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get(`${API_URL}/external-credentials`, {
          withCredentials: true
        });
        setAvailableCredentials(response.data);
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
      }
    };

    fetchCredentials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      birthDate: date
    }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Converte para formato de moeda
    const formattedValue = numericValue ? 
      (parseInt(numericValue, 10) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '';
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    if (value.length <= 11) {
      // Formata o CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    setFormData(prev => ({
      ...prev,
      cpf: value
    }));
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Preparar dados para envio
      const dataToSubmit = {
        ...formData,
        // Converter valores de moeda para números
        fipeValue: parseFloat(formData.fipeValue.replace(/[^\d,]/g, '').replace(',', '.')),
        vehicleValue: parseFloat(formData.vehicleValue.replace(/[^\d,]/g, '').replace(',', '.')),
        downPayment: parseFloat(formData.downPayment.replace(/[^\d,]/g, '').replace(',', '.'))
      };
      
      const response = await axios.post(`${API_URL}/client-data`, dataToSubmit, {
        withCredentials: true
      });
      
      setSuccess('Dados do cliente cadastrados com sucesso!');
      setFormData({
        clientName: '',
        cpf: '',
        birthDate: null,
        vehicleModel: '',
        vehicleYear: new Date().getFullYear(),
        fipeValue: '',
        vehicleValue: '',
        downPayment: '',
        externalCredentialId: ''
      });
      setStep(1);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao cadastrar dados do cliente');
      console.error('Erro ao cadastrar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerar anos para o select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
            Cadastro de Cliente
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Dados do Cliente
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="clientName"
                    label="Nome do Cliente"
                    fullWidth
                    required
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="cpf"
                    label="CPF"
                    fullWidth
                    required
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    inputProps={{ maxLength: 14 }}
                    placeholder="000.000.000-00"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Data de Nascimento"
                    value={formData.birthDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    maxDate={new Date()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="externalCredentialId"
                    label="Credencial Externa"
                    fullWidth
                    value={formData.externalCredentialId}
                    onChange={handleChange}
                    helperText={
                      availableCredentials.length === 0 
                        ? "Nenhuma credencial cadastrada. Adicione uma em 'Credenciais Externas'." 
                        : "Selecione a credencial para consulta"
                    }
                  >
                    {availableCredentials.map((credential) => (
                      <MenuItem key={credential._id} value={credential._id}>
                        {credential.platform} - {credential.username}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextStep}
                    disabled={!formData.clientName || !formData.cpf || !formData.birthDate}
                  >
                    Próximo
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Dados do Veículo
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="vehicleModel"
                    label="Modelo do Veículo"
                    fullWidth
                    required
                    value={formData.vehicleModel}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="vehicleYear"
                    label="Ano do Veículo"
                    fullWidth
                    required
                    value={formData.vehicleYear}
                    onChange={handleChange}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="fipeValue"
                    label="Valor Tabela FIPE"
                    fullWidth
                    required
                    value={formData.fipeValue}
                    onChange={handleCurrencyChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="vehicleValue"
                    label="Valor do Veículo"
                    fullWidth
                    required
                    value={formData.vehicleValue}
                    onChange={handleCurrencyChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="downPayment"
                    label="Valor da Entrada"
                    fullWidth
                    required
                    value={formData.downPayment}
                    onChange={handleCurrencyChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrevStep}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !formData.vehicleModel || !formData.fipeValue || !formData.vehicleValue || !formData.downPayment}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}