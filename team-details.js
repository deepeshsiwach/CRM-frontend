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


// Load team
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


        displayTeam(team);

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


// Display team
function displayTeam(team) {

    const teamIdElement =
        document.getElementById(
            "teamId"
        );

    const teamNameElement =
        document.getElementById(
            "teamName"
        );

    const descriptionElement =
        document.getElementById(
            "description"
        );

    const statusElement =
        document.getElementById(
            "status"
        );

    const createdAtElement =
        document.getElementById(
            "createdAt"
        );


    if (teamIdElement) {

        teamIdElement.textContent =
            team.id ?? "-";

    }


    if (teamNameElement) {

        teamNameElement.textContent =
            team.teamName ?? "-";

    }


    if (descriptionElement) {

        descriptionElement.textContent =
            team.description ?? "-";

    }


    if (statusElement) {

        statusElement.textContent =
            team.status ?? "-";

    }


    if (createdAtElement) {

        createdAtElement.textContent =
            team.createdAt ?? "-";

    }

}


// Load team when page opens
loadTeam();