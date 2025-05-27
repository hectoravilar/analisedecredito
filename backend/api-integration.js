const axios = require('axios');
const { encryptData, decryptData, maskSensitiveData } = require('./security-config');
const { ApiLog } = require('./models');

// Chave secreta para criptografia (em produção, usar variáveis de ambiente)
const SECRET_KEY = 'sua_chave_secreta_muito_segura';

// Configuração das APIs de crédito
const apiConfig = {
  serasa: {
    baseUrl: 'https://api.serasa.com.br/v1',
    apiKey: 'sua_api_key_serasa',
    timeout: 10000 // 10 segundos
  },
  boaVista: {
    baseUrl: 'https://api.boavista.com.br/v2',
    apiKey: 'sua_api_key_boa_vista',
    timeout: 8000 // 8 segundos
  },
  quod: {
    baseUrl: 'https://api.quod.com.br/v1',
    apiKey: 'sua_api_key_quod',
    timeout: 12000 // 12 segundos
  }
};

// Função para registrar chamadas de API
const logApiCall = async (userId, apiName, endpoint, requestData, responseStatus, responseTime, error = null) => {
  try {
    // Mascarar dados sensíveis antes de salvar no log
    const maskedRequestData = { ...requestData };
    
    if (maskedRequestData.cpf) {
      maskedRequestData.cpf = maskSensitiveData(maskedRequestData.cpf);
    }
    
    if (maskedRequestData.cnpj) {
      maskedRequestData.cnpj = maskSensitiveData(maskedRequestData.cnpj);
    }
    
    const apiLog = new ApiLog({
      userId,
      apiName,
      endpoint,
      requestData: maskedRequestData,
      responseStatus,
      responseTime,
      error
    });
    
    await apiLog.save();
  } catch (logError) {
    console.error('Erro ao registrar log de API:', logError);
  }
};

// Cliente Serasa
const serasaClient = {
  getScore: async (userId, cpf) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.serasa.baseUrl}/score`,
        timeout: apiConfig.serasa.timeout,
        headers: {
          'Authorization': `Bearer ${apiConfig.serasa.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          cpf: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'serasa',
        '/score',
        { cpf },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      return {
        score: Math.floor(Math.random() * 1000),
        status: 'approved',
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'serasa',
        '/score',
        { cpf },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar Serasa: ${err.message}`);
    }
  },
  
  getRestrictions: async (userId, cpf) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.serasa.baseUrl}/restrictions`,
        timeout: apiConfig.serasa.timeout,
        headers: {
          'Authorization': `Bearer ${apiConfig.serasa.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          cpf: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'serasa',
        '/restrictions',
        { cpf },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      return {
        hasRestrictions: Math.random() > 0.7,
        restrictionCount: Math.floor(Math.random() * 3),
        totalValue: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) + 1000 : 0,
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'serasa',
        '/restrictions',
        { cpf },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar restrições no Serasa: ${err.message}`);
    }
  }
};

// Cliente Boa Vista
const boaVistaClient = {
  getScore: async (userId, cpf) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.boaVista.baseUrl}/credit-score`,
        timeout: apiConfig.boaVista.timeout,
        headers: {
          'X-API-Key': apiConfig.boaVista.apiKey,
          'Content-Type': 'application/json'
        },
        data: {
          document: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv,
          documentType: 'CPF'
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'boaVista',
        '/credit-score',
        { cpf },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      return {
        score: Math.floor(Math.random() * 1000),
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'boaVista',
        '/credit-score',
        { cpf },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar Boa Vista: ${err.message}`);
    }
  },
  
  getCreditLimit: async (userId, cpf, income) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.boaVista.baseUrl}/credit-limit`,
        timeout: apiConfig.boaVista.timeout,
        headers: {
          'X-API-Key': apiConfig.boaVista.apiKey,
          'Content-Type': 'application/json'
        },
        data: {
          document: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv,
          documentType: 'CPF',
          income: income || 0
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'boaVista',
        '/credit-limit',
        { cpf, income },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      return {
        creditLimit: Math.floor((Math.random() * 50000) + 10000),
        suggestedInstallments: Math.floor(Math.random() * 48) + 12,
        interestRate: (Math.random() * 1.5) + 0.8,
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'boaVista',
        '/credit-limit',
        { cpf, income },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar limite de crédito na Boa Vista: ${err.message}`);
    }
  }
};

