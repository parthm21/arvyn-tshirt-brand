async function loadProducts() {

  const res = await fetch("/api/products");
  const products = await res.json();

  const container = document.getElementById("productsContainer");
  if (!container) return;

  container.innerHTML = "";

  const grouped = {};

  products.forEach(p => {
    if (!grouped[p.category]) {
      grouped[p.category] = [];
    }
    grouped[p.category].push(p);
  });

  Object.keys(grouped).forEach(category => {

    const section = document.createElement("section");

    section.innerHTML = `
      <h2>${category}</h2>
      <div class="product-grid"></div>
    `;

    container.appendChild(section);

    const grid = section.querySelector(".product-grid");

    grouped[category].forEach(p => {

      const frontImage = p.images?.[0] || p.image;

    const isOutOfStock = p.stock === false;

const stockBadge = isOutOfStock
  ? `<div class="out-badge">OUT OF STOCK</div>`
  : "";

const buttonHTML = isOutOfStock
  ? `<button disabled class="disabled-btn">Out Of Stock</button>`
  : `<button 
        onclick="addToCart(this)"
        data-id="${p._id}"
        data-name="${p.name}"
        data-price="${p.price}"
        data-image="${frontImage}">
        Add to Cart
     </button>`;

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        ${stockBadge}

        <div class="product-click" style="cursor:pointer;">
          <img src="${frontImage}">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
        </div>

        ${buttonHTML}
      `;

      card.querySelector(".product-click").addEventListener("click", () => {
        window.location.href = "product.html?id=" + p._id;
      });

      grid.appendChild(card);

    });

  });

}

document.addEventListener("DOMContentLoaded", loadProducts);