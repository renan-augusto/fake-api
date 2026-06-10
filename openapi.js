module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Mock API BRABA',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
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
                  client_id: {
                    type: 'string'
                  },
                  client_secret: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso'
          },
          401: {
            description: 'Credenciais inválidas'
          }
        }
      }
    },

    '/parts/{partId}': {
      get: {
        summary: 'Consulta uma peça topzera',
        parameters: [
          {
            name: 'partId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Achou a braba'
          },
          404: {
            description: 'Peça não encontrada'
          }
        }
      }
    },

    '/work-orders/{workOrderId}': {
      patch: {
        summary: 'Atualiza uma ordem de serviço',
        parameters: [
          {
            name: 'workOrderId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Atualização realizada'
          }
        }
      }
    }
  }
};