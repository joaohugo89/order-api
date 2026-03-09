const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order API",
      version: "1.0.0",
      description: "API for creating and managing orders"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        // Request body schema
        CreateOrderRequest: {
          type: "object",
          properties: {
            numeroPedido: { type: "string", example: "v10089015vdb-01" },
            valorTotal: { type: "number", format: "float", example: 10000 },
            dataCriacao: { type: "string", format: "date-time", example: "2023-07-19T12:24:11.5299601+00:00" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  idItem: { type: "string", example: "2434" },
                  quantidadeItem: { type: "integer", example: 1 },
                  valorItem: { type: "number", format: "float", example: 1000 }
                },
                required: ["idItem", "quantidadeItem", "valorItem"]
              }
            }
          },
          required: ["numeroPedido", "valorTotal", "dataCriacao", "items"]
        },
        // Response schema (after mapping inside controller)
        Order: {
          type: "object",
          properties: {
            orderId: { type: "string", example: "v10089015vdb" },
            value: { type: "number", format: "float", example: 10000 },
            creationDate: { type: "string", format: "date-time", example: "2023-07-19T12:24:11.529Z" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "integer", example: 2434 },
                  quantity: { type: "integer", example: 1 },
                  price: { type: "number", format: "float", example: 1000 }
                },
                required: ["productId", "quantity", "price"]
              }
            }
          },
          required: ["orderId", "value", "creationDate", "items"]
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Resource not found" },
            code: { type: "integer", example: 404 }
          }
        }
      },
      requestBodies: {
        CreateOrderBody: {
          description: "Order creation request body",
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" }
            }
          }
        }
      }
    },
    tags: [
      { name: "Orders", description: "Operations related to orders" }
    ]
  },
  apis: ["./src/routes/*.js"] // your route files with JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;