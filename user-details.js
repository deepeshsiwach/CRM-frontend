const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");


// Check login
if (!token) {
    window.location.href = "index.html";
}


// Display logged-in user
const userNameElement =
    document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}


// Logout
const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");

            window.location.href = "index.html";
        }
    );
}


// Get user ID from URL
const urlParams =
    new URLSearchParams(window.location.search);

const userId =
    urlParams.get("id");


// Show message
function showMessage(message, isError = false) {

    const messageElement =
        document.getElementById("message");

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    messageElement.style.color =
        isError ? "red" : "green";
}


// Load user
async function loadUser() {

    if (!userId) {

        showMessage(
            "User ID is missing.",
            true
        );

        return;
    }


    try {

        showMessage("Loading user...");


        const response =
            await fetch(
                `${API_BASE_URL}/api/users/${userId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load user. Status: " +
                response.status
            );

        }


        const user =
            await response.json();


        displayUser(user);

        showMessage("");

    }

    catch (error) {

        console.error(
            "Error loading user:",
            error
        );

        showMessage(
            "Unable to load user.",
            true
        );

    }

}


// Display user details
function displayUser(user) {

    const userIdElement =
        document.getElementById("userId");

    const fullNameElement =
        document.getElementById("fullName");

    const emailElement =
        document.getElementById("email");

    const roleElement =
        document.getElementById("role");

    const statusElement =
        document.getElementById("status");

    const createdAtElement =
        document.getElementById("createdAt");


    if (userIdElement) {
        userIdElement.textContent =
            user.id ?? "-";
    }


    if (fullNameElement) {
        fullNameElement.textContent =
            user.fullName ?? "-";
    }


    if (emailElement) {
        emailElement.textContent =
            user.email ?? "-";
    }


    if (roleElement) {
        roleElement.textContent =
            user.role ?? "-";
    }


    if (statusElement) {
        statusElement.textContent =
            user.status ?? "-";
    }


    if (createdAtElement) {
        createdAtElement.textContent =
            user.createdAt ?? "-";
    }

}


// Load user when page opens
loadUser();