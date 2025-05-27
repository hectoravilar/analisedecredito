const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const crypto = require('crypto');

// Configuração de segurança para Express
const configureSecurityMiddleware = (app) => {
  // Configurar cabeçalhos HTTP seguros
  app.use(helmet());
  
  // Habilitar CORS com opções restritas
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://seu-dominio.com', 'https://www.seu-dominio.com'] 
      : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 horas
  };
  app.use(cors(corsOptions));
  
  // Limitar requisições para prevenir ataques de força bruta
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
  });
  app.use('/api/', limiter);
  
  // Limitar especificamente rotas de autenticação
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // limite de 10 tentativas por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas tentativas de login, tente novamente após 1 hora'
  });
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);
  
  // Sanitização para prevenir XSS (Cross-Site Scripting)
  app.use(xss());
  
  // Sanitização para prevenir injeção NoSQL
  app.use(mongoSanitize());
  
  // Prevenir poluição de parâmetros HTTP
  app.use(hpp());
  
  // Configurar CSP (Content Security Policy)
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://app.powerbi.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.serasa.com.br', 'https://api.boavista.com.br', 'https://api.quod.com.br'],
      frameSrc: ["'self'", 'https://app.powerbi.com']
    }
  }));
};

// Função para criptografar dados sensíveis
const encryptData = (text, secretKey) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
};

// Função para descriptografar dados
const decryptData = (encryptedData, iv, secretKey) => {
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Função para mascarar CPF/CNPJ nos logs
const maskSensitiveData = (data) => {
  if (!data) return data;
  
  // Mascarar CPF
  if (typeof data === 'string' && /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data)) {
    return data.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, '$1.XXX.XXX-XX');
  }
  
  // Mascarar CNPJ
  if (typeof data === 'string' && /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data)) {
    return data.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})/, '$1.XXX.XXX/XXXX-XX');
  }
  
  // Mascarar cartão de crédito
  if (typeof data === 'string' && /^\d{16}$/.test(data.replace(/\s/g, ''))) {
    return data.replace(/\s/g, '').replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-XXXX-XXXX-$4');
  }
  
  return data;
};

// Middleware para validar e sanitizar entrada
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        message: 'Dados de entrada inválidos', 
        errors: error.details.map(detail => detail.message) 
      });
    }
    
    // Substituir o corpo da requisição com os dados validados
    req.body = value;
    next();
  };
};

// Middleware para registrar tentativas de acesso suspeitas
const logSuspiciousActivity = (req, res, next) => {
  // Verificar padrões suspeitos na requisição
  const suspicious = [
    req.body.password && req.body.password.includes('script'),
    req.query.id && req.query.id.includes('--'),
    req.params.id && req.params.id.includes("'"),
    req.headers['user-agent'] && req.headers['user-agent'].includes('sqlmap')
  ].some(Boolean);
  
  if (suspicious) {
    console.warn('Atividade suspeita detectada:', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    
    // Opcionalmente, você pode bloquear a requisição
    // return res.status(403).json({ message: 'Acesso negado' });
  }
  
  next();
};

module.exports = {
  configureSecurityMiddleware,
  encryptData,
  decryptData,
  maskSensitiveData,
  validateInput,
  logSuspiciousActivity
};