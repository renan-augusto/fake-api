const express = require('express');
const app = express();

// Permite receber JSON no body da requisição
app.use(express.json());

// Rota de mock para autenticação
app.post('/api/auth', (req, res) => {
  const { client_id, client_secret } = req.body;

  // Simulação simples de validação
  if (client_id === 'admin' && client_secret === '123456') {
    return res.status(200).json({
      success: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-token-aqui',
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

// Rota de healthcheck só pra ver se a API tá de pé
app.get('/', (req, res) => {
  res.send('Mock API BRABA rodando! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});