const pathParam = (name) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string' }
});

const jsonBody = {
  required: true,
  content: {
    'application/json': {
      schema: { type: 'object' }
    }
  }
};

// Monta uma operação protegida por Bearer.
const op = (summary, { params = [], body = false, responses } = {}) => {
  const operation = { summary, responses };
  if (params.length) {
    operation.parameters = params.map(pathParam);
  }
  if (body) {
    operation.requestBody = jsonBody;
  }
  return operation;
};

const OK = { 200: { description: 'OK' } };
const CREATED = { 201: { description: 'Criado' } };
const NO_CONTENT = { 204: { description: 'Removido' } };

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Mock API BRABA - Digital Dealer Scania',
    version: '1.0.0'
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  paths: {
    '/api/auth': {
      post: {
        summary: 'Autenticação BRABA',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  client_id: { type: 'string' },
                  client_secret: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login realizado com sucesso' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },

    // PARTS (VX5 43-47)
    '/parts/{partId}': {
      get: op('43 - Consulta uma peça', { params: ['partId'], responses: OK }),
      put: op('44 - Atualiza uma peça', { params: ['partId'], body: true, responses: OK }),
      delete: op('45 - Remove uma peça', { params: ['partId'], responses: NO_CONTENT })
    },
    '/jobs/{jobId}/parts': {
      get: op('46 - Lista as peças de uma tarefa', { params: ['jobId'], responses: OK }),
      post: op('47 - Adiciona uma peça à tarefa', { params: ['jobId'], body: true, responses: CREATED })
    },

    // LABOUR (VX5 48-52)
    '/labour/{labourId}': {
      get: op('48 - Consulta uma mão de obra', { params: ['labourId'], responses: OK }),
      put: op('49 - Atualiza uma mão de obra', { params: ['labourId'], body: true, responses: OK }),
      delete: op('50 - Remove uma mão de obra', { params: ['labourId'], responses: NO_CONTENT })
    },
    '/jobs/{jobId}/labour': {
      get: op('51 - Lista a mão de obra de uma tarefa', { params: ['jobId'], responses: OK }),
      post: op('52 - Adiciona mão de obra à tarefa', { params: ['jobId'], body: true, responses: CREATED })
    },

    // WORK ORDERS (VX5 53-58)
    '/work-orders/{workOrderId}/appointment': {
      get: op('53 - Consulta o agendamento da OS', { params: ['workOrderId'], responses: OK }),
      put: op('54 - Atualiza o agendamento da OS', { params: ['workOrderId'], body: true, responses: OK })
    },
    '/work-orders/{workOrderId}': {
      get: op('55 - Consulta uma ordem de serviço', { params: ['workOrderId'], responses: OK }),
      delete: op('56 - Remove uma ordem de serviço', { params: ['workOrderId'], responses: NO_CONTENT }),
      patch: op('57 - Atualiza parcialmente uma OS', { params: ['workOrderId'], body: true, responses: OK })
    },
    '/work-orders': {
      post: op('58 - Cria uma ordem de serviço', { body: true, responses: CREATED })
    },

    // JOBS (VX5 59-66)
    '/work-orders/{workOrderId}/jobs': {
      get: op('59 - Lista as tarefas de uma OS', { params: ['workOrderId'], responses: OK }),
      post: op('60 - Cria uma tarefa na OS', { params: ['workOrderId'], body: true, responses: CREATED })
    },
    '/jobs/{jobId}/planning': {
      get: op('61 - Consulta o planejamento da tarefa', { params: ['jobId'], responses: OK }),
      put: op('62 - Atualiza o planejamento da tarefa', { params: ['jobId'], body: true, responses: OK })
    },
    '/jobs/{jobId}': {
      get: op('63 - Consulta uma tarefa', { params: ['jobId'], responses: OK }),
      delete: op('64 - Remove uma tarefa', { params: ['jobId'], responses: NO_CONTENT }),
      patch: op('65 - Atualiza parcialmente uma tarefa', { params: ['jobId'], body: true, responses: OK })
    },
    '/jobs/{jobId}/maintenance': {
      get: op('66 - Consulta a manutenção da tarefa', { params: ['jobId'], responses: OK })
    },

    // TAGS (VX5 67-69)
    '/tags/{tagId}': {
      delete: op('67 - Remove uma TAG', { params: ['tagId'], responses: NO_CONTENT })
    },
    '/work-orders/{workOrderId}/tags': {
      get: op('68 - Lista as TAGs de uma OS', { params: ['workOrderId'], responses: OK }),
      post: op('69 - Adiciona uma TAG à OS', { params: ['workOrderId'], body: true, responses: CREATED })
    }
  }
};
