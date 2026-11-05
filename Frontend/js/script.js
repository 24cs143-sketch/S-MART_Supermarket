function goToProducts() {
    window.location.href = "products.html";
}

// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("message");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("smartSupermarketUser", JSON.stringify(user));

        message.textContent = "Registration successful!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}