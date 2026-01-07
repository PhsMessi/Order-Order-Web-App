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

function displayProducts() {
  const productList = document.querySelector(".product-lists");
  productList.innerHTML = "";

  orderMenu.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
        <img src="${item.url}" alt="${item.url}">
        <p>${item.name}</p>
        <button>Add to cart</button>
    `;

    productList.appendChild(li);
  });
}
