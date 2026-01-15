import { BASE_URL } from "../public/url.js";

/* get api request for all reservations  */
export async function getAllReservations() {
  try {
    const response = await fetch(`${BASE_URL}/reservations`, {
      method: "GET",
      headers: {
        "x-api-key": "beagolezcanon25",
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (err) {
    console.log("Error fetching all reservation", err);
    return { success: false, error: err.message };
  }
}
