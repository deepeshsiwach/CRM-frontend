const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}

const userName = localStorage.getItem("userName");

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
        messageElement.textContent = message;
    }
}


// ==========================================
// LOAD FOLLOW-UPS
// ==========================================

async function loadFollowUps() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/follow-ups`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {

            showMessage(
                "Failed to load follow-ups."
            );

            return;
        }

        allFollowUps =
            await response.json();

        applyFollowUpFilters();

    } catch (error) {

        console.error(error);

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


            row.innerHTML = `
                <td>${followUp.id ?? ""}</td>

                <td>${followUp.leadId ?? ""}</td>

                <td>${followUp.agentId ?? ""}</td>

                <td>${followUpDate}</td>

                <td>${followUpTime}</td>

                <td>${followUp.status ?? ""}</td>

                <td>${followUp.remarks ?? ""}</td>

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