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
    new URLSearchParams(
        window.location.search
    );

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


// Load existing user
async function loadUser() {

    if (!userId) {

        showMessage(
            "User ID is missing.",
            true
        );

        return;
    }


    try {

        showMessage(
            "Loading user..."
        );


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


        document.getElementById(
            "userId"
        ).value =
            user.id ?? "";


        document.getElementById(
            "fullName"
        ).value =
            user.fullName ?? "";


        document.getElementById(
            "email"
        ).value =
            user.email ?? "";


        document.getElementById(
            "role"
        ).value =
            user.role ?? "";


        document.getElementById(
            "status"
        ).value =
            user.status ?? "ACTIVE";


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


// Edit User form
const editUserForm =
    document.getElementById(
        "editUserForm"
    );


if (editUserForm) {

    editUserForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get values
            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const role =
                document.getElementById(
                    "role"
                ).value;


            const status =
                document.getElementById(
                    "status"
                ).value;


            const password =
                document.getElementById(
                    "password"
                ).value;


            // Validation
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

                role: role,

                status: status

            };


            // Only send password if entered
            if (password.trim() !== "") {

                userData.password =
                    password;

            }


            try {

                showMessage(
                    "Saving changes..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/users/${userId}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body:
                                JSON.stringify(
                                    userData
                                )

                        }
                    );


                let result = null;


                try {

                    result =
                        await response.json();

                }

                catch (jsonError) {

                    result = null;

                }


                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        result?.error ||
                        "Failed to update user."
                    );

                }


                showMessage(
                    "User updated successfully."
                );


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
                    "Error updating user:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to update user.",
                    true
                );

            }

        }
    );

}


// Load user when page opens
loadUser();