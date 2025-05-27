import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Ícones de redes sociais
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import CopyrightIcon from '@mui/icons-material/Copyright';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #dddddd'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Suporte
            </Typography>
            <Stack spacing={1.5}>
              <Link component={RouterLink} to="/help" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Central de Ajuda
              </Link>
              <Link component={RouterLink} to="/safety" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Informações de Segurança
              </Link>
              <Link component={RouterLink} to="/options" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Opções de Financiamento
              </Link>
              <Link component={RouterLink} to="/accessibility" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Acessibilidade
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Comunidade
            </Typography>
            <Stack spacing={1.5}>
              <Link component={RouterLink} to="/dashboard" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Dashboard
              </Link>
              <Link component={RouterLink} to="/credit-analysis" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Análise de Crédito
              </Link>
              <Link component={RouterLink} to="/subscription-plans" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Planos de Assinatura
              </Link>
              <Link component={RouterLink} to="/profile" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Meu Perfil
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Sobre
            </Typography>
            <Stack spacing={1.5}>
              <Link component={RouterLink} to="/about" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Como funciona
              </Link>
              <Link component={RouterLink} to="/newsroom" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Sala de imprensa
              </Link>
              <Link component={RouterLink} to="/investors" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Investidores
              </Link>
              <Link component={RouterLink} to="/careers" color="inherit" sx={{ 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' } 
              }}>
                Carreiras
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              AutoCred
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Sistema completo para análise de crédito para lojas de carros, 
              oferecendo soluções rápidas e seguras para aprovação de financiamentos.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              mt: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 28,
              py: 1,
              px: 2
            }}>
              <EmailIcon sx={{ fontSize: 18, mr: 1, color: '#66bb6a' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                autocredcontato@gmail.com
              </Typography>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ 
                color: '#222222',
                '&:hover': { backgroundColor: '#f7f7f7' }
              }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ 
                color: '#222222',
                '&:hover': { backgroundColor: '#f7f7f7' }
              }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ 
                color: '#222222',
                '&:hover': { backgroundColor: '#f7f7f7' }
              }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ 
                color: '#222222',
                '&:hover': { backgroundColor: '#f7f7f7' }
              }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CopyrightIcon sx={{ fontSize: 16, mr: 0.5, color: '#717171' }} />
            <Typography variant="body2" color="#717171">
              {new Date().getFullYear()} AutoCred, Inc. Todos os direitos reservados.
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 1, md: 3 }
          }}>
            <Link href="#" color="#717171" sx={{ 
              fontSize: '0.875rem',
              textDecoration: 'none', 
              '&:hover': { textDecoration: 'underline' } 
            }}>
              Privacidade
            </Link>
            <Link href="#" color="#717171" sx={{ 
              fontSize: '0.875rem',
              textDecoration: 'none', 
              '&:hover': { textDecoration: 'underline' } 
            }}>
              Termos
            </Link>
            <Link href="#" color="#717171" sx={{ 
              fontSize: '0.875rem',
              textDecoration: 'none', 
              '&:hover': { textDecoration: 'underline' } 
            }}>
              Mapa do site
            </Link>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon sx={{ fontSize: 18, color: '#222222' }} />
            <Link href="#" color="#222222" sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none', 
              '&:hover': { textDecoration: 'underline' } 
            }}>
              Português (BR)
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;