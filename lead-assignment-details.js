const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}


// ================================
// SHOW LOGGED-IN USER
// ================================

const userName = localStorage.getItem("userName");

if (userName) {
    document.getElementById("userName").textContent =
        userName;
}


// ================================
// LOGOUT
// ================================

document.getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.href = "index.html";
    });


// ================================
// GET URL PARAMETERS
// ================================

const urlParams =
    new URLSearchParams(window.location.search);

const assignmentId =
    urlParams.get("id");

const leadIdFromUrl =
    urlParams.get("leadId");

let assignmentLeadId = null;


// ================================
// LOAD ASSIGNMENT
// ================================

async function loadAssignment() {

    try {

        let assignment = null;


        // --------------------------------
        // CASE 1: Assignment ID provided
        // --------------------------------

        if (assignmentId) {

            const response = await fetch(
                `${API_BASE_URL}/api/lead-assignments/${assignmentId}`,
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
                    "Failed to load assignment"
                );
            }


            assignment =
                await response.json();
        }


        // --------------------------------
        // CASE 2: Lead ID provided
        // --------------------------------

        else if (leadIdFromUrl) {

            const response = await fetch(
                `${API_BASE_URL}/api/lead-assignments/lead/${leadIdFromUrl}/active`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


            if (!response.ok) {

                if (response.status === 404) {

                    document.getElementById(
                        "reassignMessage"
                    ).textContent =
                        "This lead does not have an active assignment yet.";

                    return;
                }


                throw new Error(
                    "Failed to load active assignment"
                );
            }


            assignment =
                await response.json();
        }


        // --------------------------------
        // No ID provided
        // --------------------------------

        else {

            document.getElementById(
                "reassignMessage"
            ).textContent =
                "Assignment ID or Lead ID not found.";

            return;
        }


        // ================================
        // DISPLAY ASSIGNMENT
        // ================================

        assignmentLeadId =
            assignment.leadId;


        document.getElementById("assignmentId")
            .textContent =
            assignment.id;


        document.getElementById("leadId")
            .textContent =
            assignment.leadId;


        document.getElementById("currentAgentId")
            .textContent =
            assignment.agentId;


        document.getElementById("currentTeamId")
            .textContent =
            assignment.teamId || "-";


        document.getElementById("assignedAt")
            .textContent =
            assignment.assignedAt || "-";


        document.getElementById("assignmentStatus")
            .textContent =
            assignment.status || "-";


        // Load dropdowns
        await loadAgents();

        await loadTeams();

    } catch (error) {

        console.error(
            "Error loading assignment:",
            error
        );


        document.getElementById(
            "reassignMessage"
        ).textContent =
            "Unable to load assignment.";
    }
}


// ================================
// LOAD AGENTS
// ================================

async function loadAgents() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users`,
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
                "Failed to load users"
            );
        }


        const users =
            await response.json();


        const agentSelect =
            document.getElementById("agentSelect");


        users
            .filter(function (user) {

                return (
                    user.role === "AGENT" &&
                    user.status === "ACTIVE"
                );
            })
            .forEach(function (agent) {

                const option =
                    document.createElement("option");


                option.value =
                    agent.id;


                option.textContent =
                    `${agent.fullName} (${agent.email})`;


                agentSelect.appendChild(option);
            });


    } catch (error) {

        console.error(
            "Error loading agents:",
            error
        );
    }
}


// ================================
// LOAD TEAMS
// ================================

async function loadTeams() {

    try {

        const response = await fetch(
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
                "Failed to load teams"
            );
        }


        const teams =
            await response.json();


        const teamSelect =
            document.getElementById("teamSelect");


        teams
            .filter(function (team) {

                return team.status === "ACTIVE";
            })
            .forEach(function (team) {

                const option =
                    document.createElement("option");


                option.value =
                    team.id;


                option.textContent =
                    team.teamName;


                teamSelect.appendChild(option);
            });


    } catch (error) {

        console.error(
            "Error loading teams:",
            error
        );
    }
}


// ================================
// REASSIGN LEAD
// ================================

document.getElementById("reassignForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const newAgentId =
            document.getElementById("agentSelect").value;


        const newTeamId =
            document.getElementById("teamSelect").value;


        const message =
            document.getElementById("reassignMessage");


        if (!assignmentLeadId) {

            message.textContent =
                "Lead ID not available.";

            return;
        }


        if (!newAgentId || !newTeamId) {

            message.textContent =
                "Please select an agent and team.";

            return;
        }


        message.textContent =
            "Reassigning lead...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/lead-assignments/reassign?leadId=${assignmentLeadId}&newAgentId=${newAgentId}&newTeamId=${newTeamId}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


            let data = null;


            try {

                data =
                    await response.json();

            } catch (error) {

                // Response may have no JSON body

            }


            if (!response.ok) {

                message.textContent =
                    (data && data.error) ||
                    "Failed to reassign lead.";

                return;
            }


            message.textContent =
                "Lead reassigned successfully!";


            setTimeout(function () {

                window.location.href =
                    "lead-assignments.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Error reassigning lead:",
                error
            );


            message.textContent =
                "Unable to connect to CRM server.";
        }

    });


// ================================
// START
// ================================

loadAssignment();