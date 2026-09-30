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


// Add User form
const addUserForm =
    document.getElementById("addUserForm");


if (addUserForm) {

    addUserForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get form values
            const fullName =
                document.getElementById("fullName")
                    .value
                    .trim();

            const email =
                document.getElementById("email")
                    .value
                    .trim();

            const password =
                document.getElementById("password")
                    .value;

            const role =
                document.getElementById("role")
                    .value;

            const status =
                document.getElementById("status")
                    .value;


            // Basic validation
            if (!fullName) {

                showMessage(
                    "Please enter full name.",
                    true
                );

                return;
            }


            if (!email) {

                showMessage(
                    "Please enter email.",
                    true
                );

                return;
            }


            if (!password) {

                showMessage(
                    "Please enter password.",
                    true
                );

                return;
            }


            if (!role) {

                showMessage(
                    "Please select a role.",
                    true
                );

                return;
            }


            if (!status) {

                showMessage(
                    "Please select a status.",
                    true
                );

                return;
            }


            // Prepare user data
            const userData = {

                fullName: fullName,

                email: email,

                password: password,

                role: role,

                status: status

            };


            try {

                showMessage(
                    "Creating user..."
                );


                // Send request to backend
                const response =
                    await fetch(
                        `${API_BASE_URL}/api/users`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body:
                                JSON.stringify(userData)

                        }
                    );


                // Read response
                const result =
                    await response.json();


                // Handle error
                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        result.error ||
                        "Failed to create user."
                    );

                }


                // Success
                showMessage(
                    "User created successfully."
                );


                // Reset form
                addUserForm.reset();


                // Keep status ACTIVE after reset
                document.getElementById(
                    "status"
                ).value = "ACTIVE";


                // Redirect after short delay
                setTimeout(
                    function () {

                        window.location.href =
                            "users.html";

                    },
                    1000
                );

            }


            catch (error) {

                console.error(
                    "Error creating user:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create user.",
                    true
                );

            }

        }
    );

}