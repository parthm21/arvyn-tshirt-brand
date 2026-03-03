/* ================= GET / SAVE ================= */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= ADD TO CART ================= */

function addToCart(button) {

  const product = {
    _id: button.dataset.id,
    name: button.dataset.name,
    price: Number(button.dataset.price),
    image: button.dataset.image
  };

  let cart = getCart();

  let existing = cart.find(item => item._id === product._id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  updateCartUI();   // no popup
}

/* ================= UPDATE NAV COUNT ================= */

function updateCartUI() {
  let cart = getCart();
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = cart.reduce((t, i) => t + i.qty, 0);
  }
}

function goToCheckout() {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  window.location.href = "checkout.html";
}

/* ================= CART PAGE RENDER ================= */

function renderCartPage() {

  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  let cart = getCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotal) cartTotal.innerText = 0;
    return;
  }

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        
        <img src="${item.image}" width="80">

        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>

        <div class="cart-actions">
          <button onclick="decreaseQty('${item._id}')">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty('${item._id}')">+</button>
        </div>

        <div>
          ₹${item.price * item.qty}
        </div>

      </div>
    `;
  });

  if (cartTotal) cartTotal.innerText = total;
}

/* ================= QUANTITY CONTROL ================= */

function increaseQty(id) {
  let cart = getCart();

  cart = cart.map(item => {
    if (item._id === id) {
      item.qty++;
    }
    return item;
  });

  saveCart(cart);
  renderCartPage();
  updateCartUI();
}

function decreaseQty(id) {
  let cart = getCart();

  const updatedCart = [];

  cart.forEach(item => {
    if (item._id === id) {
      if (item.qty > 1) {
        item.qty--;
        updatedCart.push(item);
      }
    } else {
      updatedCart.push(item);
    }
  });

  saveCart(updatedCart);
  renderCartPage();
  updateCartUI();
}

/* ================= AUTO LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  renderCartPage();
});