// Cliente Quod
const quodClient = {
  getScore: async (userId, cpf) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.quod.baseUrl}/credit-analysis`,
        timeout: apiConfig.quod.timeout,
        headers: {
          'Authorization': `ApiKey ${apiConfig.quod.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          cpf: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv,
          analysisType: 'complete'
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'quod',
        '/credit-analysis',
        { cpf },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      return {
        score: Math.floor(Math.random() * 1000),
        creditHistory: {
          paymentHistory: Math.random() > 0.7 ? 'good' : 'regular',
          debtLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          creditUtilization: Math.floor(Math.random() * 100)
        },
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'quod',
        '/credit-analysis',
        { cpf },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar Quod: ${err.message}`);
    }
  },
  
  getBankOffers: async (userId, cpf, creditScore, loanAmount) => {
    const startTime = Date.now();
    let responseStatus = null;
    let error = null;
    
    try {
      // Criptografar CPF para transmissão segura
      const encryptedCpf = encryptData(cpf, SECRET_KEY);
      
      const response = await axios({
        method: 'post',
        url: `${apiConfig.quod.baseUrl}/bank-offers`,
        timeout: apiConfig.quod.timeout,
        headers: {
          'Authorization': `ApiKey ${apiConfig.quod.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          cpf: encryptedCpf.encryptedData,
          iv: encryptedCpf.iv,
          creditScore,
          loanAmount
        }
      });
      
      responseStatus = response.status;
      
      // Registrar chamada de API
      await logApiCall(
        userId,
        'quod',
        '/bank-offers',
        { cpf, creditScore, loanAmount },
        responseStatus,
        Date.now() - startTime
      );
      
      // Simulação de resposta
      const bankCount = Math.floor(Math.random() * 3) + 2;
      const offers = [];
      
      for (let i = 0; i < bankCount; i++) {
        offers.push({
          bankName: `Banco ${String.fromCharCode(65 + i)}`,
          interestRate: (Math.random() * 1.5) + 0.8,
          monthlyPayment: loanAmount * ((Math.random() * 0.05) + 0.02),
          term: [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)],
          approvalChance: Math.floor(Math.random() * 100)
        });
      }
      
      return {
        offers,
        bestOffer: Math.floor(Math.random() * bankCount),
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      error = err.message;
      responseStatus = err.response?.status || 500;
      
      // Registrar erro
      await logApiCall(
        userId,
        'quod',
        '/bank-offers',
        { cpf, creditScore, loanAmount },
        responseStatus,
        Date.now() - startTime,
        error
      );
      
      throw new Error(`Erro ao consultar ofertas bancárias no Quod: ${err.message}`);
    }
  }
};

// Função para realizar análise completa de crédito
const performCreditAnalysis = async (userId, clientData) => {
  try {
    const { clientName, cpf, carModel, carValue } = clientData;
    
    // Verificar acesso do usuário às APIs (baseado na assinatura)
    // Implementar lógica real para verificar a assinatura do usuário
    const userSubscription = 'premium'; // Simulação
    
    // Resultados das consultas
    let serasaResult = null;
    let boaVistaResult = null;
    let quodResult = null;
    let bankOffers = [];
    
    // Consultar Serasa (disponível em todos os planos)
    serasaResult = await serasaClient.getScore(userId, cpf);
    
    // Consultar Boa Vista (disponível nos planos básico e premium)
    if (['basic', 'premium'].includes(userSubscription)) {
      boaVistaResult = await boaVistaClient.getScore(userId, cpf);
    }
    
    // Consultar Quod (disponível apenas no plano premium)
    if (userSubscription === 'premium') {
      quodResult = await quodClient.getScore(userId, cpf);
      
      // Obter ofertas bancárias
      const avgScore = (
        serasaResult.score + 
        (boaVistaResult ? boaVistaResult.score : 0) + 
        (quodResult ? quodResult.score : 0)
      ) / (1 + (boaVistaResult ? 1 : 0) + (quodResult ? 1 : 0));
      
      const bankOffersResult = await quodClient.getBankOffers(userId, cpf, avgScore, carValue);
      bankOffers = bankOffersResult.offers;
    }
    
    // Calcular limite de crédito (simulação)
    const avgScore = (
      serasaResult.score + 
      (boaVistaResult ? boaVistaResult.score : 0) + 
      (quodResult ? quodResult.score : 0)
    ) / (1 + (boaVistaResult ? 1 : 0) + (quodResult ? 1 : 0));
    
    const creditLimit = (avgScore / 1000) * carValue * 1.5;
    
    // Gerar taxas de juros simuladas
    const interestRates = [
      { provider: 'Banco A', rate: 0.9 + Math.random() * 0.5 },
      { provider: 'Banco B', rate: 1.0 + Math.random() * 0.5 },
      { provider: 'Banco C', rate: 1.1 + Math.random() * 0.5 }
    ];
    
    // Resultado final
    return {
      clientName,
      cpf,
      carModel,
      carValue,
      serasaScore: serasaResult.score,
      boaVistaScore: boaVistaResult ? boaVistaResult.score : null,
      quodScore: quodResult ? quodResult.score : null,
      interestRates,
      bankOffers,
      creditLimit,
      approved: avgScore > 600,
      analysisDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na análise de crédito:', error);
    throw new Error(`Falha na análise de crédito: ${error.message}`);
  }
};

module.exports = {
  serasaClient,
  boaVistaClient,
  quodClient,
  performCreditAnalysis
};