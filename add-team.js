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


// Add Team form
const addTeamForm =
    document.getElementById("addTeamForm");

if (addTeamForm) {

    addTeamForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get values
            const teamName =
                document.getElementById(
                    "teamName"
                ).value.trim();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const status =
                document.getElementById(
                    "status"
                ).value;


            // Validation
            if (!teamName) {

                showMessage(
                    "Please enter team name.",
                    true
                );

                return;
            }


            if (!status) {

                showMessage(
                    "Please select status.",
                    true
                );

                return;
            }


            // Prepare team data
            const teamData = {

                teamName: teamName,

                description: description,

                status: status

            };


            try {

                showMessage(
                    "Creating team..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/teams`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body:
                                JSON.stringify(
                                    teamData
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
                        "Failed to create team."
                    );

                }


                showMessage(
                    "Team created successfully."
                );


                addTeamForm.reset();


                document.getElementById(
                    "status"
                ).value = "ACTIVE";


                setTimeout(
                    function () {

                        window.location.href =
                            "teams.html";

                    },
                    1000
                );

            }

            catch (error) {

                console.error(
                    "Error creating team:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create team.",
                    true
                );

            }

        }
    );

}