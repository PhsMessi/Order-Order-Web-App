import { getAllReservations } from "../api/reservation_api.js";

initReservations();

async function initReservations() {
  const tableBody = document.querySelector("#reserveTableBody");

  tableBody.innerHTML = `
    <tr>
      <td colspan="12" class="loading">Loading reservations...</td>
    </tr>
  `;

  const result = await getAllReservations();

  if (!result.success) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="12" class="error">Failed to load reservations</td>
      </tr>
    `;
    return;
  }

  if (result.data.reservations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="12" class="empty">No reservations found</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = result.data.reservations
    .map((data) => {
      const items = data.orderList
        .map(
          (item) => `
          <li>${item.name} (x${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>
        `
        )
        .join("");

      const date = moment(data.order_created).format("MMM DD, YYYY - hh:mm A");
      const pickupTime = `${moment(data.pickup_time_start).format(
        "hh:mm A"
      )} - ${moment(data.pickup_time_end).format("hh:mm A")}`;

      return `
      <tr>
        <td>#${data.reservation_id}</td>
        <td>${data.customer_name || "Guest"}</td>
        <td>${data.customer_email}</td>
        <td>${data.customer_phone || "N/A"}</td>
        <td><ul class="order-items-list">${items}</ul></td>
        <td><strong>$${parseFloat(data.total).toFixed(2)}</strong></td>
        <td>${data.paymentMode || "Cash"}</td>
        <td>$${parseFloat(data.money).toFixed(2)}</td>
        <td>$${parseFloat(data.change).toFixed(2)}</td>
        <td>${pickupTime}</td>
        <td>${data.paid ? "Paid" : "Unpaid"}</td>
        <td><span class="status-${data.status}">${data.status}</span></td>
      </tr>
    `;
    })
    .join("");
}
