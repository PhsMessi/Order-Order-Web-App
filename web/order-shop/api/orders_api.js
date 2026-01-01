const BASE_URL = "http://localhost:3000/api";

export async function createOrder(orderData) {
  try {
    const response = await fetch(`${BASE_URL}/postOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllOrders() {
  try {
    const response = await fetch(`${BASE_URL}/getOrders`);
    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: error.message };
  }
}
