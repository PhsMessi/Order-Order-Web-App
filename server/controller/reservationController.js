import { mysql } from "../integrations/mysql.js";
import { reservationId } from "../utils/reservation_Id.js";

export function displayReservations(req, res) {
  try {
    const getAllReservations =
      "SELECT * FROM `reservations` ORDER BY order_created DESC";

    mysql.query(getAllReservations, (err, results) => {
      if (err) {
        console.log("error for getting all reservations", err);
        return res.status(500).json({
          message: "database query error",
          error: err.message,
        });
      }

      const reservations = results.map((reservation) => ({
        ...reservation,
        orderList: JSON.parse(reservation.orderList),
      }));

      return res.status(200).json({
        message: "fetching reservations success",
        reservations: reservations,
      });
    });
  } catch (error) {
    console.log("connection failed", error);
    res.status(500).json({ message: "failed request" });
  }
}

export function createReservation(req, res) {
  const maxRetries = 5;
  let attempt = 0;

  function attemptInsert() {
    try {
      const {
        customer_name,
        customer_phone,
        customer_email,
        orderList,
        total,
        money,
        change,
        paid,
        paymentMode,
        pickup_time_start,
        pickup_time_end,
      } = req.body;

      const reservationList = orderList.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const reserveListJSON = JSON.stringify(reservationList);
      const reservation_id = reservationId();

      const makeReserve =
        "INSERT INTO `reservations` (reservation_id, customer_name, customer_phone, customer_email, orderList, total, money, `change`, paid, paymentMode, pickup_time_start, pickup_time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      mysql.query(
        makeReserve,
        [
          reservation_id,
          customer_name,
          customer_phone,
          customer_email,
          reserveListJSON,
          total,
          money,
          change,
          paid || 0,
          paymentMode,
          pickup_time_start,
          pickup_time_end,
        ],
        (err, results) => {
          if (err) {
            // Handle duplicate reservation_id
            if (err.code === "ER_DUP_ENTRY") {
              attempt++;
              if (attempt < maxRetries) {
                console.log(
                  `Duplicate ID, retrying... (${attempt}/${maxRetries})`
                );
                return attemptInsert(); // Retry with new ID
              }
              return res.status(500).json({
                message: "Failed to generate unique reservation ID",
              });
            }

            console.log("query failed", err);
            return res.status(500).json({
              message: "database error",
              error: err.message,
            });
          }

          return res.status(201).json({
            message: "reservation created successfully",
            reservationId: reservation_id,
            pickupTime: {
              start: pickup_time_start,
              end: pickup_time_end,
            },
          });
        }
      );
    } catch (error) {
      console.log("connection failed", error);
      return res.status(500).json({ message: "failed request" });
    }
  }

  attemptInsert();
}
