import { timedate } from "./time_date.js";
import { getAllOrders } from "../api/orders_api.js";

timedate();
loadOrders();

/* async function that uses the getAllOrders Api to display or load all orders in the table async */

async function loadOrders() {
  const tableBody = document.getElementById("ordersTableBody");

  tableBody.innerHTML = `
    <tr>
      <td colspan="8" class="loading">Loading orders...</td>
    </tr>
  `;

  const result = await getAllOrders();

  if (result.success && result.data.orders.length > 0) {
    tableBody.innerHTML = result.data.orders
      .map((order) => {
        const items = order.orderList
          .map(
            (item) =>
              `<li>${item.name} (x${item.quantity}) - $${
                item.price * item.quantity
              }</li>`
          )
          .join("");

        const date = moment(order.order_created).format(
          "MMM DD, YYYY - hh:mm A"
        );

        return `
          <tr>
            <td>#${order.orderId}</td>
            <td>${order.customerName || "Guest"}</td>
            <td><ul class="order-items-list">${items}</ul></td>
            <td><strong>$${order.total}</strong></td>
            <td>${order.paymentMode || "Cash"}</td>
            <td>$${order.money}</td>
            <td>$${order.change}</td>
            <td>${date}</td>
          </tr>
        `;
      })
      .join("");
  } else {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="no-orders">No orders found</td>
      </tr>
    `;
  }
}
