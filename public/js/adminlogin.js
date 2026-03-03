document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("adminLoginForm");

  if (!form) {
    console.log("Form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("adminUsername");
    const passwordInput = document.getElementById("adminPassword");

    if (!usernameInput || !passwordInput) {
      console.log("Inputs not found");
      return;
    }

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === "admin" && password === "1234") {

      localStorage.setItem("adminLoggedIn", "true");

      window.location.href = "admin.html";

    } else {
      alert("Wrong credentials");
    }
  });

});