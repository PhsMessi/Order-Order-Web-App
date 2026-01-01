import { timedate } from "./time_date.js";
import { createOrder } from "../api/orders_api.js";

timedate();

const pastries = [
  {
    name: "Cake",
    url: "https://www.kumori.com.ph/cdn/shop/files/Screenshot_2024-11-05_at_10.20.20_AM.png?v=1730773240",
    price: 200,
    quantity: 0,
  },
  {
    name: "Croissant",
    url: "https://assets.bonappetit.com/photos/68e6b4a316c63f9625380e02/1:1/w_2560%2Cc_limit/1025_Dominique-Ansel-RECIPE.jpg",
    price: 75,
    quantity: 0,
  },
  {
    name: "Italian loaf bread",
    url: "https://breadsandsweets.com/wp-content/uploads/2022/05/everyday-bread-sq-1-of-1.jpg",
    price: 200,
    quantity: 0,
  },
  {
    name: "Brownies",
    url: "https://beyondfrosting.com/wp-content/uploads/2022/07/Cocoa-Powder-Brownies-3960.jpg",
    price: 60,
    quantity: 0,
  },
  {
    name: "Sausage bread",
    url: "https://www.lovebakesgoodcakes.com/wp-content/uploads/2018/04/Sausage-Bread-square.jpg",
    price: 75,
    quantity: 0,
  },
  {
    name: "Garlic bread",
    url: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/5/28/2/TM1A14F_Garlic-Bread_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1433523400627.webp",
    price: 40,
    quantity: 0,
  },
];

let currentTotal = 0;
let selectedMoney = 0;
let paymentMode = "cash";

renderPastry();
initCheckout();

function renderPastry() {
  const itemLists = document.querySelector(".item-lists");
  itemLists.innerHTML = "";

  pastries.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
    <img src="${item.url}"  alt="${item.name}" value="${item.price}" />
    <p> ${item.name} </p>
    `;

    li.addEventListener("click", () => {
      addingOrder(index);
    });

    itemLists.appendChild(li);
  });
}

function addingOrder(index) {
  pastries[index].quantity++;
  updateOrderList();
}

function updateOrderList() {
  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";

  let total = 0;

  // Adding items to the order-list
  pastries.forEach((item, index) => {
    if (item.quantity > 0) {
      const orderItem = document.createElement("li");
      orderItem.className = "order-item";

      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      orderItem.innerHTML = `
        <p>${item.name} (x${item.quantity})</p>
        <span>$ ${itemTotal}</span>
      `;

      // Add click listener to decrease quantity
      orderItem.addEventListener("click", () => {
        if (item.quantity > 1) {
          pastries[index].quantity--;
        } else {
          pastries[index].quantity = 0;
        }
        updateOrderList();
      });

      orderList.appendChild(orderItem);
    }
  });

  currentTotal = total;

  // Add total row
  if (total > 0) {
    const totalItem = document.createElement("li");
    totalItem.className = "order-item total-item";
    totalItem.innerHTML = `
      <p><strong>Total</strong></p>
      <span><strong>$ ${total}</strong></span>
    `;
    orderList.appendChild(totalItem);
  }

  // Add checkout button
  if (total > 0) {
    const checkout = document.createElement("button");
    checkout.className = "checkout";
    checkout.textContent = "CHECKOUT";
    checkout.addEventListener("click", openCheckoutModal);
    orderList.appendChild(checkout);
  }
}

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

async function processOrder(customerName) {
  const orderData = {
    customerName: customerName,
    orderList: pastries.filter((p) => p.quantity > 0),
    total: currentTotal,
    paymentMode: paymentMode,
    money: selectedMoney,
    change: selectedMoney - currentTotal,
  };

  const result = await createOrder(orderData);

  if (result.success) {
    console.log("Order saved:", result.data);

    pastries.forEach((p) => (p.quantity = 0));
    updateOrderList();

    alert(
      `Order confirmed for ${customerName}!\nOrder ID: ${result.data.orderId}\nTotal: $${currentTotal}\nThank you!`
    );
  } else {
    alert("Failed to save order: " + (result.data?.message || result.error));
  }
}
