/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {
  try {

    const res = await fetch("/api/products");

    if (!res.ok) {
      console.error("Products API Error:", res.status);
      return;
    }

    const products = await res.json();

    const container = document.getElementById("productList");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(p => {

      const image = (p.images && p.images.length > 0) ? p.images[0] : "";

      const sizes = (p.sizes && p.sizes.length > 0) ? p.sizes.join(", ") : "-";

      container.innerHTML += `
        <div class="admin-product-card">

          <img src="${image}" width="80" alt="product">

          <div style="flex:1;">
            <h3>${p.name || ""}</h3>
            <p>₹${p.price || 0}</p>
            <p>Category: ${p.category || "-"}</p>
            <p>Sizes: ${sizes}</p>
          </div>

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

  } catch (err) {
    console.error("Product Load Error:", err);
  }
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

let sizesArray = [];

if (sizesInput) {
  sizesArray = sizesInput.split(",").map(s => s.trim());
}

formData.append("sizes", JSON.stringify(sizesArray));
    // Multiple Images
    const files = document.getElementById("productImage").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

 const res = await fetch("/api/products", {
  method: "POST",
  body: formData
});

if (!res.ok) {
  console.error("Product upload failed", res.status);
  return;
}

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