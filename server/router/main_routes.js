import express from "express";
import { createOrder, getOrders } from "../controller/orderController.js";
import {
  displayReservations,
  createReservation,
} from "../controller/reservationController.js";

import { api_key_auth } from "../middleware/api_key_auth.js";
const router = express.Router();

router.post("/postOrder", api_key_auth, createOrder);
router.get("/getOrders", api_key_auth, getOrders);

// reservations
router.post("/createReservation", api_key_auth, createReservation);

router.get("/reservations", api_key_auth, displayReservations);

export default router;
