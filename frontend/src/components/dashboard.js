import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const API_URL = 'http://localhost:5000/api';

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    approvalRate: 0,
    averageScore: 0,
    averageLimit: 0
  });

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API_URL}/credit-analysis`, {
        withCredentials: true
      });
      
      setAnalyses(response.data);
      
      // Calcular estatísticas
      if (response.data.length > 0) {
        const totalAnalyses = response.data.length;
        
        // Simulação de taxa de aprovação (na vida real seria baseado em critérios reais)
        const approvedCount = response.data.filter(analysis => 
          (analysis.serasaScore + analysis.boaVistaScore + analysis.quodScore) / 3 > 600
        ).length;
        
        const approvalRate = (approvedCount / totalAnalyses) * 100;
        
        const totalScore = response.data.reduce((sum, analysis) => 
          sum + (analysis.serasaScore + analysis.boaVistaScore + analysis.quodScore) / 3, 0
        );
        
        const averageScore = totalScore / totalAnalyses;
        
        const totalLimit = response.data.reduce((sum, analysis) => sum + analysis.creditLimit, 0);
        const averageLimit = totalLimit / totalAnalyses;
        
        setStats({
          totalAnalyses,
          approvalRate,
          averageScore,
          averageLimit
        });
      }
    } catch (error) {
      setError('Erro ao carregar análises de crédito');
      console.error('Erro ao carregar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (analyses.length === 0) return null;

    // Dados para o gráfico de distribuição de scores
    const scoreDistribution = {
      labels: ['Serasa', 'Boa Vista', 'Quod'],
      datasets: [
        {
          data: [
            analyses.reduce((sum, a) => sum + a.serasaScore, 0) / analyses.length,
            analyses.reduce((sum, a) => sum + a.boaVistaScore, 0) / analyses.length,
            analyses.reduce((sum, a) => sum + a.quodScore, 0) / analyses.length
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

    // Dados para o gráfico de tendência de análises
    // Agrupar análises por data (simplificado para mês)
    const analysesPerMonth = {};
    analyses.forEach(analysis => {
      const date = new Date(analysis.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!analysesPerMonth[monthYear]) {
        analysesPerMonth[monthYear] = 0;
      }
      analysesPerMonth[monthYear]++;
    });

    const trendData = {
      labels: Object.keys(analysesPerMonth),
      datasets: [
        {
          label: 'Análises Realizadas',
          data: Object.values(analysesPerMonth),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }
      ]
    };

    const trendOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Tendência de Análises',
        },
      },
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Distribuição de Scores
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={scoreDistribution} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tendência de Análises
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line options={trendOptions} data={trendData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Cartões de estatísticas */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              Total de Análises
            </Typography>
            <Typography component="p" variant="h4" color="inherit">
              {stats.totalAnalyses}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon />
              <Typography variant="body2" color="inherit" sx={{ ml: 1 }}>
                Desde o início
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              Taxa de Aprovação
            </Typography>
            <Typography component="p" variant="h4" color="inherit">
              {stats.approvalRate.toFixed(1)}%
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon />
              <Typography variant="body2" color="inherit" sx={{ ml: 1 }}>
                Média geral
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              Score Médio
            </Typography>
            <Typography component="p" variant="h4" color="inherit">
              {stats.averageScore.toFixed(0)}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <PersonIcon />
              <Typography variant="body2" color="inherit" sx={{ ml: 1 }}>
                Entre todos os bureaus
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              Limite Médio
            </Typography>
            <Typography component="p" variant="h4" color="inherit">
              R$ {stats.averageLimit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon />
              <Typography variant="body2" color="inherit" sx={{ ml: 1 }}>
                Capacidade de crédito
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Gráficos */}
        <Grid item xs={12}>
          {analyses.length > 0 ? renderCharts() : (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Nenhuma análise de crédito realizada ainda
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/credit-analysis"
                sx={{ mt: 2 }}
              >
                Realizar Primeira Análise
              </Button>
            </Paper>
          )}
        </Grid>
        
        {/* Análises recentes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Análises Recentes
            </Typography>
            
            {analyses.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>CPF</TableCell>
                      <TableCell>Veículo</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Score Médio</TableCell>
                      <TableCell>Limite</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyses.slice(0, 5).map((analysis) => (
                      <TableRow key={analysis._id}>
                        <TableCell>{analysis.clientName}</TableCell>
                        <TableCell>{analysis.cpf}</TableCell>
                        <TableCell>{analysis.carModel}</TableCell>
                        <TableCell>R$ {analysis.carValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          {((analysis.serasaScore + analysis.boaVistaScore + analysis.quodScore) / 3).toFixed(0)}
                        </TableCell>
                        <TableCell>R$ {analysis.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                Nenhuma análise encontrada
              </Typography>
            )}
            
            {analyses.length > 5 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button size="small" color="primary">
                  Ver todas
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Ações rápidas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  component={RouterLink}
                  to="/credit-analysis"
                  startIcon={<AssessmentIcon />}
                >
                  Nova Análise
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Dicas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dicas para Vendedores
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DirectionsCarIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Verifique o histórico de crédito antes de negociar" 
                  secondary="Economize tempo focando em clientes com maior probabilidade de aprovação"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AttachMoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Compare taxas de juros entre diferentes bancos" 
                  secondary="Ofereça as melhores condições para seus clientes"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Oriente seus clientes sobre como melhorar o score" 
                  secondary="Clientes informados têm maior chance de aprovação futura"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}