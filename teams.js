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


// =========================================================
// SHOW MESSAGE
// =========================================================

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


// =========================================================
// LOAD TEAMS
// =========================================================

async function loadTeams() {

    try {

        showMessage("Loading teams...");


        const response =
            await fetch(
                `${API_BASE_URL}/api/teams`,
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
                "Failed to load teams. Status: " +
                response.status
            );

        }


        const teams =
            await response.json();


        displayTeams(teams);

        showMessage("");

    }

    catch (error) {

        console.error(
            "Error loading teams:",
            error
        );

        showMessage(
            "Unable to load teams.",
            true
        );

    }
}


// =========================================================
// DISPLAY TEAMS
// =========================================================

function displayTeams(teams) {

    const tableBody =
        document.getElementById(
            "teamsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!teams || teams.length === 0) {

        showMessage(
            "No teams found."
        );

        return;
    }


    teams.forEach(team => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${team.id ?? ""}
            </td>

            <td>
                ${team.teamName ?? ""}
            </td>

            <td>
                ${team.description ?? ""}
            </td>

            <td>
                ${team.status ?? ""}
            </td>

            <td>
                ${team.createdAt ?? ""}
            </td>

            <td>

                <button
                    type="button"
                    onclick="viewTeam(${team.id})">

                    View

                </button>


                <button
                    type="button"
                    onclick="editTeam(${team.id})">

                    Edit

                </button>


                <button
                    type="button"
                    onclick="deleteTeam(${team.id})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    // Reset horizontal scroll position
    // whenever the team table is loaded.

    const teamsTableContainer =
        document.querySelector(
            ".teams-table-container"
        );

    if (teamsTableContainer) {

        teamsTableContainer.scrollLeft = 0;

    }

}


// =========================================================
// VIEW TEAM
// =========================================================

function viewTeam(id) {

    window.location.href =
        `team-details.html?id=${id}`;

}


// =========================================================
// DELETE TEAM
// =========================================================

async function deleteTeam(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this team?"
        );


    if (!confirmed) {
        return;
    }


    try {

        showMessage(
            "Deleting team..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/teams/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
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
                "Unable to delete team."
            );

        }


        showMessage(
            "Team deleted successfully."
        );


        loadTeams();

    }

    catch (error) {

        console.error(
            "Error deleting team:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete team.",
            true
        );

    }

}


// =========================================================
// EDIT TEAM
// =========================================================

function editTeam(id) {

    window.location.href =
        `edit-team.html?id=${id}`;

}


// =========================================================
// SEARCH TEAMS
// =========================================================

function searchTeams() {

    const searchInput =
        document.getElementById(
            "searchTeam"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#teamsTableBody tr"
        );


    rows.forEach(row => {

        const rowText =
            row.textContent.toLowerCase();


        row.style.display =
            rowText.includes(searchText)
                ? ""
                : "none";

    });

}


// =========================================================
// REFRESH TEAMS
// =========================================================

function refreshTeams() {

    loadTeams();

}


// =========================================================
// SEARCH EVENT
// =========================================================

const searchTeam =
    document.getElementById(
        "searchTeam"
    );


if (searchTeam) {

    searchTeam.addEventListener(
        "input",
        searchTeams
    );

}


// =========================================================
// REFRESH EVENT
// =========================================================

const refreshButton =
    document.getElementById(
        "refreshTeams"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshTeams
    );

}


// =========================================================
// INITIAL LOAD
// =========================================================

loadTeams();