const token = localStorage.getItem("jwtToken");

let allCallLogs = [];

let leadNameMap = {};
let userNameMap = {};


// ================================
// CHECK LOGIN
// ================================

if (!token) {
    window.location.href = "index.html";
}


// ================================
// SHOW LOGGED-IN USER
// ================================

const userName = localStorage.getItem("userName");

if (userName) {
    document.getElementById("userName").textContent = userName;
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
// LOAD LEADS FOR NAME MAPPING
// ================================

async function loadLeadNames() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/leads`,
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );


        if (!response.ok) {

            console.warn(
                "Unable to load leads for name mapping."
            );

            return;
        }


        const leads = await response.json();


        leadNameMap = {};


        leads.forEach(function (lead) {

            leadNameMap[lead.id] =
                lead.name ||
                lead.fullName ||
                "Unknown Lead";
        });


    } catch (error) {

        console.error(
            "Error loading lead names:",
            error
        );
    }
}


// ================================
// LOAD USERS FOR NAME MAPPING
// ================================

async function loadUserNames() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users`,
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );


        if (!response.ok) {

            console.warn(
                "Unable to load users for name mapping."
            );

            return;
        }


        const users = await response.json();


        userNameMap = {};


        users.forEach(function (user) {

            userNameMap[user.id] =
                user.fullName ||
                user.name ||
                "Unknown User";
        });


    } catch (error) {

        console.error(
            "Error loading user names:",
            error
        );
    }
}


// ================================
// GET LEAD DISPLAY NAME
// ================================

function getLeadDisplayName(leadId) {

    return (
        leadNameMap[leadId] ||
        "Unknown Lead"
    );
}


// ================================
// GET USER DISPLAY NAME
// ================================

function getUserDisplayName(userId) {

    return (
        userNameMap[userId] ||
        "Unknown User"
    );
}


// ================================
// LOAD CALL LOGS
// ================================

async function loadCallLogs() {

    try {

        /*
         * Load all three datasets in parallel.
         *
         * OLD:
         * Call Logs
         * + many Lead API calls
         * + many User API calls
         *
         * NEW:
         * Call Logs + Leads + Users
         */

        const [
            callLogsResponse,
            leadsResponse,
            usersResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/api/call-logs`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            )
        ]);


        // ================================
        // CHECK CALL LOG RESPONSE
        // ================================

        if (!callLogsResponse.ok) {

            throw new Error(
                "Failed to load call logs"
            );
        }


        // ================================
        // READ CALL LOGS
        // ================================

        const callLogs =
            await callLogsResponse.json();


        allCallLogs =
            callLogs;


        // ================================
        // READ LEADS
        // ================================

        if (leadsResponse.ok) {

            const leads =
                await leadsResponse.json();


            leadNameMap = {};


            leads.forEach(function (lead) {

                leadNameMap[lead.id] =
                    lead.name ||
                    lead.fullName ||
                    "Unknown Lead";
            });
        }


        // ================================
        // READ USERS
        // ================================

        if (usersResponse.ok) {

            const users =
                await usersResponse.json();


            userNameMap = {};


            users.forEach(function (user) {

                userNameMap[user.id] =
                    user.fullName ||
                    user.name ||
                    "Unknown User";
            });
        }


        // ================================
        // DISPLAY
        // ================================

        displayCallLogs(
            callLogs
        );


    } catch (error) {

        console.error(
            "Error loading call logs:",
            error
        );


        document.getElementById(
            "callLogMessage"
        ).textContent =
            "Unable to load call logs.";
    }
}


// ================================
// DISPLAY CALL LOGS
// ================================

function displayCallLogs(callLogs) {

    const tableBody =
        document.getElementById(
            "callLogsTableBody"
        );


    tableBody.innerHTML = "";


    callLogs.forEach(function (callLog) {

        const row =
            document.createElement("tr");


        const leadName =
            getLeadDisplayName(
                callLog.leadId
            );


        const agentName =
            getUserDisplayName(
                callLog.agentId
            );


        row.innerHTML = `

            <td>
                ${callLog.id}
            </td>

            <td>
                ${leadName}
                <br>
                <small>
                    ID: ${callLog.leadId}
                </small>
            </td>

            <td>
                ${agentName}
                <br>
                <small>
                    ID: ${callLog.agentId}
                </small>
            </td>

            <td>
                ${callLog.callStartTime || ""}
            </td>

            <td>
                ${callLog.callEndTime || ""}
            </td>

            <td>
                ${callLog.durationSeconds || ""}
            </td>

            <td>
                ${callLog.callStatus || ""}
            </td>

            <td>
                ${callLog.callOutcome || ""}
            </td>

            <td>
                ${callLog.remarks || ""}
            </td>

            <td>

                <button
                    class="view-lead-button"
                    onclick="viewCallLog(${callLog.id})">

                    View

                </button>

            </td>
        `;


        tableBody.appendChild(row);
    });
}


// ================================
// SEARCH CALL LOGS
// ================================

document.getElementById("searchCallLog")
    .addEventListener("input", function () {

        const searchText =
            this.value
                .toLowerCase()
                .trim();


        const filteredCallLogs =
            allCallLogs.filter(function (callLog) {

                const leadName =
                    getLeadDisplayName(
                        callLog.leadId
                    ).toLowerCase();


                const agentName =
                    getUserDisplayName(
                        callLog.agentId
                    ).toLowerCase();


                return (

                    String(callLog.id)
                        .toLowerCase()
                        .includes(searchText) ||

                    String(callLog.leadId)
                        .toLowerCase()
                        .includes(searchText) ||

                    String(callLog.agentId)
                        .toLowerCase()
                        .includes(searchText) ||

                    leadName.includes(searchText) ||

                    agentName.includes(searchText) ||

                    String(callLog.callStartTime || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    String(callLog.callEndTime || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    String(callLog.durationSeconds || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (callLog.callStatus || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (callLog.callOutcome || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (callLog.remarks || "")
                        .toLowerCase()
                        .includes(searchText)
                );
            });


        displayCallLogs(
            filteredCallLogs
        );
    });


// ================================
// REFRESH CALL LOGS
// ================================

document.getElementById("refreshCallLogs")
    .addEventListener("click", function () {

        loadCallLogs();
    });


// ================================
// VIEW CALL LOG
// ================================

function viewCallLog(callLogId) {

    window.location.href =
        "call-log-details.html?id=" +
        callLogId;
}


// ================================
// INITIAL LOAD
// ================================

loadCallLogs();