document.addEventListener("DOMContentLoaded", () => {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🚫 Agar cart empty hai → cart page par bhej do
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  const summary = document.getElementById("orderSummary");
  const totalSpan = document.getElementById("checkoutTotal");

  let total = 0;
  summary.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.qty;

    summary.innerHTML += `
      <div style="margin-bottom:10px;">
        ${item.name} × ${item.qty} - ₹${item.price * item.qty}
      </div>
    `;
  });

  totalSpan.innerText = total;
});


/* ================= FORM SUBMIT ================= */

document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault(); // page reload rokta hai

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  const orderData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    cart: cart
  };

  // Temporary save before payment
  localStorage.setItem("pendingOrder", JSON.stringify(orderData));

  // 🔥 REDIRECT TO PAYMENT PAGE
  window.location.href = "payment.html";
});