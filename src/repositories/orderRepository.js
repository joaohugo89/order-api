const db = require("../database/db");

/**
 * Creates a new order with its items in the database.
 *
 * @param {Object} order - The order object
 * @param {string} order.orderId - Unique order ID
 * @param {number} order.value - Total value of the order
 * @param {string} order.creationDate - ISO date string of order creation
 * @param {Array<Object>} order.items - List of items
 * @param {number} order.items[].productId - Product ID
 * @param {number} order.items[].quantity - Quantity of product
 * @param {number} order.items[].price - Price of product
 * @returns {Promise<Object>} The created order object
 * @throws Will throw an error if the transaction fails
 */
async function createOrder(order) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO "Order"(orderId, value, creationDate)
       VALUES ($1,$2,$3)`,
      [order.orderId, order.value, order.creationDate]
    );

    for (const item of order.items || []) {
      await client.query(
        `INSERT INTO "Items"(orderId, productId, quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [order.orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    return order;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


/**
 * Retrieves a single order by ID, including its items.
 *
 * @param {string} orderId - The order ID
 * @returns {Promise<Object|null>} The order object with items or null if not found
 */
async function getOrder(orderId) {
  const order = await db.query(
    `SELECT orderId, value, creationDate 
     FROM "Order" 
     WHERE orderId=$1`,
    [orderId]
  );

  if (order.rows.length === 0) return null;

  const items = await db.query(
    `SELECT productId, quantity, price 
     FROM "Items" 
     WHERE orderId=$1`,
    [orderId]
  );

  return {
    ...order.rows[0],
    items: items.rows
  };
}

/**
 * Retrieves all orders without their items.
 *
 * @returns {Promise<Array<Object>>} List of all orders
 */
async function listOrders() {
  const result = await db.query(
    `SELECT orderId, value, creationDate FROM "Order"`
  );

  return result.rows;
}


/**
 * Updates an existing order and its items.
 *
 * @param {string} orderId - The order ID to update
 * @param {Object} order - The updated order object
 * @param {number} order.value - Updated total value
 * @param {string} [order.creationDate] - Updated creation date (optional)
 * @param {Array<Object>} [order.items] - Updated list of items (optional)
 * @param {number} order.items[].productId - Product ID
 * @param {number} order.items[].quantity - Quantity of product
 * @param {number} order.items[].price - Price of product
 * @returns {Promise<Object>} The updated order object
 */
async function updateOrder(orderId, order) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE "Order"
       SET value = $1,
           creationDate = COALESCE($2, creationDate)
       WHERE orderId = $3`,
      [order.value, order.creationDate, orderId]
    );

    const items = order.items || [];
    const newProductIds = items.map(i => Number(i.productId));

    const existingItemsResult = await client.query(
      `SELECT productId FROM "Items" WHERE orderId = $1`,
      [orderId]
    );

    const existingProductIds = existingItemsResult.rows.map(r => r.productid);

    for (const item of items) {
      if (existingProductIds.includes(item.productId)) {
        await client.query(
          `UPDATE "Items"
           SET quantity = $1,
               price = $2
           WHERE orderId = $3
           AND productId = $4`,
          [item.quantity, item.price, orderId, item.productId]
        );
      } else {
        await client.query(
          `INSERT INTO "Items"(orderId, productId, quantity, price)
           VALUES ($1,$2,$3,$4)`,
          [orderId, item.productId, item.quantity, item.price]
        );
      }
    }

    if (newProductIds.length > 0) {
      await client.query(
        `DELETE FROM "Items"
         WHERE orderId = $1
         AND productId <> ALL($2::int[])`,
        [orderId, newProductIds]
      );
    } else {
      await client.query(
        `DELETE FROM "Items" WHERE orderId = $1`,
        [orderId]
      );
    }

    await client.query("COMMIT");

    return await getOrder(orderId);

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Deletes an order and all its items.
 *
 * @param {string} orderId - The order ID to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteOrder(orderId) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `DELETE FROM "Items" WHERE orderId = $1`,
      [orderId]
    );

    const result = await client.query(
      `DELETE FROM "Order" WHERE orderId = $1`,
      [orderId]
    );

    await client.query("COMMIT");

    return result.rowCount > 0;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder
};