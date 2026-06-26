const express = require('express');
const { randomUUID } = require('crypto');
const swaggerUi = require('swagger-ui-express');

const app = express();
const openApiSpec = require('./openapi');

// JSON para as chamadas dos endpoints e urlencoded para o /auth (grant form)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-token-aqui';

const logRequest = (req) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  if (Object.keys(req.params).length) {
    console.log('  params:', req.params);
  }
  if (req.body && Object.keys(req.body).length) {
    console.log('  body:', req.body);
  }
};

// Helpers de payload fiéis ao swagger (WorkOrderV3) ---------------------------

const samplePart = (id) => ({
  id: id || randomUUID(),
  description: 'Oil filter',
  number: '1234567',
  quantity: 2
});

const sampleLabour = (id) => ({
  id: id || randomUUID(),
  description: 'Engine inspection',
  duration: 3600,
  operationCode: {
    code: '1234',
    generalBtiCode: { mainGroup: '00', subGroup: '22' }
  }
});

const sampleJob = (id) => ({
  id: id || randomUUID(),
  reference: '2829aad4-de6a-406f-9eac-fd77724adb62',
  type: 'MAINTENANCE',
  generalBTICode: { mainGroup: '00', subGroup: '22' },
  description: 'Periodic maintenance',
  actualStartTime: '2026-06-19T08:00:00',
  actualEndTime: '2026-06-19T12:00:00'
});

const sampleWorkOrder = (id) => ({
  id: id || randomUUID(),
  organizationId: '11111111-1111-1111-1111-111111111111',
  plannedDate: '2026-06-19',
  customerName: 'Customer',
  mileage: 10000,
  actualDropOffTime: '2026-06-19T07:30:00',
  actualPickupTime: '2026-06-19T17:00:00',
  product: {
    registrationNumber: 'ABC123',
    scania: true,
    serialNumber: '1234567',
    vin: 'YS2P4X20001234567'
  }
});

const sampleTag = (id) => ({ id: id || randomUUID(), value: 'AM1234567' });

// Responde 201 Created + header Location + body vazio (igual swagger)
const created = (res, location) => res.location(location).status(201).end();

// Responde 200 OK sem corpo (PUT/PATCH/DELETE do swagger)
const okNoBody = (res) => res.status(200).end();

// ----------------------------------------------------------------------------
// AUTH - emite token direto (sem validar credenciais)
// Atende tanto /api/auth quanto /connect/token (ajuste o DDEALER_AUTH_PATH no VRN)
// ----------------------------------------------------------------------------

const issueToken = (req, res) => {
  logRequest(req);
  res.status(200).json({
    access_token: MOCK_TOKEN,
    token_type: 'Bearer',
    expires_in: 3600
  });
};

app.post('/api/auth', issueToken);
app.post('/connect/token', issueToken);

// ----------------------------------------------------------------------------
// PARTS (VX5 43-47)
// ----------------------------------------------------------------------------

// 43 - GET /parts/{partId} -> Part
app.get('/parts/:partId', (req, res) => {
  logRequest(req);
  res.json(samplePart(req.params.partId));
});

