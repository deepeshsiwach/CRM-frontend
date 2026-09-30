const token = localStorage.getItem("jwtToken");


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
// GET CALL LOG ID
// ================================

const urlParams =
    new URLSearchParams(window.location.search);

const callLogId =
    urlParams.get("id");


// ================================
// LOAD CALL LOG DETAILS
// ================================

async function loadCallLogDetails() {

    if (!callLogId) {

        alert(
            "Call Log ID not found."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/call-logs/${callLogId}`,
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
                "Failed to load call log"
            );
        }


        const callLog =
            await response.json();


        // ================================
        // DISPLAY DETAILS
        // ================================

        document.getElementById("callLogId")
            .textContent =
            callLog.id || "-";


        document.getElementById("leadId")
            .textContent =
            callLog.leadId || "-";


        document.getElementById("agentId")
            .textContent =
            callLog.agentId || "-";


        document.getElementById("startTime")
            .textContent =
            callLog.callStartTime || "-";


        document.getElementById("endTime")
            .textContent =
            callLog.callEndTime || "-";


        document.getElementById("duration")
            .textContent =
            callLog.durationSeconds || "-";


        document.getElementById("callStatus")
            .textContent =
            callLog.callStatus || "-";


        document.getElementById("outcome")
            .textContent =
            callLog.callOutcome || "-";


        document.getElementById("remarks")
            .textContent =
            callLog.remarks || "-";


    } catch (error) {

        console.error(
            "Error loading call log details:",
            error
        );


        alert(
            "Unable to load call log details."
        );
    }
}


// ================================
// START
// ================================

loadCallLogDetails();