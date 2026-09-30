const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    loginMessage.textContent = "Logging in...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            loginMessage.textContent =
                data.error || "Login failed";

            return;
        }

        // Save JWT token
        localStorage.setItem("jwtToken", data.token);

        // Save logged-in user information
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);

        loginMessage.textContent =
            "Login successful!";

        console.log("Login successful:", data);

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Cannot connect to CRM server.";
    }
});