// 44 - PUT /parts/{partId} -> 200 OK
app.put('/parts/:partId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 45 - DELETE /parts/{partId} -> 200 OK
app.delete('/parts/:partId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 46 - GET /jobs/{jobId}/parts -> array de Part
app.get('/jobs/:jobId/parts', (req, res) => {
  logRequest(req);
  res.json([samplePart(), samplePart()]);
});

// 47 - POST /jobs/{jobId}/parts -> 201 Created + Location
app.post('/jobs/:jobId/parts', (req, res) => {
  logRequest(req);
  created(res, `/parts/${randomUUID()}`);
});

// ----------------------------------------------------------------------------
// LABOUR (VX5 48-52)
// ----------------------------------------------------------------------------

// 48 - GET /labour/{labourId} -> Labour
app.get('/labour/:labourId', (req, res) => {
  logRequest(req);
  res.json(sampleLabour(req.params.labourId));
});

// 49 - PUT /labour/{labourId} -> 200 OK
app.put('/labour/:labourId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 50 - DELETE /labour/{labourId} -> 200 OK
app.delete('/labour/:labourId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 51 - GET /jobs/{jobId}/labour -> array de Labour
app.get('/jobs/:jobId/labour', (req, res) => {
  logRequest(req);
  res.json([sampleLabour(), sampleLabour()]);
});

// 52 - POST /jobs/{jobId}/labour -> 201 Created + Location
app.post('/jobs/:jobId/labour', (req, res) => {
  logRequest(req);
  created(res, `/labour/${randomUUID()}`);
});

// ----------------------------------------------------------------------------
// WORK ORDERS (VX5 53-58)
// ----------------------------------------------------------------------------

// 53 - GET /work-orders/{workOrderId}/appointment -> AppointmentWrapper
app.get('/work-orders/:workOrderId/appointment', (req, res) => {
  logRequest(req);
  res.json({
    appointment: {
      agreedDropOffTime: '2026-06-19T08:00:00',
      agreedPickupTime: '2026-06-19T17:00:00'
    }
  });
});

// 54 - PUT /work-orders/{workOrderId}/appointment -> 200 OK
app.put('/work-orders/:workOrderId/appointment', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 55 - GET /work-orders/{workOrderId} -> WorkOrder
app.get('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  res.json(sampleWorkOrder(req.params.workOrderId));
});

// 56 - DELETE /work-orders/{workOrderId} -> 200 OK
app.delete('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 57 - PATCH /work-orders/{workOrderId} -> 200 OK
app.patch('/work-orders/:workOrderId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 58 - POST /work-orders -> 201 Created + Location
app.post('/work-orders', (req, res) => {
  logRequest(req);
  created(res, `/work-orders/${randomUUID()}`);
});

// ----------------------------------------------------------------------------
// JOBS (VX5 59-66)
// ----------------------------------------------------------------------------

// 59 - GET /work-orders/{workOrderId}/jobs -> array de Job
app.get('/work-orders/:workOrderId/jobs', (req, res) => {
  logRequest(req);
  res.json([sampleJob(), sampleJob()]);
});

// 60 - POST /work-orders/{workOrderId}/jobs -> 201 Created + Location
app.post('/work-orders/:workOrderId/jobs', (req, res) => {
  logRequest(req);
  created(res, `/jobs/${randomUUID()}`);
});

// 61 - GET /jobs/{jobId}/planning -> PlanningResponse
app.get('/jobs/:jobId/planning', (req, res) => {
  logRequest(req);
  res.json({
    planning: {
      plannedStartTime: '2026-06-19T08:00:00',
      plannedEndTime: '2026-06-19T12:00:00'
    }
  });
});

// 62 - PUT /jobs/{jobId}/planning -> 200 OK
app.put('/jobs/:jobId/planning', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 63 - GET /jobs/{jobId} -> Job
app.get('/jobs/:jobId', (req, res) => {
  logRequest(req);
  res.json(sampleJob(req.params.jobId));
});

// 64 - DELETE /jobs/{jobId} -> 200 OK
app.delete('/jobs/:jobId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 65 - PATCH /jobs/{jobId} -> 200 OK
app.patch('/jobs/:jobId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 66 - GET /jobs/{jobId}/maintenance -> Maintenance
app.get('/jobs/:jobId/maintenance', (req, res) => {
  logRequest(req);
  res.json({
    moduleCategory: 'FACTORY',
    moduleCode: 'Eng_1',
    moduleVersion: '3.0',
    programCode: 'PERIODIC'
  });
});

// ----------------------------------------------------------------------------
// TAGS (VX5 67-69)
// ----------------------------------------------------------------------------

// 67 - DELETE /tags/{tagId} -> 200 OK
app.delete('/tags/:tagId', (req, res) => {
  logRequest(req);
  okNoBody(res);
});

// 68 - GET /work-orders/{workOrderId}/tags -> array de Tag
app.get('/work-orders/:workOrderId/tags', (req, res) => {
  logRequest(req);
  res.json([sampleTag(), sampleTag()]);
});

// 69 - POST /work-orders/{workOrderId}/tags -> 201 Created + Location
app.post('/work-orders/:workOrderId/tags', (req, res) => {
  logRequest(req);
  created(res, `/tags/${randomUUID()}`);
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock API BRABA rodando! 🚀'
  });
});


app.get('/scob-brabo', (req, res) => {
  logRequest(req);
  res.status(200).end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
