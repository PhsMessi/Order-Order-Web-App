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

import { orderMenu } from "../public/data.js";

let checkoutTotal = 0;
displayProducts();
updateCart();
toggleModal();

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
