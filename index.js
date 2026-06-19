const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const openApiSpec = require('./openapi');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-token-aqui';

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token não informado.'
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || token !== MOCK_TOKEN) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }

  next();
};

const logRequest = (req) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  if (Object.keys(req.params).length) {
    console.log('  params:', req.params);
  }
  if (req.body && Object.keys(req.body).length) {
    console.log('  body:', req.body);
  }
};

app.post('/api/auth', (req, res) => {
  const { client_id, client_secret } = req.body;

  if (client_id === 'admin' && client_secret === '123456') {
    return res.status(200).json({
      success: true,
      access_token: MOCK_TOKEN,
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

// ----------------------------------------------------------------------------
// PARTS (VX5 43-47)
// ----------------------------------------------------------------------------

// 43 - GET /parts/{partId}
app.get('/parts/:partId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.partId, description: 'Peça mock' });
});

// 44 - PUT /parts/{partId}
app.put('/parts/:partId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.partId, ...req.body });
});

// 45 - DELETE /parts/{partId}
app.delete('/parts/:partId', (req, res) => {
  logRequest(req);
  res.status(204).send();
});

// 46 - GET /jobs/{jobId}/parts
app.get('/jobs/:jobId/parts', (req, res) => {
  logRequest(req);
  res.json({ jobId: req.params.jobId, parts: [{ id: '1', description: 'Peça mock' }] });
});

// 47 - POST /jobs/{jobId}/parts
app.post('/jobs/:jobId/parts', (req, res) => {
  logRequest(req);
  res.status(201).json({ id: '1', jobId: req.params.jobId, ...req.body });
});

// ----------------------------------------------------------------------------
// LABOUR (VX5 48-52)
// ----------------------------------------------------------------------------

// 48 - GET /labour/{labourId}
app.get('/labour/:labourId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.labourId, description: 'Mão de obra mock' });
});

// 49 - PUT /labour/{labourId}
app.put('/labour/:labourId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.labourId, ...req.body });
});

// 50 - DELETE /labour/{labourId}
app.delete('/labour/:labourId', (req, res) => {
  logRequest(req);
  res.status(204).send();
});

// 51 - GET /jobs/{jobId}/labour
app.get('/jobs/:jobId/labour', (req, res) => {
  logRequest(req);
  res.json({ jobId: req.params.jobId, labour: [{ id: '1', description: 'Mão de obra mock' }] });
});

// 52 - POST /jobs/{jobId}/labour
app.post('/jobs/:jobId/labour', (req, res) => {
  logRequest(req);
  res.status(201).json({ id: '1', jobId: req.params.jobId, ...req.body });
});

// ----------------------------------------------------------------------------
// WORK ORDERS (VX5 53-58)
// ----------------------------------------------------------------------------

// 53 - GET /work-orders/{workOrderId}/appointment
app.get('/work-orders/:workOrderId/appointment', (req, res) => {
  logRequest(req);
  res.json({ workOrderId: req.params.workOrderId, scheduledDate: '2026-06-19' });
});

// 54 - PUT /work-orders/{workOrderId}/appointment
app.put('/work-orders/:workOrderId/appointment', (req, res) => {
  logRequest(req);
  res.json({ workOrderId: req.params.workOrderId, ...req.body });
});

// 55 - GET /work-orders/{workOrderId}
app.get('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.workOrderId, status: 'open' });
});

// 56 - DELETE /work-orders/{workOrderId}
app.delete('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  res.status(204).send();
});

// 57 - PATCH /work-orders/{workOrderId}
app.patch('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.workOrderId, ...req.body });
});

// 58 - POST /work-orders
app.post('/work-orders', (req, res) => {
  logRequest(req);
  res.status(201).json({ id: '1', ...req.body });
});

// ----------------------------------------------------------------------------
// JOBS (VX5 59-66)
// ----------------------------------------------------------------------------

// 59 - GET /work-orders/{workOrderId}/jobs
app.get('/work-orders/:workOrderId/jobs', (req, res) => {
  logRequest(req);
  res.json({ workOrderId: req.params.workOrderId, jobs: [{ id: '1', status: 'open' }] });
});

// 60 - POST /work-orders/{workOrderId}/jobs
app.post('/work-orders/:workOrderId/jobs', (req, res) => {
  logRequest(req);
  res.status(201).json({ id: '1', workOrderId: req.params.workOrderId, ...req.body });
});

// 61 - GET /jobs/{jobId}/planning
app.get('/jobs/:jobId/planning', (req, res) => {
  logRequest(req);
  res.json({ jobId: req.params.jobId, plannedHours: 1 });
});

// 62 - PUT /jobs/{jobId}/planning
app.put('/jobs/:jobId/planning', (req, res) => {
  logRequest(req);
  res.json({ jobId: req.params.jobId, ...req.body });
});

// 63 - GET /jobs/{jobId}
app.get('/jobs/:jobId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.jobId, status: 'open' });
});

// 64 - DELETE /jobs/{jobId}
app.delete('/jobs/:jobId', (req, res) => {
  logRequest(req);
  res.status(204).send();
});

// 65 - PATCH /jobs/{jobId}
app.patch('/jobs/:jobId', (req, res) => {
  logRequest(req);
  res.json({ id: req.params.jobId, ...req.body });
});

// 66 - GET /jobs/{jobId}/maintenance
app.get('/jobs/:jobId/maintenance', (req, res) => {
  logRequest(req);
  res.json({ jobId: req.params.jobId, type: 'preventive' });
});

// ----------------------------------------------------------------------------
// TAGS (VX5 67-69)
// ----------------------------------------------------------------------------

// 67 - DELETE /tags/{tagId}
app.delete('/tags/:tagId', (req, res) => {
  logRequest(req);
  res.status(204).send();
});

// 68 - GET /work-orders/{workOrderId}/tags
app.get('/work-orders/:workOrderId/tags', (req, res) => {
  logRequest(req);
  res.json({ workOrderId: req.params.workOrderId, tags: [{ id: '1' }] });
});

// 69 - POST /work-orders/{workOrderId}/tags
app.post('/work-orders/:workOrderId/tags', (req, res) => {
  logRequest(req);
  res.status(201).json({ id: '1', workOrderId: req.params.workOrderId, ...req.body });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock API BRABA rodando! 🚀'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
