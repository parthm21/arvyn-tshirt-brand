async function trackOrder() {

  const orderId = document.getElementById("orderIdInput").value.trim();

  if (!orderId) {
    alert("Please enter Order ID");
    return;
  }

  try {
    const res = await fetch("/api/orders/track/" + orderId);
    const data = await res.json();

    const resultDiv = document.getElementById("trackResult");

    if (!data || data.message === "Not Found") {
      resultDiv.innerHTML = `
        <p style="color:crimson;">Order not found.</p>
      `;
      return;
    }

    renderTimeline(data.status, resultDiv);

  } catch (err) {
    console.log(err);
  }
}

function renderTimeline(status, container) {

  const steps = ["Processing", "Shipped", "Delivered"];

  let html = `<div class="timeline">`;

  steps.forEach(step => {

    const active = 
      (step === "Processing" && (status === "Processing" || status === "Shipped" || status === "Delivered")) ||
      (step === "Shipped" && (status === "Shipped" || status === "Delivered")) ||
      (step === "Delivered" && status === "Delivered");

    html += `
      <div class="timeline-step ${active ? "active" : ""}">
        <div class="circle"></div>
        <p>${step}</p>
      </div>
    `;
  });

  html += `</div>`;

  container.innerHTML = html;
}