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

// must finish today inputs, validation use a package, async post for inputs

import { orderMenu } from "../public/data.js";
import { emailValidation } from "../utils/emailValidation.js";
import {
  phonePhValidation,
  formatPhoneNumber,
} from "../utils/phoneValidation.js";
let checkoutTotal = 0;
displayProducts();
updateCart();

toggleModal();
checkOutSlide();
prevSlide();
// for testing only call
// emailValidation("devshaiya23@gmail.com");
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
      // addtoCartModal(index, item);
      updateProductQuantity(index);
    });
    productList.appendChild(li);
  });
}

function updateProductQuantity(index) {
  orderMenu[index].quantity++;
  console.log(
    `product name: ${orderMenu[index].name} , quantity: ${orderMenu[index].quantity}`
  );
  updateCartModal();
}

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

  if (total > 0) {
    const totalItem = document.createElement("li");
    totalItem.className = "order-item total-item";
    totalItem.innerHTML = `
      <p><strong>Total</strong></p>
      <span><strong>$ ${total}</strong></span>
    `;

    orderList.appendChild(totalItem);
  }
}

function updateCart() {
  const badge = document.querySelector(".badge");
  const orderItem = document.querySelectorAll(".order-item");

  badge.textContent = orderItem.length;
}

function toggleModal() {
  const modal = document.querySelector(".modal");
  const toggleBtn = document.querySelector(".orders-cart");
  toggleBtn.addEventListener("click", () => {
    // console.log("clicked ok");
    modal.classList.toggle("hidden");
  });
}

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

function initReservation() {
  // first validation part
  const name = document.getElementsByName("name");
  const email = document.getElementsByName("email");
  const phone = document.getElementsByName("phone");
}
