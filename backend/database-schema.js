const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Senha obrigatória apenas se não tiver googleId
    },
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  remainingQueries: {
    type: Number,
    default: 5 // Plano gratuito começa com 5 consultas
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Esquema de Análise de Crédito
const creditAnalysisSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    trim: true
  },
  carModel: {
    type: String,
    required: true,
    trim: true
  },
  carValue: {
    type: Number,
    required: true,
    min: 0
  },
  serasaScore: {
    type: Number,
    min: 0,
    max: 1000
  },
  boaVistaScore: {
    type: Number,
    min: 0,
    max: 1000
  },
  quodScore: {
    type: Number,
    min: 0,
    max: 1000
  },
  interestRates: [{
    provider: String,
    rate: Number
  }],
  creditLimit: {
    type: Number,
    min: 0
  },
  approved: {
    type: Boolean
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Esquema de Plano de Assinatura
const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String
  }],
  maxQueries: {
    type: Number,
    required: true
  },
  accessibleApis: [{
    type: String,
    enum: ['serasa', 'boavista', 'quod']
  }],
  active: {
    type: Boolean,
    default: true
  }
});

// Esquema de Transação
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'pix', 'bank_transfer']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Esquema de Log de API
const apiLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apiName: {
    type: String,
    required: true,
    enum: ['serasa', 'boavista', 'quod']
  },
  endpoint: {
    type: String,
    required: true
  },
  requestData: {
    type: Object
  },
  responseStatus: {
    type: Number
  },
  responseTime: {
    type: Number // em milissegundos
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criar modelos
const User = mongoose.model('User', userSchema);
const CreditAnalysis = mongoose.model('CreditAnalysis', creditAnalysisSchema);
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const ApiLog = mongoose.model('ApiLog', apiLogSchema);

module.exports = {
  User,
  CreditAnalysis,
  SubscriptionPlan,
  Transaction,
  ApiLog
};