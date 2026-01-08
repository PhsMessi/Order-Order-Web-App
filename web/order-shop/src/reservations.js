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

    const addbtn = li.querySelector(".addbtn");
    addbtn.addEventListener("click", () => {
      addtoCartModal(index, item);
    });
    productList.appendChild(li);
  });
}

function addtoCartModal(index, item) {
  const orderList = document.querySelector(".order-list");

  const li = document.createElement("li");
  li.className = "order-item";
  li.innerHTML = `
  <img src="${item.url}" alt="${item.name}"> 
    <span>${item.name} x1</span>
  `;

  orderList.appendChild(li);
  updateCart();
}

function updateCart() {
  const badge = document.querySelector(".badge");
  const orderItem = document.querySelectorAll(".order-item");

  badge.textContent = orderItem.length;
}
