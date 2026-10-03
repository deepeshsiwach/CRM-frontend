const token = localStorage.getItem("jwtToken");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {
    window.location.href = "index.html";
}


// ==========================================
// SHOW LOGGED-IN USER
// ==========================================

const userName =
    localStorage.getItem("userName");

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}


// ==========================================
// STORE ALL FOLLOW-UPS
// ==========================================

let allFollowUps = [];


// ==========================================
// NAME MAPS
// ==========================================

let leadNameMap = {};

let userNameMap = {};


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("jwtToken");

    localStorage.removeItem("userId");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");

    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    const messageElement =
        document.getElementById(
            "followUpMessage"
        );

    if (messageElement) {

        messageElement.textContent =
            message;
    }
}


// ==========================================
// LOAD LEAD NAME MAP
// ==========================================

async function loadLeadNames() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "Unable to load leads for name mapping."
            );

            return;
        }


        const leads =
            await response.json();


        leadNameMap = {};


        leads.forEach(function (lead) {

            leadNameMap[
                String(lead.id)
            ] =
                lead.fullName ||
                lead.name ||
                "Unknown Lead";
        });


    } catch (error) {

        console.error(
            "Error loading lead names:",
            error
        );
    }
}


// ==========================================
// LOAD USER / AGENT NAME MAP
// ==========================================

async function loadUserNames() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "Unable to load users for name mapping."
            );

            return;
        }


        const users =
            await response.json();


        userNameMap = {};


        users.forEach(function (user) {

            userNameMap[
                String(user.id)
            ] =
                user.fullName ||
                user.name ||
                user.username ||
                "Unknown Agent";
        });


    } catch (error) {

        console.error(
            "Error loading user names:",
            error
        );
    }
}


// ==========================================
// GET LEAD DISPLAY NAME
// ==========================================

function getLeadName(leadId) {

    if (!leadId) {
        return "Unknown Lead";
    }

    return (
        leadNameMap[String(leadId)] ||
        "Unknown Lead"
    );
}


// ==========================================
// GET USER DISPLAY NAME
// ==========================================

function getUserName(agentId) {

    if (!agentId) {
        return "Unknown Agent";
    }

    return (
        userNameMap[String(agentId)] ||
        "Unknown Agent"
    );
}


// ==========================================
// LOAD FOLLOW-UPS
// ==========================================

