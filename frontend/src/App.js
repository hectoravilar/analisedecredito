import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import CreditAnalysis from './components/credit-analysis';
import Header from './components/header';
import Footer from './components/footer';
import ProfileForm from './components/profile-form';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "sua_api_key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seu_auth_domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seu_project_id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seu_storage_bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "seu_messaging_sender_id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "seu_app_id"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Tema personalizado no estilo Apple
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#66bb6a',
      },
      secondary: {
        main: '#ff6d00',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0b0b0' : '#717171',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            padding: '10px 20px',
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            overflow: 'hidden',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#121212' : '#f5f5f5',
            minHeight: '100vh',
          },
          '#root': {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      },
    },
  });

  useEffect(() => {
    // Verificar se o usuário está autenticado usando cookies HttpOnly
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/check-auth', { 
          withCredentials: true 
        });
        
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login com Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Enviar token para o backend para validação e criação de sessão
      const idToken = await user.getIdToken();
      
      const response = await axios.post('http://localhost:5000/api/auth/google', 
        { idToken },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      alert('Login com Google falhou. Por favor, tente novamente.');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      // Chamar API de logout para limpar o cookie
      await axios.get(`http://localhost:5000/api/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Atualizar perfil do usuário
  const handleUpdateProfile = async (profileData) => {
    try {
      // Implementar chamada para atualizar o perfil
      console.log('Atualizando perfil:', profileData);
      setUser(prev => ({
        ...prev,
        ...profileData
      }));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  // Componente de rota protegida
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Carregando...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header user={user} onLogout={handleLogout} />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={
                user ? <Navigate to="/dashboard" /> : <Login onGoogleLogin={handleGoogleLogin} />
              } />
              <Route path="/register" element={
                user ? <Navigate to="/dashboard" /> : <Register />
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } />
              <Route path="/credit-analysis" element={
                <ProtectedRoute>
                  <CreditAnalysis user={user} />
                </ProtectedRoute>
              } />
undefined
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileForm 
                    user={user} 
                    onSave={handleUpdateProfile} 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;