import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Container
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ProfileForm = ({ user, onSave, darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setSnackbar({
      open: true,
      message: 'Perfil atualizado com sucesso!',
      severity: 'success'
    });
  };

  const handlePhotoUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSnackbar({
          open: true,
          message: 'Foto de perfil atualizada!',
          severity: 'success'
        });
      }
    };
    fileInput.click();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          backgroundColor: theme => theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">Meu Perfil</Typography>
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode}
                onChange={toggleDarkMode}
                icon={<LightModeIcon sx={{ color: '#f9a825' }} />}
                checkedIcon={<DarkModeIcon sx={{ color: '#5c6bc0' }} />}
              />
            }
            label={darkMode ? "Modo Escuro" : "Modo Claro"}
          />
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} display="flex" justifyContent="center" alignItems="flex-start">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    bgcolor: '#e8f5e9',
                    color: '#66bb6a',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {(formData.displayName || user?.email || "U")[0].toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '2px solid #e8f5e9',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    width: 24,
                    height: 24
                  }}
                  onClick={handlePhotoUpload}
                >
                  <PhotoCameraIcon sx={{ color: '#66bb6a', fontSize: 14 }} />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    variant="outlined"
                    size="small"
                    helperText="O email não pode ser alterado"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    placeholder="(00) 00000-0000"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 28,
                  px: 3,
                  py: 1,
                  backgroundColor: '#66bb6a',
                  '&:hover': { backgroundColor: '#5caf50' }
                }}
              >
                Salvar Alterações
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ProfileForm;