async function loadFollowUps() {

    try {

        /*
         * Load Follow-ups, Leads and Users
         * at the same time.
         *
         * This removes the old N+1 API pattern.
         */

        const [
            followUpsResponse,
            leadsResponse,
            usersResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/api/follow-ups`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            )

        ]);


        // ==========================================
        // CHECK FOLLOW-UP RESPONSE
        // ==========================================

        if (!followUpsResponse.ok) {

            showMessage(
                "Failed to load follow-ups."
            );

            return;
        }


        // ==========================================
        // READ FOLLOW-UPS
        // ==========================================

        allFollowUps =
            await followUpsResponse.json();


        // ==========================================
        // READ LEADS
        // ==========================================

        if (leadsResponse.ok) {

            const leads =
                await leadsResponse.json();


            leadNameMap = {};


            leads.forEach(function (lead) {

                leadNameMap[
                    String(lead.id)
                ] =
                    lead.fullName ||
                    lead.name ||
                    "Unknown Lead";
            });
        }


        // ==========================================
        // READ USERS
        // ==========================================

        if (usersResponse.ok) {

            const users =
                await usersResponse.json();


            userNameMap = {};


            users.forEach(function (user) {

                userNameMap[
                    String(user.id)
                ] =
                    user.fullName ||
                    user.name ||
                    user.username ||
                    "Unknown Agent";
            });
        }


        // ==========================================
        // APPLY FILTERS + DISPLAY
        // ==========================================

        applyFollowUpFilters();


    } catch (error) {

        console.error(
            "Error loading follow-ups:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }
}


// ==========================================
// GET DUE CATEGORY
// ==========================================

function getFollowUpDueCategory(followUp) {

    // Only pending follow-ups are considered
    // for Overdue / Today / Upcoming.

    if (followUp.status !== "PENDING") {

        return "OTHER";
    }


    if (!followUp.followUpDate) {

        return "OTHER";
    }


    const followUpDate =
        followUp.followUpDate
            .split("T")[0];


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (followUpDate < today) {

        return "OVERDUE";
    }


    if (followUpDate === today) {

        return "TODAY";
    }


    if (followUpDate > today) {

        return "UPCOMING";
    }


    return "OTHER";
}


// ==========================================
// APPLY SEARCH + DUE FILTER
// ==========================================

function applyFollowUpFilters() {

    const searchInput =
        document.getElementById(
            "searchFollowUp"
        );


    const dueFilter =
        document.getElementById(
            "followUpDueFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedFilter =
        dueFilter
            ? dueFilter.value
            : "ALL";


    const filteredFollowUps =
        allFollowUps.filter(
            function (followUp) {


                // ------------------------------
                // DUE FILTER
                // ------------------------------

                let matchesDueFilter = true;


                if (selectedFilter !== "ALL") {

                    const category =
                        getFollowUpDueCategory(
                            followUp
                        );


                    matchesDueFilter =
                        category === selectedFilter;
                }


                // ------------------------------
                // SEARCH FILTER
                // ------------------------------

                if (!matchesDueFilter) {

                    return false;
                }


                if (!searchText) {

                    return true;
                }


                const id =
                    String(
                        followUp.id ?? ""
                    ).toLowerCase();


                const leadId =
                    String(
                        followUp.leadId ?? ""
                    ).toLowerCase();


                const agentId =
                    String(
                        followUp.agentId ?? ""
                    ).toLowerCase();


                const leadName =
                    getLeadName(
                        followUp.leadId
                    ).toLowerCase();


                const agentName =
                    getUserName(
                        followUp.agentId
                    ).toLowerCase();


                const followUpDate =
                    String(
                        followUp.followUpDate ?? ""
                    ).toLowerCase();


                const status =
                    String(
                        followUp.status ?? ""
                    ).toLowerCase();


                const remarks =
                    String(
                        followUp.remarks ?? ""
                    ).toLowerCase();


                return (

                    id.includes(searchText) ||

                    leadId.includes(searchText) ||

                    agentId.includes(searchText) ||

                    leadName.includes(searchText) ||

                    agentName.includes(searchText) ||

                    followUpDate.includes(searchText) ||

                    status.includes(searchText) ||

                    remarks.includes(searchText)

                );

            }
        );


    displayFollowUps(
        filteredFollowUps
    );


    // ======================================
    // FILTER MESSAGE
    // ======================================

    if (searchText) {

        if (filteredFollowUps.length === 0) {

            showMessage(
                "No matching follow-ups found."
            );

        } else {

            showMessage(
                `${filteredFollowUps.length} follow-up(s) found.`
            );
        }

    } else {

        showMessage("");
    }

}


// ==========================================
// DISPLAY FOLLOW-UPS
// ==========================================

function displayFollowUps(followUps) {

    const tableBody =
        document.getElementById(
            "followUpsTableBody"
        );


    if (!tableBody) {

        console.error(
            "followUpsTableBody was not found."
        );

        return;
    }


    tableBody.innerHTML = "";


    if (
        !followUps ||
        followUps.length === 0
    ) {

        return;
    }


    followUps.forEach(
        function (followUp) {


            const row =
                document.createElement("tr");


            const dateTime =
                followUp.followUpDate || "";


            let followUpDate = "";

            let followUpTime = "";


            if (dateTime.includes("T")) {

                const parts =
                    dateTime.split("T");


                followUpDate =
                    parts[0];


                followUpTime =
                    parts[1];

            } else {

                followUpDate =
                    dateTime;
            }


            const leadName =
                getLeadName(
                    followUp.leadId
                );


            const agentName =
                getUserName(
                    followUp.agentId
                );


            row.innerHTML = `

                <td>
                    ${followUp.id ?? ""}
                </td>


                <td>
                    ${leadName}
                    <br>
                    <small>
                        ID: ${followUp.leadId ?? ""}
                    </small>
                </td>


                <td>
                    ${agentName}
                    <br>
                    <small>
                        ID: ${followUp.agentId ?? ""}
                    </small>
                </td>


                <td>
                    ${followUpDate}
                </td>


                <td>
                    ${followUpTime}
                </td>


                <td>
                    ${followUp.status ?? ""}
                </td>


                <td>
                    ${followUp.remarks ?? ""}
                </td>


                <td>

                    <button
                        type="button"
                        onclick="viewFollowUp(${followUp.id})">
                        View
                    </button>


                    <button
                        type="button"
                        onclick="editFollowUp(${followUp.id})">
                        Edit
                    </button>


                    <button
                        type="button"
                        onclick="deleteFollowUp(${followUp.id})">
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ==========================================
// VIEW FOLLOW-UP
// ==========================================

function viewFollowUp(id) {

    window.location.href =
        `follow-up-details.html?id=${id}`;
}


// ==========================================
// EDIT FOLLOW-UP
// ==========================================

function editFollowUp(id) {

    window.location.href =
        `edit-follow-up.html?id=${id}`;
}


// ==========================================
// DELETE FOLLOW-UP
// ==========================================

async function deleteFollowUp(id) {

    const confirmed =
        confirm(
            `Are you sure you want to delete Follow-up ID ${id}?`
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/follow-ups/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Delete failed:",
                response.status,
                errorText
            );


            showMessage(
                "Failed to delete follow-up. Status: " +
                response.status
            );


            return;
        }


        showMessage(
            "Follow-up deleted successfully."
        );


        loadFollowUps();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }

}


// ==========================================
// SEARCH
// ==========================================

function searchFollowUps() {

    applyFollowUpFilters();
}


// ==========================================
// REFRESH
// ==========================================

function refreshFollowUps() {

    loadFollowUps();
}


// ==========================================
// EVENT LISTENERS
// ==========================================

const searchInput =
    document.getElementById(
        "searchFollowUp"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchFollowUps
    );
}


const dueFilter =
    document.getElementById(
        "followUpDueFilter"
    );


if (dueFilter) {

    dueFilter.addEventListener(
        "change",
        applyFollowUpFilters
    );
}


const refreshButton =
    document.getElementById(
        "refreshFollowUps"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshFollowUps
    );
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadFollowUps();