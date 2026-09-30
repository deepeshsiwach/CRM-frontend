const token = localStorage.getItem("jwtToken");

let allAssignments = [];
let allUsers = [];
let allTeams = [];
let allLeads = [];


// =========================================
// CHECK LOGIN
// =========================================

if (!token) {
    window.location.href = "index.html";
}


// =========================================
// SHOW USER NAME
// =========================================

const userName = localStorage.getItem("userName");

if (userName) {

    document.getElementById("userName").textContent =
        userName;

}


// =========================================
// LOGOUT
// =========================================

document.getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.href = "index.html";

    });


// =========================================
// LOAD USERS
// =========================================

async function loadUsers() {

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


        allUsers = await response.json();


        populateBulkAgentSelect();


    } catch (error) {

        console.error(
            "Error loading users:",
            error
        );

        allUsers = [];

    }

}


// =========================================
// LOAD TEAMS
// =========================================

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


        allTeams = await response.json();


        populateBulkTeamSelect();


    } catch (error) {

        console.error(
            "Error loading teams:",
            error
        );

        allTeams = [];

    }

}


// =========================================
// LOAD LEADS
// =========================================

async function loadLeadsForBulkAssignment() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/leads`,
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
                "Failed to load leads"
            );

        }


        allLeads = await response.json();


        displayBulkLeadSelection();


    } catch (error) {

        console.error(
            "Error loading leads:",
            error
        );

        document.getElementById(
            "bulkLeadSelection"
        ).innerHTML = `
            <p>
                Unable to load leads.
            </p>
        `;

    }

}


// =========================================
// GET UNASSIGNED LEADS
// =========================================

function getUnassignedLeads() {

    const activeAssignedLeadIds =
        new Set(

            allAssignments

                .filter(function (assignment) {

                    return assignment.status ===
                        "ACTIVE";

                })

                .map(function (assignment) {

                    return Number(
                        assignment.leadId
                    );

                })

        );


    return allLeads.filter(function (lead) {

        return !activeAssignedLeadIds.has(
            Number(lead.id)
        );

    });

}


// =========================================
// DISPLAY BULK LEADS
// =========================================

function displayBulkLeadSelection() {

    const container =
        document.getElementById(
            "bulkLeadSelection"
        );


    const unassignedLeads =
        getUnassignedLeads();


    container.innerHTML = "";


    if (unassignedLeads.length === 0) {

        container.innerHTML = `
            <p>
                No unassigned leads available.
            </p>
        `;

        updateBulkSelectedCount();

        return;

    }


    unassignedLeads.forEach(function (lead) {

        const row =
            document.createElement("label");


        row.className =
            "bulk-lead-row";


        row.innerHTML = `

            <input
                type="checkbox"
                class="bulk-lead-checkbox"
                value="${lead.id}"
            >

            <div class="bulk-lead-info">

                <span class="bulk-lead-name">
                    ${lead.fullName || "Unnamed Lead"}
                </span>

                <span class="bulk-lead-id">
                    Lead ID: ${lead.id}
                </span>

                <span class="bulk-lead-status">
                    ${lead.status || "NEW"}
                </span>

            </div>

        `;


        container.appendChild(row);

    });


    document.querySelectorAll(
        ".bulk-lead-checkbox"
    ).forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            function () {

                updateBulkSelectedCount();

                updateSelectAllState();

            }
        );

    });


    updateBulkSelectedCount();

}


// =========================================
// POPULATE AGENT DROPDOWN
// =========================================

function populateBulkAgentSelect() {

    const select =
        document.getElementById(
            "bulkAgentSelect"
        );


    select.innerHTML = `
        <option value="">
            Select Agent
        </option>
    `;


    const activeAgents =
        allUsers.filter(function (user) {

            return (
                user.role === "AGENT" &&
                user.status === "ACTIVE"
            );

        });


    activeAgents.forEach(function (agent) {

        const option =
            document.createElement("option");


        option.value = agent.id;


        option.textContent =
            `${agent.fullName} (ID: ${agent.id})`;


        select.appendChild(option);

    });

}


// =========================================
// POPULATE TEAM DROPDOWN
// =========================================

function populateBulkTeamSelect() {

    const select =
        document.getElementById(
            "bulkTeamSelect"
        );


    select.innerHTML = `
        <option value="">
            No Team
        </option>
    `;


    const activeTeams =
        allTeams.filter(function (team) {

            return team.status === "ACTIVE";

        });


    activeTeams.forEach(function (team) {

        const option =
            document.createElement("option");


        option.value = team.id;


        option.textContent =
            `${team.name} (ID: ${team.id})`;


        select.appendChild(option);

    });

}


// =========================================
// GET SELECTED LEAD IDS
// =========================================

function getSelectedBulkLeadIds() {

    return Array.from(
        document.querySelectorAll(
            ".bulk-lead-checkbox:checked"
        )
    ).map(function (checkbox) {

        return Number(
            checkbox.value
        );

    });

}


// =========================================
// UPDATE SELECTED COUNT
// =========================================

function updateBulkSelectedCount() {

    const selectedIds =
        getSelectedBulkLeadIds();


    document.getElementById(
        "bulkSelectedCount"
    ).textContent =
        `Selected Leads: ${selectedIds.length}`;


    const button =
        document.getElementById(
            "bulkAssignButton"
        );


    if (selectedIds.length > 0) {

        button.textContent =
            `Assign ${selectedIds.length} Leads`;

    } else {

        button.textContent =
            "Assign Selected Leads";

    }

}


// =========================================
// SELECT ALL STATE
// =========================================

function updateSelectAllState() {

    const checkboxes =
        Array.from(
            document.querySelectorAll(
                ".bulk-lead-checkbox"
            )
        );


    const checkedCount =
        checkboxes.filter(function (checkbox) {

            return checkbox.checked;

        }).length;


    const selectAll =
        document.getElementById(
            "selectAllBulkLeads"
        );


    if (checkboxes.length === 0) {

        selectAll.checked = false;

        return;

    }


    selectAll.checked =
        checkedCount === checkboxes.length;

}


// =========================================
// SELECT ALL
// =========================================

document.getElementById(
    "selectAllBulkLeads"
).addEventListener(
    "change",
    function () {

        const shouldSelect =
            this.checked;


        document.querySelectorAll(
            ".bulk-lead-checkbox"
        ).forEach(function (checkbox) {

            checkbox.checked =
                shouldSelect;

        });


        // Clear quantity selection
        document.getElementById(
            "bulkQuantitySelect"
        ).value = "";


        document.getElementById(
            "customQuantityContainer"
        ).style.display = "none";


        updateBulkSelectedCount();

    }
);


// =========================================
// QUANTITY SELECTION
// =========================================

document.getElementById(
    "bulkQuantitySelect"
).addEventListener(
    "change",
    function () {

        const selectedValue =
            this.value;


        const customContainer =
            document.getElementById(
                "customQuantityContainer"
            );


        // Clear Select All
        document.getElementById(
            "selectAllBulkLeads"
        ).checked = false;


        // CUSTOM
        if (selectedValue === "custom") {

            customContainer.style.display =
                "flex";


            document.getElementById(
                "bulkCustomQuantity"
            ).focus();


            return;

        }


        customContainer.style.display =
            "none";


        document.getElementById(
            "bulkCustomQuantity"
        ).value = "";


        if (selectedValue === "") {

            clearBulkLeadSelection();

            return;

        }


        const quantity =
            Number(selectedValue);


        selectFirstBulkLeads(
            quantity
        );

    }
);


// =========================================
// CUSTOM QUANTITY
// =========================================

document.getElementById(
    "bulkCustomQuantity"
).addEventListener(
    "input",
    function () {

        const quantity =
            Number(this.value);


        document.getElementById(
            "selectAllBulkLeads"
        ).checked = false;


        if (
            !quantity ||
            quantity < 1
        ) {

            clearBulkLeadSelection();

            return;

        }


        selectFirstBulkLeads(
            quantity
        );

    }
);


// =========================================
// SELECT FIRST N LEADS
// =========================================

function selectFirstBulkLeads(quantity) {

    const checkboxes =
        Array.from(
            document.querySelectorAll(
                ".bulk-lead-checkbox"
            )
        );


    // Clear existing selection

    checkboxes.forEach(function (checkbox) {

        checkbox.checked = false;

    });


    // Select first N

    checkboxes
        .slice(0, quantity)
        .forEach(function (checkbox) {

            checkbox.checked = true;

        });


    updateBulkSelectedCount();

    updateSelectAllState();

}


// =========================================
// CLEAR SELECTION
// =========================================

function clearBulkLeadSelection() {

    document.querySelectorAll(
        ".bulk-lead-checkbox"
    ).forEach(function (checkbox) {

        checkbox.checked = false;

    });


    document.getElementById(
        "selectAllBulkLeads"
    ).checked = false;


    updateBulkSelectedCount();

}


// =========================================
// BULK ASSIGN
// =========================================

document.getElementById(
    "bulkAssignButton"
).addEventListener(
    "click",
    async function () {

        const agentId =
            document.getElementById(
                "bulkAgentSelect"
            ).value;


        const teamId =
            document.getElementById(
                "bulkTeamSelect"
            ).value;


        const selectedLeadIds =
            getSelectedBulkLeadIds();


        const message =
            document.getElementById(
                "bulkAssignmentMessage"
            );


        // Validate agent

        if (!agentId) {

            message.textContent =
                "Please select an agent.";

            return;

        }


        // Validate leads

        if (
            selectedLeadIds.length === 0
        ) {

            message.textContent =
                "Please select at least one lead.";

            return;

        }


        const requestBody = {

            leadIds:
                selectedLeadIds,

            agentId:
                Number(agentId),

            teamId:
                teamId
                    ? Number(teamId)
                    : null

        };


        try {

            message.textContent =
                "Assigning leads...";


            this.disabled = true;


            const response =
                await fetch(
                    `${API_BASE_URL}/api/lead-assignments/bulk`,
                    {
                        method: "POST",

                        headers: {

                            "Authorization":
                                "Bearer " + token,

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                requestBody
                            )

                    }
                );


            if (!response.ok) {

                let errorMessage =
                    "Bulk assignment failed.";


                try {

                    const errorData =
                        await response.json();


                    if (errorData.message) {

                        errorMessage =
                            errorData.message;

                    }

                } catch (e) {

                    // Ignore JSON parsing error

                }


                throw new Error(
                    errorMessage
                );

            }


            const assigned =
                await response.json();


            message.textContent =
                `${assigned.length} leads assigned successfully.`;


            // Reset selection

            document.getElementById(
                "selectAllBulkLeads"
            ).checked = false;


            document.getElementById(
                "bulkQuantitySelect"
            ).value = "";


            document.getElementById(
                "bulkCustomQuantity"
            ).value = "";


            document.getElementById(
                "customQuantityContainer"
            ).style.display = "none";


            // Refresh everything

            await loadAssignments();


        } catch (error) {

            console.error(
                "Bulk assignment error:",
                error
            );


            message.textContent =
                error.message ||
                "Bulk assignment failed.";


        } finally {

            this.disabled = false;

        }

    }
);


// =========================================
// GET AGENT DISPLAY NAME
// =========================================

function getAgentDisplayName(agentId) {

    const agent =
        allUsers.find(function (user) {

            return Number(user.id) ===
                Number(agentId);

        });


    if (!agent) {

        return `Agent ID: ${agentId}`;

    }


    return `${agent.fullName} (ID: ${agent.id})`;

}


// =========================================
// LOAD ASSIGNMENTS
// =========================================

async function loadAssignments() {

    try {

        await loadUsers();

        await loadTeams();


        const response =
            await fetch(
                `${API_BASE_URL}/api/lead-assignments`,
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
                "Failed to load assignments"
            );

        }


        const assignments =
            await response.json();


        allAssignments =
            assignments;


        displayAssignments(
            assignments
        );


        // Load leads after assignments
        // so active assignments can be filtered

        await loadLeadsForBulkAssignment();


    } catch (error) {

        console.error(
            "Error loading assignments:",
            error
        );


        document.getElementById(
            "assignmentMessage"
        ).textContent =
            "Unable to load assignments.";

    }

}


// =========================================
// DISPLAY ASSIGNMENTS
// =========================================

function displayAssignments(assignments) {

    const tableBody =
        document.getElementById(
            "assignmentsTableBody"
        );


    tableBody.innerHTML = "";


    assignments.forEach(function (assignment) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${assignment.id}
            </td>

            <td>
                ${assignment.leadId}
            </td>

            <td>
                ${getAgentDisplayName(
                    assignment.agentId
                )}
            </td>

            <td>
                ${assignment.teamId || ""}
            </td>

            <td>
                ${assignment.assignedAt || ""}
            </td>

            <td>
                ${assignment.status || ""}
            </td>

            <td>

                <button
                    class="view-lead-button"
                    onclick="viewAssignment(${assignment.id})"
                >
                    View
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// =========================================
// SEARCH ASSIGNMENTS
// =========================================

document.getElementById(
    "searchAssignment"
).addEventListener(
    "input",
    function () {

        const searchText =
            this.value
                .toLowerCase()
                .trim();


        const filteredAssignments =
            allAssignments.filter(
                function (assignment) {

                    const agent =
                        allUsers.find(
                            function (user) {

                                return Number(user.id) ===
                                    Number(
                                        assignment.agentId
                                    );

                            }
                        );


                    const agentName =
                        agent
                            ? agent.fullName
                            : "";


                    return (

                        String(
                            assignment.id
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        String(
                            assignment.leadId
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        String(
                            assignment.agentId
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        agentName
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        String(
                            assignment.teamId || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        (
                            assignment.status ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                    );

                }
            );


        displayAssignments(
            filteredAssignments
        );

    }
);


// =========================================
// REFRESH
// =========================================

document.getElementById(
    "refreshAssignments"
).addEventListener(
    "click",
    function () {

        document.getElementById(
            "bulkAssignmentMessage"
        ).textContent = "";


        loadAssignments();

    }
);


// =========================================
// VIEW ASSIGNMENT
// =========================================

function viewAssignment(assignmentId) {

    window.location.href =
        "lead-assignment-details.html?id=" +
        assignmentId;

}


// =========================================
// INITIAL LOAD
// =========================================

loadAssignments();