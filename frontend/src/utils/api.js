import axios from 'axios';

// Criar uma instância do axios com configuração base
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Importante para enviar/receber cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;