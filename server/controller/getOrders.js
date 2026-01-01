// import { mysql } from "../integrations/mysql.js";

// export function getOrders(req, res) {
//   try {
//     const query = "SELECT * FROM `order` ORDER BY order_created DESC";

//     mysql.query(query, (err, results) => {
//       if (err) {
//         console.log("query failed", err);
//         return res
//           .status(500)
//           .json({ message: "database error", error: err.message });
//       }

//       // Parse orderList JSON for each order
//       const orders = results.map((order) => ({
//         ...order,
//         orderList: JSON.parse(order.orderList),
//       }));

//       return res.status(200).json({
//         message: "orders retrieved successfully",
//         orders: orders,
//       });
//     });
//   } catch (error) {
//     console.log("Connection failed:", error);
//     return res.status(500).json({ message: "Failed request" });
//   }
// }
