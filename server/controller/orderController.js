import { mysql } from "../integrations/mysql.js";

export function createOrder(req, res) {
  try {
    const {
      customerName,
      orderList,
      total,
      paymentMode,
      money,
      change,
      reservationId, // NEW: Optional reservation ID
    } = req.body;

    const cleanedOrderList = orderList.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Convert to JSON string
    const orderListJSON = JSON.stringify(cleanedOrderList);

    const makeOrder =
      "INSERT INTO `order` (customerName, orderList, total, paymentMode, money, `change`) VALUES (?, ?, ?, ?, ?, ?)";

    mysql.query(
      makeOrder,
      [
        customerName || "Guest",
        orderListJSON,
        total,
        paymentMode || "cash",
        money,
        change,
      ],
      (err, results) => {
        if (err) {
          console.log("query failed", err);
          return res
            .status(500)
            .json({ message: "database error", error: err.message });
        }

        const orderId = results.insertId;

        // NEW: If this order is from a reservation, update the reservation
        if (reservationId) {
          const updateReservation = `
            UPDATE reservations 
            SET paid = 1, 
                money = ?, 
                \`change\` = ?,
                status = 'completed'
            WHERE reservation_id = ?
          `;

          mysql.query(
            updateReservation,
            [money, change, reservationId],
            (updateErr, updateResults) => {
              if (updateErr) {
                console.log("Failed to update reservation:", updateErr);
                // Don't fail the order if reservation update fails
                // Just log it and continue
              } else {
                console.log(
                  `Reservation ${reservationId} marked as paid and completed`,
                );
              }
            },
          );
        }

        return res.status(200).json({
          message: "order success",
          orderId: orderId,
          reservationId: reservationId || null,
          order: {
            customerName,
            orderList: cleanedOrderList,
            total,
            paymentMode,
            money,
            change,
          },
        });
      },
    );
  } catch (error) {
    console.log("Connection failed:", error);
    return res.status(400).json({ message: "Failed request" });
  }
}

export function getOrders(req, res) {
  try {
    const query = "SELECT * FROM `order` ORDER BY order_created DESC";

    mysql.query(query, (err, results) => {
      if (err) {
        console.log("query failed", err);
        return res
          .status(500)
          .json({ message: "database error", error: err.message });
      }

      // Parse orderList JSON for each order
      const orders = results.map((order) => ({
        ...order,
        orderList: JSON.parse(order.orderList),
      }));

      return res.status(200).json({
        message: "orders retrieved successfully",
        orders: orders,
      });
    });
  } catch (error) {
    console.log("Connection failed:", error);
    return res.status(500).json({ message: "Failed request" });
  }
}
