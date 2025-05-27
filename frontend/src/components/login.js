import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login({ onGoogleLogin }) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirecionar para o dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao conectar ao servidor');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12, mb: 8 }}>
      <Paper 
        elevation={theme.palette.mode === 'dark' ? 4 : 1} 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          {/* Logo adicionada aqui */}
          <Box sx={{ mb: 3 }}>
            <img 
              src="/images/logo.png" 
              alt="AutoCred Logo" 
              style={{ 
                height: 80, 
                maxWidth: '100%' 
              }} 
            />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="700" textAlign="center">
            Bem-vindo de volta
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Faça login para acessar sua conta
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 28,
              backgroundColor: '#66bb6a',
              '&:hover': { backgroundColor: '#5caf50' },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Entrar
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              ou
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={onGoogleLogin}
            sx={{
              py: 1.5,
              borderRadius: 28,
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
              color: theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            Continuar com Google
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Não tem uma conta?{' '}
            <RouterLink to="/register" style={{ color: '#66bb6a', textDecoration: 'none', fontWeight: 500 }}>
              Registre-se
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;