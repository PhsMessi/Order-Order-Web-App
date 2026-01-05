import { timedate } from "./time_date.js";
import { createOrder } from "../api/orders_api.js";

timedate();

const orderMenu = [
  {
    type: "bread",
    name: "Cake",
    url: "https://www.kumori.com.ph/cdn/shop/files/Screenshot_2024-11-05_at_10.20.20_AM.png?v=1730773240",
    price: 200,
    quantity: 0,
  },
  {
    type: "bread",
    name: "Croissant",
    url: "https://assets.bonappetit.com/photos/68e6b4a316c63f9625380e02/1:1/w_2560%2Cc_limit/1025_Dominique-Ansel-RECIPE.jpg",
    price: 75,
    quantity: 0,
  },
  {
    type: "bread",
    name: "Italian loaf bread",
    url: "https://breadsandsweets.com/wp-content/uploads/2022/05/everyday-bread-sq-1-of-1.jpg",
    price: 200,
    quantity: 0,
  },
  {
    type: "bread",
    name: "Brownies",
    url: "https://beyondfrosting.com/wp-content/uploads/2022/07/Cocoa-Powder-Brownies-3960.jpg",
    price: 60,
    quantity: 0,
  },
  {
    type: "bread",
    name: "Sausage bread",
    url: "https://www.lovebakesgoodcakes.com/wp-content/uploads/2018/04/Sausage-Bread-square.jpg",
    price: 75,
    quantity: 0,
  },
  {
    type: "bread",
    name: "Garlic bread",
    url: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/5/28/2/TM1A14F_Garlic-Bread_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1433523400627.webp",
    price: 40,
    quantity: 0,
  },
  {
    type: "drinks",
    name: "Native Coffee",
    url: "https://www.berresbrothers.com/cdn/shop/products/tres-rios-costa-rica-coffee-img-880x880_1024x.jpg?v=1582131025",
    price: 45,
    quantity: 0,
  },
  {
    type: "drinks",
    name: "Cappuchino",
    url: "https://cornercoffeestore.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg",
    price: 65,
    quantity: 0,
  },
  {
    type: "drinks",
    name: "Latte",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR8Q_RrELDLpBSuhHF9CEAWgSBo9mRQtSy-g&s",
    price: 65,
    quantity: 0,
  },
  {
    type: "drinks",
    name: "Macchiato",
    url: "https://cooktoria.com/wp-content/uploads/2016/02/Caramel-Macchiato-Recipe-sq-1.jpg",
    price: 65,
    quantity: 0,
  },
];

let currentTotal = 0;
let selectedMoney = 0;
let paymentMode = "cash";

switchButton();
renderProducts("bread"); // Start by showing bread
initCheckout();

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

function addingNewOrder(index) {
  orderMenu[index].quantity++;
  updateOrderList();
}

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
