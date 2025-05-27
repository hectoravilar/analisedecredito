const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Importar cookie-parser
const cookieParser = require('cookie-parser');

// Configuração do servidor Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de segurança
app.use(helmet()); // Segurança de cabeçalhos HTTP
app.use(cors({
  origin: 'http://localhost:3000', // Origem do frontend
  credentials: true // Permitir cookies em requisições cross-origin
}));
app.use(express.json());
app.use(cookieParser()); // Para processar cookies

// Rate limiting para prevenir ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Conexão com MongoDB (substituir com suas credenciais)
mongoose.connect('mongodb://localhost:27017/analisecredito', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: String,
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  createdAt: { type: Date, default: Date.now }
});

// Criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Modelo de Análise de Crédito
const creditAnalysisSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  cpf: { type: String, required: true },
  carModel: { type: String, required: true },
  carValue: { type: Number, required: true },
  serasaScore: Number,
  boaVistaScore: Number,
  quodScore: Number,
  interestRates: [{ provider: String, rate: Number }],
  creditLimit: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const CreditAnalysis = mongoose.model('CreditAnalysis', creditAnalysisSchema);

// Middleware de autenticação usando cookies
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  
  if (!token) return res.status(401).json({ message: 'Não autenticado' });
  
  jwt.verify(token, 'seu_segredo_jwt', (err, user) => {
    if (err) return res.status(403).json({ message: 'Sessão expirada ou inválida' });
    req.user = user;
    next();
  });
};

// Rotas de autenticação
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    // Criar novo usuário com nome padrão se não for fornecido
    const userName = name || email.split('@')[0];
    const user = new User({ name: userName, email, password });
    await user.save();
    
    // Gerar token JWT
    const token = jwt.sign({ id: user._id }, 'seu_segredo_jwt', { expiresIn: '1d' });
    
    // Configurar cookie HttpOnly
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Usar HTTPS em produção
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });
    
    res.status(201).json({ success: true, user: { id: user._id, name: userName, email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign({ id: user._id }, 'seu_segredo_jwt', { expiresIn: '1d' });
    
    // Configurar cookie HttpOnly
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Usar HTTPS em produção
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });
    
    // Retornar apenas os dados do usuário (sem o token)
    res.json({ success: true, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

// Rota para análise de crédito
app.post('/api/credit-analysis', authenticateToken, async (req, res) => {
  try {
    const { clientName, cpf, carModel, carValue } = req.body;
    
    // Simulação de consulta às APIs de crédito
    const serasaScore = Math.floor(Math.random() * 1000);
    const boaVistaScore = Math.floor(Math.random() * 1000);
    const quodScore = Math.floor(Math.random() * 1000);
    
    // Simulação de taxas de juros
    const interestRates = [
      { provider: 'Banco A', rate: 0.9 + Math.random() * 0.5 },
      { provider: 'Banco B', rate: 1.0 + Math.random() * 0.5 },
      { provider: 'Banco C', rate: 1.1 + Math.random() * 0.5 }
    ];
    
    // Cálculo do limite de crédito (simulação)
    const avgScore = (serasaScore + boaVistaScore + quodScore) / 3;
    const creditLimit = (avgScore / 1000) * carValue * 1.5;
    
    // Salvar análise
    const analysis = new CreditAnalysis({
      clientName,
      cpf,
      carModel,
      carValue,
      serasaScore,
      boaVistaScore,
      quodScore,
      interestRates,
      creditLimit,
      userId: req.user.id
    });
    
    await analysis.save();
    
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar análise de crédito', error: error.message });
  }
});

// Rota para obter análises do usuário
app.get('/api/credit-analysis', authenticateToken, async (req, res) => {
  try {
    const analyses = await CreditAnalysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar análises', error: error.message });
  }
});

// Rota para planos de assinatura
app.get('/api/subscription-plans', (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 99.90,
      features: [
        'Até 50 consultas por mês',
        'Acesso a Serasa e Boa Vista',
        'Relatórios básicos'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 199.90,
      features: [
        'Consultas ilimitadas',
        'Acesso a Serasa, Boa Vista e Quod',
        'Relatórios avançados com Power BI',
        'Suporte prioritário'
      ]
    }
  ];
  
  res.json(plans);
});

// Rota de logout
app.get('/api/logout', (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// Rota para verificar autenticação
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({ isAuthenticated: false });
  }
  
  try {
    const decoded = jwt.verify(token, 'seu_segredo_jwt');
    // Buscar dados do usuário
    User.findById(decoded.id)
      .select('-password')
      .then(user => {
        if (!user) {
          return res.json({ isAuthenticated: false });
        }
        res.json({ 
          isAuthenticated: true, 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            subscription: user.subscription
          } 
        });
      })
      .catch(err => {
        console.error('Erro ao buscar usuário:', err);
        res.json({ isAuthenticated: false });
      });
  } catch (error) {
    res.cookie('auth_token', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    res.json({ isAuthenticated: false });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});