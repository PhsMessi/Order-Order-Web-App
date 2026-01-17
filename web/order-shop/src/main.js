import { timedate } from "./time_date.js";
import { createOrder } from "../api/orders_api.js";
import { orderMenu } from "../public/data.js";
timedate();

let currentTotal = 0;
let selectedMoney = 0;
let paymentMode = "cash";

switchButton();
renderProducts("bread"); // Start by showing bread
initCheckout();

window.addEventListener("openReservationCheckout", (e) => {
  handleReservationCheckout(e.detail);
});

/* function that switch the buttonfor showing bread or coffee products */
function switchButton() {
  const navBtn = document.querySelectorAll(".nav-btn");
  navBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      navBtn.forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");

      if (index === 0) {
        renderProducts("bread");
      } else {
        renderProducts("drinks");
      }
    });
  });
}

/* function to reder products from orderMenu */
function renderProducts(type) {
  const itemLists = document.querySelector(".item-lists");
  itemLists.innerHTML = "";

  orderMenu.forEach((item, index) => {
    if (item.type === type) {
      const li = document.createElement("li");
      li.className = "item";
      li.innerHTML = `
        <img src="${item.url}" alt="${item.name}" />
        <p>${item.name}</p>
      `;

      li.addEventListener("click", () => {
        addingNewOrder(index);
      });

      itemLists.appendChild(li); //  append to DOM!
    }
  });
}

/* function that updated the quantity and calls the updatedLists */

function addingNewOrder(index) {
  orderMenu[index].quantity++;
  updateOrderList();
}

/* function that updates the orderlist based on the quantity of the products */
/* also adding event for each item for removing is from the parent order list */
function updateOrderList() {
  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";

  let total = 0;

  orderMenu.forEach((item, index) => {
    if (item.quantity > 0) {
      const orderItem = document.createElement("li");
      orderItem.className = "order-item";

      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      orderItem.innerHTML = `
        <p>${item.name} (x${item.quantity})</p>
        <span>$ ${itemTotal}</span>
      `;

      // decrease quantity
      orderItem.addEventListener("click", () => {
        if (item.quantity > 1) {
          orderMenu[index].quantity--;
        } else {
          orderMenu[index].quantity = 0;
        }
        updateOrderList();
      });

      orderList.appendChild(orderItem);
    }
  });

  currentTotal = total;

  // total
  /* this element will display of total is updated or greater than zero */
  if (total > 0) {
    const totalItem = document.createElement("li");
    totalItem.className = "order-item total-item";
    totalItem.innerHTML = `
      <p><strong>Total</strong></p>
      <span><strong>$ ${total}</strong></span>
    `;
    orderList.appendChild(totalItem);
  }

  // checkout button
  /* checkout button that will be created and displayed if total is greater than zero */
  if (total > 0) {
    const checkout = document.createElement("button");
    checkout.className = "checkout";
    checkout.textContent = "CHECKOUT";
    checkout.addEventListener("click", openCheckoutModal);
    orderList.appendChild(checkout);
  }
}

/* function for getting all the inputs and selection button in the modal checkout */
function initCheckout() {
  const modal = document.getElementById("checkoutModal");
  const closeBtn = document.querySelector(".close");
  const doneBtn = document.querySelector(".done-btn");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const moneyButtons = document.querySelectorAll(".money-btn");
  const customAmount = document.getElementById("customAmount");
  const cashSection = document.getElementById("cashSection");
  const gcashSection = document.getElementById("gcashSection");

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      paymentMode = btn.dataset.mode;

      if (paymentMode === "cash") {
        cashSection.style.display = "block";
        gcashSection.style.display = "none";
      } else {
        cashSection.style.display = "none";
        gcashSection.style.display = "block";
      }
    });
  });

  moneyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      moneyButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      selectedMoney = parseInt(btn.dataset.amount);
      customAmount.value = selectedMoney;
      calculateChange();
    });
  });

  customAmount.addEventListener("input", () => {
    moneyButtons.forEach((b) => b.classList.remove("selected"));
    selectedMoney = parseInt(customAmount.value) || 0;
    calculateChange();
  });

  doneBtn.addEventListener("click", () => {
    const customerName = document.getElementById("customerName").value.trim();

    if (!customerName) {
      alert("Please enter customer name!");
      return;
    }

    if (paymentMode === "cash") {
      if (selectedMoney < currentTotal) {
        alert("Insufficient payment amount!");
        return;
      }
    }

    processOrder(customerName);
    modal.style.display = "none";
  });
}

function openCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  document.getElementById("modalTotal").textContent = currentTotal;
  document.getElementById("gcashTotal").textContent = currentTotal;
  modal.style.display = "block";
  resetModal();
}

function calculateChange() {
  const change = selectedMoney - currentTotal;
  document.getElementById("changeAmount").textContent =
    change >= 0 ? change : 0;
}

function resetModal() {
  document.getElementById("customerName").value = "";
  document.getElementById("customAmount").value = "";
  document.getElementById("changeAmount").textContent = "0";
  selectedMoney = 0;

  document.querySelectorAll(".money-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
}

// NEW: Handle reservation checkout
function handleReservationCheckout(reservationData) {
  console.log("Processing reservation:", reservationData);

  // Set reservation mode
  isProcessingReservation = true;
  currentReservationId = reservationData.reservation_id;

  // Reset current order and populate with reservation items
  orderMenu.forEach((item) => (item.quantity = 0));

  reservationData.orderList.forEach((resItem) => {
    const menuItem = orderMenu.find((item) => item.name === resItem.name);
    if (menuItem) {
      menuItem.quantity = resItem.quantity;
    }
  });

  // Update the order list display
  updateOrderList();

  // Set the total
  currentTotal = parseFloat(reservationData.total);

  // Set payment mode
  paymentMode = reservationData.paymentMode || "cash";

  // Open checkout modal
  const modal = document.getElementById("checkoutModal");
  document.getElementById("modalTotal").textContent = currentTotal;
  document.getElementById("gcashTotal").textContent = currentTotal;

  // Pre-fill customer name
  document.getElementById("customerName").value =
    reservationData.customer_name || "";

  // Set payment mode button
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.mode === paymentMode) {
      btn.classList.add("active");
    }
  });

  // Show appropriate payment section
  const cashSection = document.getElementById("cashSection");
  const gcashSection = document.getElementById("gcashSection");

  if (paymentMode === "cash") {
    cashSection.style.display = "block";
    gcashSection.style.display = "none";
  } else {
    cashSection.style.display = "none";
    gcashSection.style.display = "block";
  }

  modal.style.display = "block";
}

/* async function for api posting for order to the database */
async function processOrder(customerName) {
  const orderData = {
    customerName: customerName,
    orderList: orderMenu.filter((p) => p.quantity > 0),
    total: currentTotal,
    paymentMode: paymentMode,
    money: selectedMoney,
    change: selectedMoney - currentTotal,
  };

  const result = await createOrder(orderData);

  if (result.success) {
    console.log("Order saved:", result.data);

    orderMenu.forEach((p) => (p.quantity = 0));
    updateOrderList();

    //success modal should be heree
    displaySuccessModal();

    setTimeout(endSuccessModal, 2000);
  } else {
    alert("Failed to save order: " + (result.data?.message || result.error));
  }
}

function endSuccessModal() {
  const successModal = document.querySelector(".success-modal");
  successModal.classList.add("hidden");
}

function displaySuccessModal() {
  const successModal = document.querySelector(".success-modal");
  successModal.classList.remove("hidden");
}
