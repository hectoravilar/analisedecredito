const express = require('express');
const { PowerBIEmbed } = require('powerbi-client-node');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

// Configurações do Power BI (substituir credenciais)
const powerBiConfig = {
  clientId: 'seu_client_id',
  clientSecret: 'seu_client_secret',
  tenantId: 'seu_tenant_id',
  workspaceId: 'seu_workspace_id',
  reportId: 'seu_report_id'
};

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  
  jwt.verify(token, 'seu_segredo_jwt', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Função para obter token do Power BI
async function getPowerBIToken() {
  try {
    const url = `https://login.microsoftonline.com/${powerBiConfig.tenantId}/oauth2/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', powerBiConfig.clientId);
    formData.append('client_secret', powerBiConfig.clientSecret);
    formData.append('resource', 'https://analysis.windows.net/powerbi/api');
    
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token do Power BI:', error);
    throw error;
  }
}

// Rota para obter token de incorporação do Power BI
router.get('/powerbi-token', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário tem assinatura premium
    if (req.user.subscription !== 'premium') {
      return res.status(403).json({ 
        message: 'Acesso negado. Faça upgrade para o plano Premium para acessar relatórios avançados.' 
      });
    }
    
    // Obter token do Power BI
    const accessToken = await getPowerBIToken();
    
    // Configurar o cliente Power BI Embed
    const powerbi = new PowerBIEmbed();
    
    // Gerar token de incorporação
    const embedToken = await powerbi.getEmbedToken({
      accessToken,
      reportId: powerBiConfig.reportId,
      workspaceId: powerBiConfig.workspaceId,
      additionalDatasets: []
    });
    
    // Retornar informações para incorporação
    res.json({
      embedToken: embedToken.token,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${powerBiConfig.reportId}&groupId=${powerBiConfig.workspaceId}`,
      reportId: powerBiConfig.reportId,
      expiresOn: embedToken.expiration
    });
  } catch (error) {
    console.error('Erro ao gerar token de incorporação:', error);
    res.status(500).json({ message: 'Erro ao gerar token de incorporação', error: error.message });
  }
});

// Rota para obter dados para o dashboard
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    // Aqui você buscaria dados do seu banco de dados
    // e formataria para uso no Power BI ou em gráficos no frontend
    
    // Exemplo de dados simulados
    const dashboardData = {
      creditScoreDistribution: [
        { range: '0-300', count: 15 },
        { range: '301-500', count: 45 },
        { range: '501-700', count: 120 },
        { range: '701-900', count: 78 },
        { range: '901-1000', count: 32 }
      ],
      approvalRateByMonth: [
        { month: 'Jan', rate: 68.5 },
        { month: 'Fev', rate: 70.2 },
        { month: 'Mar', rate: 72.1 },
        { month: 'Abr', rate: 71.8 },
        { month: 'Mai', rate: 73.5 },
        { month: 'Jun', rate: 75.0 }
      ],
      topCarModels: [
        { model: 'Toyota Corolla', count: 45 },
        { model: 'Honda Civic', count: 38 },
        { model: 'Hyundai HB20', count: 32 },
        { model: 'Volkswagen Gol', count: 28 },
        { model: 'Fiat Argo', count: 25 }
      ],
      averageInterestRates: [
        { provider: 'Banco A', rate: 1.2 },
        { provider: 'Banco B', rate: 1.35 },
        { provider: 'Banco C', rate: 1.15 },
        { provider: 'Banco D', rate: 1.42 },
        { provider: 'Banco E', rate: 1.28 }
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard', error: error.message });
  }
});

// Rota para exportar dados para o Power BI
router.post('/export-to-powerbi', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário tem assinatura premium
    if (req.user.subscription !== 'premium') {
      return res.status(403).json({ 
        message: 'Acesso negado. Faça upgrade para o plano Premium para exportar dados.' 
      });
    }
    
    // Simulação de exportação bem-sucedida
    setTimeout(() => {
      res.json({ 
        success: true, 
        message: 'Dados exportados com sucesso para o Power BI' 
      });
    }, 1500);
  } catch (error) {
    console.error('Erro ao exportar dados para o Power BI:', error);
    res.status(500).json({ message: 'Erro ao exportar dados', error: error.message });
  }
});

module.exports = router;