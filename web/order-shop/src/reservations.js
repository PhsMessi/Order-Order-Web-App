// reservations logic will be here

// things to consider
// adding table to the database for reservations(Done)
// Initiallizing the reservations table to integrations folder
// updating the api for reservations

// ------------------------------------
//apiController for reservations

// --reservationController.js globally function

// function names

// -- displayReservations(), createReservation(), (DONE)

// ------------------------------------

// Done testing displayReservations(), createReservation() API in Postman
// Making API key and Securing Admin endpoints(Done)

//adding item quantity in the modal without duplicating its element (Done)

//add checkout new slide inside modal(Done)
// add all inputs must based in the mysql database(Done)
// must add a warning of cancellation or reservation in which the after 5 mins the order wont be able to cancel.

// ------------------------------------
//final algorithm
// 1. the checkout reservation from user UI
// 2. after the reservation complete we will send an email cofirmation
// 3. then checkout data and inputs will post to the data base.
// 4. the columns of (money and change) will show NA
// 5. then  status will automatically post as "pending"

//----------------------------------------

// must finish today inputs(Done), validation use a package(Done), async post for inputs (Done)
// Post reservation API Call (Done)
//-----------------------------------------------------------------------
// Must make a confirmation email with nodejs package
import { orderMenu } from "../public/data.js";
import { emailValidation } from "../utils/emailValidation.js";
import {
  phonePhValidation,
  formatPhoneNumber,
} from "../utils/phoneValidation.js";
import { createReservation, sendConfirmationEmail } from "../api/orders_api.js";
let checkoutTotal = 0;
displayProducts();
updateCart();

toggleModal();
checkOutSlide();
prevSlide();

// for testing again
initReservation();
//inputColor();

