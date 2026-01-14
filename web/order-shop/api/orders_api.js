const BASE_URL = "http://localhost:3000/api";

/* post api request for posting order to database */
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${BASE_URL}/postOrder`, {
      method: "POST",
      headers: {
        "x-api-key": "beagolezcanon25",
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

/* get api request for getting orders */

export async function getAllOrders() {
  try {
    const response = await fetch(`${BASE_URL}/getOrders`, {
      method: "GET",
      headers: {
        "x-api-key": "beagolezcanon25",
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: error.message };
  }
}

/* post api request for reservation*/

export async function createReservation(reservationData) {
  try {
    const response = await fetch(`${BASE_URL}/createReservation`, {
      method: "POST",
      headers: {
        "x-api-key": "beagolezcanon25",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false, error: error.message };
  }
}

export async function sendConfirmationEmail(emailData) {
  try {
    const response = await fetch(`${BASE_URL}/emailConfirmation`, {
      method: "POST",
      headers: {
        "x-api-key": "beagolezcanon25",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
