import { mysql } from "../integrations/mysql.js";
import { reservationId } from "../utils/reservation_Id.js";
import nodemailer from "nodemailer";
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

    // Remove reservation_id from INSERT
    const makeReserve =
      "INSERT INTO `reservations` (customer_name, customer_phone, customer_email, orderList, total, money, `change`, paid, paymentMode, pickup_time_start, pickup_time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    mysql.query(
      makeReserve,
      [
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
          console.log("query failed", err);
          return res.status(500).json({
            message: "database error",
            error: err.message,
          });
        }

        return res.status(201).json({
          message: "reservation created successfully",
          reservationId: results.insertId,
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function confirmationEmail(req, res) {
  try {
    const { email, name, reservationId, pickupTime, orderList, total } =
      req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reservation Confirmation - #${reservationId}`,
      html: `
      <h2>Thank you for your reservation, ${name}!</h2>
      <p><strong>Reservation ID:</strong> ${reservationId}</p>
      <p><strong>Pickup Time:</strong> ${pickupTime}</p>
      <h3>Order Details:</h3>
      <ul>
        ${orderList
          .map(
            (item) =>
              `<li>${item.name} x${item.quantity} - $${(
                item.price * item.quantity
              ).toFixed(2)}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>We look forward to serving you!</p>
    `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
