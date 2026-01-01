import express from "express";
import { createOrder, getOrders } from "../controller/orderController.js";

const router = express.Router();

router.post("/postOrder", createOrder);
router.get("/getOrders", getOrders);

export default router;
