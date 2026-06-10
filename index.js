const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./openapi');

// Permite receber JSON no body da requisição
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Rota de mock para autenticação
app.post('/api/auth', (req, res) => {
  const { client_id, client_secret } = req.body;

  // Simulação simples de validação
  if (client_id === 'admin' && client_secret === '123456') {
    return res.status(200).json({
      success: true,
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-token-aqui',
      user: {
        id: 1,
        name: 'Renan',
        role: 'admin'
      }
    });
  }

  // Falha na autenticação
  return res.status(401).json({
    success: false,
    message: 'Usuário ou senha incorretos.'
  });
});


app.get('/parts/:partId', (req, res) => {
  const { partId } = req.params;

  if (partId !== '123') {
    return res.status(404).json({
      error: 'Peça não encontrada'
    });
  }

  res.json({
    id: '123',
    description: 'Filtro de óleo',
    price: 49.9
  });
});


app.patch('/work-orders/:workOrderId', (req, res) => {
  const { workOrderId } = req.params;
  const data = req.body;

  console.log('PartId:', workOrderId);
  console.log('Dados recebidos:', data);

  res.json({
    success: true,
    message: 'Ordem atualizada com sucesso',
    workOrderId,
    updatedData: data
  });
});


app.get('/', (req, res) => {
  res.send('Mock API BRABA rodando! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});