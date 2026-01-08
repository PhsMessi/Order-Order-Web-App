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

import { orderMenu } from "../public/data.js";

displayProducts();
updateCart();
function displayProducts() {
  const productList = document.querySelector(".product-lists");
  productList.innerHTML = "";

  orderMenu.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
        <img src="${item.url}" alt="${item.url}">
        <p>${item.name}</p>
        <button class="addbtn">Add to cart</button>
    `;

    // li.addEventListener("click", () => {
    //   addtoCartModal(item);
    // });

    productList.appendChild(li);

    const addbtn = document.querySelector(".addbtn");
    addbtn.addEventListener("click", () => {
      addtoCartModal(item);
    });
  });
}

function addtoCartModal(item) {
  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";

  const li = document.createElement("li");

  item.forEach((item, index) => {
    // working part
  });
}

function updateCart() {
  let partial = 0;
  const badge = document.querySelector(".badge");
  const orderItem = document.querySelectorAll(".order-item");
  if (orderItem.length === 0) {
    badge.textContent = partial;
  }
  badge.textContent = orderItem.length;
}
