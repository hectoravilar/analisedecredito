import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

function Header({ user, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    handleProfileClose();
    onLogout();
  };

  return (
    <AppBar position="fixed" sx={{ 
      background: '#ffffff',
      boxShadow: '0 1px 12px rgba(0, 0, 0, 0.08)',
      color: '#222222'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 4
            }}
          >
            <img 
              src="/images/logo.png" 
              alt="AutoCred Logo" 
              style={{ 
                height: 40, 
                marginRight: 10 
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#66bb6a',
                textDecoration: 'none',
                flexGrow: isMobile ? 1 : 0,
                letterSpacing: '0.5px',
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
              {user && (
                <>
                  <Button 
                    component={RouterLink} 
                    to="/dashboard"
                    sx={{ 
                      mx: 1, 
                      color: '#222222',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { 
                        backgroundColor: 'transparent',
                        color: '#66bb6a',
                        transform: 'none'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        backgroundColor: '#66bb6a',
                        transition: 'all 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%',
                        left: '0%'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/credit-analysis"
                    sx={{ 
                      mx: 1, 
                      color: '#222222',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { 
                        backgroundColor: 'transparent',
                        color: '#66bb6a',
                        transform: 'none'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        backgroundColor: '#66bb6a',
                        transition: 'all 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%',
                        left: '0%'
                      }
                    }}
                  >
                    Análise de Crédito
                  </Button>

                </>
              )}
            </Box>
          )}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mr: 2, 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #dddddd',
                    borderRadius: '24px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    '&:hover': { 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }
                  }}
                  onClick={handleProfileMenu}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#e8f5e9', 
                      color: '#66bb6a',
                      mr: 1
                    }}
                  >
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#222222', fontWeight: 500 }}>
                    Olá Vendedor, {user.displayName || user.email}
                  </Typography>
                </Box>
              )}
              
              <Menu
                id="profile-menu"
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileClose}
                PaperProps={{
                  elevation: 3,
                  sx: { 
                    borderRadius: '12px',
                    minWidth: '220px',
                    mt: 1
                  }
                }}
              >
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Tooltip title="Alterar foto">
                        <IconButton 
                          sx={{ 
                            bgcolor: '#e8f5e9', 
                            width: 22, 
                            height: 22,
                            border: '2px solid white'
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: 14, color: '#66bb6a' }} />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <Avatar 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        bgcolor: '#e8f5e9', 
                        color: '#66bb6a',
                        mx: 'auto',
                        mb: 1,
                        fontSize: '1.5rem'
                      }}
                    >
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.displayName || user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem component={RouterLink} to="/profile" onClick={handleProfileClose}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Meu Perfil
                </MenuItem>
                <MenuItem component={RouterLink} to="/account-settings" onClick={handleProfileClose}>
                  <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Configurações da Conta
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
                </MenuItem>
              </Menu>
              
              {isMobile ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { 
                        borderRadius: '12px',
                        minWidth: '200px',
                        mt: 1
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#66bb6a', mr: 1 }}>
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle1" noWrap>
                        Vendedor, {user.displayName || user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Meu Perfil
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/dashboard" onClick={handleClose}>
                      <DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/credit-analysis" onClick={handleClose}>
                      <CreditScoreIcon fontSize="small" sx={{ mr: 1 }} /> Análise de Crédito
                    </MenuItem>
undefined
                    <MenuItem component={RouterLink} to="/account-settings" onClick={handleClose}>
                      <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Configurações
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  onClick={onLogout}
                  sx={{ 
                    borderRadius: '24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dddddd',
                    color: '#222222',
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 2,
                    '&:hover': { 
                      backgroundColor: '#f7f7f7',
                      borderColor: '#cccccc',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  Sair
                </Button>
              )}
            </Box>
          ) : (
            <Box>
              {isMobile ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' }
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { 
                        borderRadius: '12px',
                        minWidth: '180px',
                        mt: 1
                      }
                    }}
                  >
                    <MenuItem component={RouterLink} to="/login" onClick={handleClose}>
                      <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} /> Login
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/register" onClick={handleClose}>
                      <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} /> Registrar
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    component={RouterLink} 
                    to="/login"
                    sx={{ 
                      mx: 1, 
                      borderRadius: '24px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #dddddd',
                      color: '#222222',
                      fontWeight: 500,
                      textTransform: 'none',
                      px: 2,
                      '&:hover': { 
                        backgroundColor: '#f7f7f7',
                        borderColor: '#cccccc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      borderRadius: '24px',
                      backgroundColor: '#66bb6a',
                      color: 'white',
                      fontWeight: 500,
                      textTransform: 'none',
                      px: 2,
                      '&:hover': { 
                        backgroundColor: '#5caf50',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Registrar
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;