/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {

    const image = p.images?.[0] || p.image;

    container.innerHTML += `
      <div class="admin-product-card">

        <img src="${image}" width="80">

        <div style="flex:1;">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <p>Category: ${p.category}</p>
          <p>Sizes: ${p.sizes?.join(", ") || "-"}</p>
        </div>

        <!-- STOCK TOGGLE -->
        <label class="switch">
          <input type="checkbox" 
                 ${p.stock !== false ? "checked" : ""} 
                 onchange="toggleStock('${p._id}', this.checked)">
          <span class="slider"></span>
        </label>

        <button onclick="deleteProduct('${p._id}')">
          Delete
        </button>

      </div>
    `;
  });
}


/* ================= ADD PRODUCT ================= */

const form = document.getElementById("addProductForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("productName").value);
    formData.append("price", document.getElementById("productPrice").value);
    formData.append("category", document.getElementById("productCategory").value);

    // Sizes
    const sizesInput = document.getElementById("productSizes").value;
    const sizesArray = sizesInput.split(",").map(s => s.trim());
    formData.append("sizes", JSON.stringify(sizesArray));

    // Multiple Images
    const files = document.getElementById("productImage").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    await fetch("/api/products", {
      method: "POST",
      body: formData
    });

    e.target.reset();
    loadProducts();
  });
}


/* ================= STOCK TOGGLE ================= */

async function toggleStock(id, status) {

  await fetch("/api/products/stock/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock: status })
  });

}


/* ================= DELETE PRODUCT ================= */

async function deleteProduct(id) {

  await fetch("/api/products/" + id, {
    method: "DELETE"
  });

  loadProducts();
}
/* ================= LOAD ORDERS ================= */

async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();

  const container = document.getElementById("ordersContainer");
  if (!container) return;

  container.innerHTML = "";

  let totalRevenue = 0;
  let totalProducts = 0;

  orders.forEach(order => {
    totalRevenue += order.total;
    totalProducts += order.items.length;

    container.innerHTML += `
      <div class="order-card">
        <h4>Order ID: ${order.orderId}</h4>
        <p>Name: ${order.customerName}</p>
        <p>Total: ₹${order.total}</p>
        <p>Status: ${order.status}</p>
      </div>
    `;
  });

  document.getElementById("totalOrders").innerText = orders.length;
  document.getElementById("totalRevenue").innerText = totalRevenue;
  document.getElementById("totalProducts").innerText = totalProducts;

  if (orders.length > 0) {
    document.getElementById("latestOrder").innerText = orders[0].orderId;
  }
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadOrders();
});