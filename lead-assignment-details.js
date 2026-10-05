const token = localStorage.getItem("jwtToken");


if (!token) {

    window.location.href = "index.html";

}


// ================================
// SHOW LOGGED-IN USER
// ================================

const userName =
    localStorage.getItem("userName");

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
    new URLSearchParams(
        window.location.search
    );


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

            const response =
                await fetch(
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

            const response =
                await fetch(
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
        // NO ID PROVIDED
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


        document.getElementById(
            "assignmentId"
        ).textContent =
            assignment.id;


        document.getElementById(
            "leadId"
        ).textContent =
            assignment.leadId;


        document.getElementById(
            "currentAgentId"
        ).textContent =
            assignment.agentId;


        document.getElementById(
            "currentTeamId"
        ).textContent =
            assignment.teamId || "-";


        document.getElementById(
            "assignedAt"
        ).textContent =
            assignment.assignedAt || "-";


        document.getElementById(
            "assignmentStatus"
        ).textContent =
            assignment.status || "-";


        // ================================
        // LOAD DROPDOWNS
        // ================================

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

        const response =
            await fetch(
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
            document.getElementById(
                "agentSelect"
            );


        agentSelect.innerHTML = `
            <option value="">
                Select Agent
            </option>
        `;


        users
            .filter(function (user) {

                return (
                    user.role === "AGENT" &&
                    user.status === "ACTIVE"
                );

            })
            .forEach(function (agent) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    agent.id;


                option.textContent =
                    `${agent.fullName} (${agent.email})`;


                agentSelect.appendChild(
                    option
                );

            });


    } catch (error) {

        console.error(
            "Error loading agents:",
            error
        );


        const agentSelect =
            document.getElementById(
                "agentSelect"
            );


        if (agentSelect) {

            agentSelect.innerHTML = `
                <option value="">
                    Failed to load agents
                </option>
            `;

        }

    }

}


// ================================
// LOAD TEAMS
// ================================

async function loadTeams() {

    try {

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
                "Failed to load teams"
            );

        }


        const teams =
            await response.json();


        const teamSelect =
            document.getElementById(
                "teamSelect"
            );


        teamSelect.innerHTML = `
            <option value="">
                Select Team
            </option>
        `;


        teams
            .filter(function (team) {

                return team.status === "ACTIVE";

            })
            .forEach(function (team) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    team.id;


                option.textContent =
                    team.teamName;


                teamSelect.appendChild(
                    option
                );

            });


    } catch (error) {

        console.error(
            "Error loading teams:",
            error
        );


        const teamSelect =
            document.getElementById(
                "teamSelect"
            );


        if (teamSelect) {

            teamSelect.innerHTML = `
                <option value="">
                    Failed to load teams
                </option>
            `;

        }

    }

}


// ================================
// REASSIGN / TRANSFER LEAD
// ================================

document.getElementById("reassignForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const newAgentId =
                document.getElementById(
                    "agentSelect"
                ).value;


            const newTeamId =
                document.getElementById(
                    "teamSelect"
                ).value;


            const message =
                document.getElementById(
                    "reassignMessage"
                );


            // ================================
            // VALIDATE LEAD
            // ================================

            if (!assignmentLeadId) {

                message.textContent =
                    "Lead ID not available.";

                return;

            }


            // ================================
            // VALIDATE AGENT + TEAM
            // ================================

            if (!newAgentId) {

                message.textContent =
                    "Please select an agent.";

                return;

            }


            if (!newTeamId) {

                message.textContent =
                    "Please select a team.";

                return;

            }


            // ================================
            // SHOW PROCESSING MESSAGE
            // ================================

            message.textContent =
                "Reassigning lead...";


            try {

                // ==========================================
                // IMPORTANT
                //
                // Backend endpoint:
                //
                // PUT
                // /api/lead-assignments/{leadId}/reassign
                //
                // Request body:
                // {
                //     newAgentId: ...,
                //     newTeamId: ...
                // }
                // ==========================================

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/lead-assignments/${assignmentLeadId}/reassign`,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body:
                                JSON.stringify({

                                    newAgentId:
                                        Number(
                                            newAgentId
                                        ),

                                    newTeamId:
                                        Number(
                                            newTeamId
                                        )

                                })

                        }
                    );


                // ================================
                // READ RESPONSE
                // ================================

                const responseText =
                    await response.text();


                let data = null;


                try {

                    if (responseText) {

                        data =
                            JSON.parse(
                                responseText
                            );

                    }

                } catch (error) {

                    console.error(
                        "Unable to parse response:",
                        error
                    );

                }


                // ================================
                // ERROR
                // ================================

                if (!response.ok) {

                    console.error(
                        "Transfer failed:",
                        response.status,
                        responseText
                    );


                    message.textContent =
                        (
                            data &&
                            (
                                data.message ||
                                data.error
                            )
                        ) ||
                        responseText ||
                        `Failed to reassign lead. HTTP ${response.status}`;

                    return;

                }


                // ================================
                // SUCCESS
                // ================================

                message.textContent =
                    "Lead transferred successfully!";


                message.style.color =
                    "green";


                // ================================
                // REDIRECT
                // ================================

                setTimeout(
                    function () {

                        window.location.href =
                            "lead-assignments.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Error reassigning lead:",
                    error
                );


                message.textContent =
                    "Unable to connect to CRM server.";

            }

        }
    );


// ================================
// START
// ================================

loadAssignment();