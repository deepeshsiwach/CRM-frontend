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


// Get Team ID from URL
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const teamId =
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


// Load existing team
async function loadTeam() {

    if (!teamId) {

        showMessage(
            "Team ID is missing.",
            true
        );

        return;
    }


    try {

        showMessage(
            "Loading team..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/teams/${teamId}`,
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
                "Failed to load team. Status: " +
                response.status
            );

        }


        const team =
            await response.json();


        document.getElementById(
            "teamId"
        ).value =
            team.id ?? "";


        document.getElementById(
            "teamName"
        ).value =
            team.teamName ?? "";


        document.getElementById(
            "description"
        ).value =
            team.description ?? "";


        document.getElementById(
            "status"
        ).value =
            team.status ?? "ACTIVE";


        showMessage("");

    }

    catch (error) {

        console.error(
            "Error loading team:",
            error
        );

        showMessage(
            "Unable to load team.",
            true
        );

    }

}


// Edit Team form
const editTeamForm =
    document.getElementById(
        "editTeamForm"
    );


if (editTeamForm) {

    editTeamForm.addEventListener(
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
                    "Saving changes..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/teams/${teamId}`,
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
                        "Failed to update team."
                    );

                }


                showMessage(
                    "Team updated successfully."
                );


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
                    "Error updating team:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to update team.",
                    true
                );

            }

        }
    );

}


// Load team when page opens
loadTeam();