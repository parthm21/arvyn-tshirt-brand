document.addEventListener("DOMContentLoaded", () => {

  const order = JSON.parse(localStorage.getItem("pendingOrder"));

  // 🚫 Agar order nahi mila → cart pe bhej do
  if (!order || !order.cart || order.cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  const summary = document.getElementById("paymentSummary");
  const totalSpan = document.getElementById("paymentTotal");

  let total = 0;
  summary.innerHTML = "";

  order.cart.forEach(item => {
    total += item.price * item.qty;

    summary.innerHTML += `
      <div style="margin-bottom:10px;">
        ${item.name} × ${item.qty} - ₹${item.price * item.qty}
      </div>
    `;
  });

  totalSpan.innerText = total;
});


function simulatePayment() {

  const order = JSON.parse(localStorage.getItem("pendingOrder"));

  if (!order) {
    window.location.href = "cart.html";
    return;
  }

  // 🧹 Clear cart after payment
  localStorage.removeItem("cart");
  localStorage.removeItem("pendingOrder");

  // Redirect to success page
  window.location.href = "ordersuccess.html";
}