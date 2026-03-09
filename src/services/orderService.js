const repository = require("../repositories/orderRepository");

/**
 * Maps incoming request data to the internal Order format.
 *
 * @param {Object} data - The request body data
 * @param {string} data.numeroPedido - Original order number
 * @param {number} data.valorTotal - Total value of the order
 * @param {string} data.dataCriacao - ISO date string for creation
 * @param {Array<Object>} data.items - Array of order items
 * @param {string} data.items[].idItem - Product ID as string
 * @param {number} data.items[].quantidadeItem - Quantity of the product
 * @param {number} data.items[].valorItem - Price of the product
 * @returns {Object} Mapped order object
 * @returns {string} return.orderId - Internal order ID
 * @returns {number} return.value - Total value
 * @returns {Date} return.creationDate - Date object
 * @returns {Array<Object>} return.items - Mapped items
 * @returns {number} return.items[].productId - Product ID as number
 * @returns {number} return.items[].quantity - Quantity
 * @returns {number} return.items[].price - Price
 */
function mapRequestToOrder(data) {
  return {
    orderId: data.numeroPedido,
    value: data.valorTotal,
    creationDate: new Date(data.dataCriacao),
    items: data.items.map(item => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };
}

/**
 * Creates a new order and saves it in the database.
 *
 * @param {Object} data - Order data from the request body
 * @returns {Promise<Object>} The created order object
 */
async function createOrder(data) {
  const order = mapRequestToOrder(data);
  await repository.createOrder(order);
  return order;
}

/**
 * Retrieves an order by its ID.
 *
 * @param {string} orderId - The ID of the order
 * @returns {Promise<Object|null>} The order object if found, otherwise null
 */
async function getOrder(orderId) {
  return repository.getOrder(orderId);
}

/**
 * Retrieves a list of all orders.
 *
 * @returns {Promise<Array<Object>>} Array of all orders
 */
async function listOrders() {
  return repository.listOrders();
}

/**
 * Updates an existing order by its ID.
 *
 * @param {string} orderId - The ID of the order to update
 * @param {Object} data - Updated order data
 * @returns {Promise<Object>} The updated order object
 */
async function updateOrder(orderId, data) {
  const order = mapRequestToOrder(data);
  return repository.updateOrder(orderId, order);
}

/**
 * Deletes an order by its ID.
 *
 * @param {string} orderId - The ID of the order to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteOrder(orderId) {
  return repository.deleteOrder(orderId);
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder
};