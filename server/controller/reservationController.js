import { mysql } from "../integrations/mysql.js";

export function displayReservations(req, res) {
  try {
    const getAllReservations =
      "SELECT * FROM `reservations` ORDER BY order_create DESC";

    mysql.query(getAllReservations, (err, results) => {
      if (err) {
        console.log("error for getting all reservations", err);
        return res.status(400).json({
          message: "database query",
          error: err.message,
        });
      }

      const reservations = results.map((products) => ({
        ...products,
        orderList: JSON.parse(products.orderList),
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

export function createReservation() {
  try {
  } catch (error) {
    console.log("connection failed", error);
    res.status(500).json({ message: "failed request" });
  }
}
