import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ExternalCredentials({ user }) {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    password: '',
    description: ''
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await axios.get(`${API_URL}/external-credentials`, {
        withCredentials: true
      });
      setCredentials(response.data);
    } catch (error) {
      setError('Erro ao carregar credenciais externas');
      console.error('Erro ao carregar credenciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenDialog = (credential = null) => {
    if (credential) {
      setFormData({
        platform: credential.platform,
        username: credential.username,
        password: '',
        description: credential.description || ''
      });
      setEditingId(credential._id);
    } else {
      setFormData({
        platform: '',
        username: '',
        password: '',
        description: ''
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Atualizar credencial existente
        await axios.put(`${API_URL}/external-credentials/${editingId}`, formData, {
          withCredentials: true
        });
        setSuccess('Credencial atualizada com sucesso!');
      } else {
        // Criar nova credencial
        await axios.post(`${API_URL}/external-credentials`, formData, {
          withCredentials: true
        });
        setSuccess('Credencial adicionada com sucesso!');
      }
      
      fetchCredentials();
      handleCloseDialog();
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Erro ao salvar credencial');
      console.error('Erro ao salvar credencial:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta credencial?')) {
      try {
        await axios.delete(`${API_URL}/external-credentials/${id}`, {
          withCredentials: true
        });
        setSuccess('Credencial excluída com sucesso!');
        fetchCredentials();
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (error) {
        setError('Erro ao excluir credencial');
        console.error('Erro ao excluir credencial:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Credenciais Externas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Adicionar Credencial
          </Button>
        </Grid>

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

        {credentials.length > 0 ? (
          <List>
            {credentials.map((credential, index) => (
              <React.Fragment key={credential._id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={credential.platform}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Usuário: {credential.username}
                        </Typography>
                        <br />
                        {credential.description && (
                          <Typography component="span" variant="body2" color="text.secondary">
                            {credential.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleOpenDialog(credential)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(credential._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            Nenhuma credencial externa cadastrada. Clique em "Adicionar Credencial" para começar.
          </Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Credencial' : 'Adicionar Nova Credencial'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="platform"
                label="Plataforma/Site"
                fullWidth
                required
                value={formData.platform}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Nome de Usuário/Login"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Senha"
                type="password"
                fullWidth
                required={!editingId}
                value={formData.password}
                onChange={handleChange}
                helperText={editingId ? "Deixe em branco para manter a senha atual" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descrição (opcional)"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.platform || !formData.username || (!editingId && !formData.password)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}