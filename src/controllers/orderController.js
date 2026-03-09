const orderService = require("../services/orderService");
const orderRepository = require("../repositories/orderRepository");

/**
 * Controller for handling order-related HTTP requests.
 * All functions are async and return JSON responses.
 */

/**
 * Create a new order.
 * @returns {Promise<void>}
 * @example
 * // POST /order
 * // body: { numeroPedido, valorTotal, dataCriacao, items: [{ idItem, quantidadeItem, valorItem }] }
 */
exports.createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * List all orders.
 * @returns {Promise<void>}
 * @example
 * // GET /orders
 */
exports.listOrders = async (req, res) => {
  try {
    const orders = await orderService.listOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single order by ID.
 * @returns {Promise<void>}
 * @example
 * // GET /orders/:id
 */
exports.getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an existing order by ID.
 * @returns {Promise<void>}
 * @example
 * // PUT /orders/:id
 * // body: { valorTotal, creationDate?, items? }
 */
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Delete an order by ID.
 * @returns {Promise<void>}
 * @example
 * // DELETE /orders/:id
 */
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      return res.status(200).json({ message: "Order deleted" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};