/* function that display products from imported orderMenu  */
function displayProducts() {
  const productList = document.querySelector(".product-lists");
  productList.innerHTML = "";

  orderMenu.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
        <img src="${item.url}" alt="${item.url}">
        <p>${item.name} <span>${item.price}</span></p>
        <button class="addbtn">Add to cart</button>
    `;

    const addbtn = li.querySelector(".addbtn");
    addbtn.addEventListener("click", () => {
      updateProductQuantity(index);
    });
    productList.appendChild(li);
  });
}
/* function that updated quantity in the orderMenu  */
function updateProductQuantity(index) {
  orderMenu[index].quantity++;
  console.log(
    `product name: ${orderMenu[index].name} , quantity: ${orderMenu[index].quantity}`
  );
  updateCartModal();
}

/* function that creates an "li" element and appends the element based on the quantity to the parent ul list */
/* it also add and event to each of the appended child elements to be remove from the order lists */
function updateCartModal() {
  console.log("called updatedCartModal");

  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";

  let total = 0;

  orderMenu.forEach((item, index) => {
    if (item.quantity > 0) {
      const orderItem = document.createElement("li");
      orderItem.className = "order-item";
      // total for checkout
      const partialTotal = item.price * item.quantity;
      total += partialTotal;

      orderItem.innerHTML = `
      <img src="${item.url}" alt="${item.name}"> <span>${item.name} x${item.quantity}</span>
      `;

      orderItem.addEventListener("click", () => {
        if (item.quantity > 1) {
          orderMenu[index].quantity--;
        } else {
          orderMenu[index].quantity = 0;
        }

        updateCartModal();
      });

      orderList.appendChild(orderItem);
      updateCart();
    }
  });

  checkoutTotal = total;

  /* this element will display of total is updated or greater than zero */
  if (total > 0) {
    const totalItem = document.createElement("li");
    totalItem.className = "order-item total-item";
    totalItem.innerHTML = `
      <p><strong>Total</strong></p>
      <span><strong>$ ${total}</strong></span>
    `;

    orderList.appendChild(totalItem);
    filteredQuantity();
  }
}

/* function that update the state of icon depending on that length of order lists */
function updateCart() {
  const badge = document.querySelector(".badge");
  const orderItem = document.querySelectorAll(".order-item");

  badge.textContent = orderItem.length;
}

/* function for opening and closing a modal for checkout */
function toggleModal() {
  const modal = document.querySelector(".modal");
  const toggleBtn = document.querySelector(".orders-cart");
  toggleBtn.addEventListener("click", () => {
    modal.classList.toggle("hidden");
  });
}

/* function that open the slide modal for user info checkout*/
function checkOutSlide() {
  const checkoutbtn = document.querySelector(".checkoutbtn");
  checkoutbtn.addEventListener("click", () => {
    const slide1 = document.querySelector(".slide1");
    const slide2 = document.querySelector(".slide2");

    if (slide2.classList.contains("hidden")) {
      slide1.classList.add("hidden");
      slide2.classList.remove("hidden");
    } else {
      slide2.classList.add("hidden");
    }
  });
}

/* function that goes back to the first modal slide */
function prevSlide() {
  const slidebtn2 = document.querySelector(".btn-slide2");
  slidebtn2.addEventListener("click", () => {
    const slide1 = document.querySelector(".slide1");
    const slide2 = document.querySelector(".slide2");

    if (slide1.classList.contains("hidden")) {
      slide2.classList.add("hidden");
      slide1.classList.remove("hidden");
    }
  });
}

/* function to that process user inputs for reservatons and calling call a API function */
function initReservation() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const paymentbtn = document.querySelectorAll(".mode-btn");

  const slide2CheckoutBtn = document.querySelector(".slide2 .checkoutbtn");

  // name
  name.addEventListener("blur", (e) => {
    const value = e.target.value.trim();
    name.classList.remove("valid", "invalid", "neutral");

    if (value.length >= 3) {
      name.classList.add("valid");
      console.log("Valid name");
    } else {
      name.classList.add("invalid");
      console.log("Invalid name - too short");
    }
  });
  //email
  email.addEventListener("blur", (e) => {
    const value = e.target.value.trim();
    email.classList.remove("valid", "invalid", "neutral");

    if (emailValidation(value)) {
      email.classList.add("valid");
      console.log("Valid email");
    } else {
      email.classList.add("invalid");
      console.log("Invalid email");
    }
  });
  // phone
  phone.addEventListener("blur", (e) => {
    const value = e.target.value.trim();
    phone.classList.remove("valid", "invalid", "neutral");

    if (phonePhValidation(value)) {
      phone.classList.add("valid");
      console.log("Valid phone");
    } else {
      phone.classList.add("invalid");
      console.log("Invalid phone");
    }
  });

  //payment mode selection
  paymentbtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      paymentbtn.forEach((i) => i.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  slide2CheckoutBtn.addEventListener("click", async () => {
    // final check inputs
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const pickupTime = document.getElementById("pickup-time").value;

    if (nameValue.length < 3) {
      alert("Please enter a valid name (at least 3 characters)");
      name.focus();
      return;
    }

    if (!emailValidation(emailValue)) {
      alert("Please enter a valid email address");
      email.focus();
      return;
    }

    if (!phonePhValidation(phoneValue)) {
      alert("Please enter a valid phone number");
      phone.focus();
      return;
    }

    if (!pickupTime) {
      alert("Please select a pickup time");
      return;
    }

    // All validations passed - process reservation
    await processReservation(nameValue, phoneValue, emailValue);
  });
}

/* function that displays order summary for checkout slide 2 */
function filteredQuantity() {
  const summary = document.querySelector(".summary");
  const summaryTotal = document.querySelector(".summary-total");

  const orderList = orderMenu.filter((item) => item.quantity > 0);

  const orderSummary = orderList
    .map(
      (item) =>
        `${item.name} x${item.quantity} - $${item.price * item.quantity}`
    )
    .join("\n");

  summary.textContent = orderSummary;
  summaryTotal.textContent = `Total: $${checkoutTotal}`;

  console.log(orderSummary, checkoutTotal);
}

/* API POST calling  */

async function processReservation(name, phone, email) {
  const selectedPaymentBtn = document.querySelector(".mode-btn.selected");
  const paymentMode = selectedPaymentBtn
    ? selectedPaymentBtn.dataset.mode
    : "cash";
  const pickupTime = document.getElementById("pickup-time").value;

  // Calculate pickup time window (30 minutes)
  const pickupStart = new Date(pickupTime);
  const pickupEnd = new Date(pickupStart.getTime() + 30 * 60000);

  //  MySQL DATETIME
  const formatDateTime = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const reservationData = {
    customer_name: name,
    customer_phone: formatPhoneNumber(phone) || phone,
    customer_email: email,
    orderList: orderMenu.filter((item) => item.quantity > 0),
    total: checkoutTotal,
    money: 0,
    change: 0,
    paid: 0,
    paymentMode: paymentMode,
    pickup_time_start: formatDateTime(pickupStart),
    pickup_time_end: formatDateTime(pickupEnd),
  };

  console.log("Processing reservation:", reservationData);

  const result = await createReservation(reservationData);

  if (result.success) {
    // ✅ Send confirmation email
    try {
      const emailResult = await sendConfirmationEmail({
        email: email,
        name: name,
        reservationId: result.data.reservationId,
        pickupTime: pickupTime,
        orderList: reservationData.orderList,
        total: checkoutTotal,
      });

      if (emailResult.success) {
        console.log("Confirmation email sent successfully");
      } else {
        console.error("Failed to send email:", emailResult.error);
      }
    } catch (error) {
      console.error("Email error:", error);
      // Don't fail the reservation if email fails
    }

    alert(
      `Reservation successful!\nReservation ID: ${result.data.reservationId}\nPickup: ${pickupTime}\nConfirmation email sent to ${email}`
    );

    // Reset
    resetReservationForm();

    const slide1 = document.querySelector(".slide1");
    const slide2 = document.querySelector(".slide2");
    const modal = document.querySelector(".modal");

    slide2.classList.add("hidden");
    slide1.classList.remove("hidden");
    modal.classList.add("hidden");

    // Reset cart
    orderMenu.forEach((item) => (item.quantity = 0));
    updateCartModal();
  } else {
    alert(`Reservation failed: ${result.data?.message || result.error}`);
  }
}

/* function for resetting all user inputs if failed or success post api call */
function resetReservationForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("pickup-time").value = "";

  const inputs = document.querySelectorAll(".slide2 input");
  inputs.forEach((input) => {
    input.classList.remove("valid", "invalid");
  });

  const paymentBtns = document.querySelectorAll(".mode-btn");
  paymentBtns.forEach((btn) => btn.classList.remove("selected"));
  document.querySelector('[data-mode="cash"]').classList.add("selected");

  document.querySelector(".summary").textContent = "";
  document.querySelector(".summary-total").textContent = "";
}
