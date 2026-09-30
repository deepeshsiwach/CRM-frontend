const token = localStorage.getItem("jwtToken");

let allCallLogs = [];


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
// LOAD CALL LOGS
// ================================

async function loadCallLogs() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/call-logs`,
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
                "Failed to load call logs"
            );
        }


        const callLogs =
            await response.json();


        allCallLogs =
            callLogs;


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


        row.innerHTML = `
            <td>${callLog.id}</td>

            <td>${callLog.leadId}</td>

            <td>${callLog.agentId}</td>

            <td>${callLog.callStartTime || ""}</td>

            <td>${callLog.callEndTime || ""}</td>

            <td>${callLog.durationSeconds || ""}</td>

            <td>${callLog.callStatus || ""}</td>

            <td>${callLog.callOutcome || ""}</td>

            <td>${callLog.remarks || ""}</td>

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
            this.value.toLowerCase().trim();


        const filteredCallLogs =
            allCallLogs.filter(function (callLog) {

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