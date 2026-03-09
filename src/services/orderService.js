const repository = require("../repositories/orderRepository");

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

async function createOrder(data) {
  const order = mapRequestToOrder(data);
  await repository.createOrder(order);
  return order;
}

async function getOrder(orderId) {
  return repository.getOrder(orderId);
}

async function listOrders() {
  return repository.listOrders();
}

async function updateOrder(orderId, data) {
  const order = mapRequestToOrder(data);
  return repository.updateOrder(orderId, order);
}

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