const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./openapi');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Middleware para validar o token
const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Bearer token não fornecido.'
    });
  }
  next();
};

app.post('/api/auth', checkToken, (req, res) => {
  const { client_id, client_secret } = req.body;

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

  return res.status(401).json({
    success: false,
    message: 'Usuário ou senha incorretos.'
  });
});

app.get('/parts/:partId', checkToken, (req, res) => {
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

app.patch('/work-orders/:workOrderId', checkToken, (req, res) => {
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
  res.json({
    success: true,
    message: 'Mock API BRABA rodando! 🚀'
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});