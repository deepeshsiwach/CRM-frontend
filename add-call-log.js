const token =
    localStorage.getItem("jwtToken");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {

    window.location.href =
        "index.html";

}


// ========================================
// SHOW LOGGED-IN USER
// ========================================

const userName =
    localStorage.getItem("userName");

if (userName) {

    document.getElementById("userName").textContent =
        userName;

}


// ========================================
// LOGOUT
// ========================================

document.getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");

            window.location.href =
                "index.html";

        }
    );


// ========================================
// GET LEAD ID FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const leadId =
    urlParams.get("leadId");


// ========================================
// SET LEAD ID
// ========================================

if (leadId) {

    document.getElementById("leadId").value =
        leadId;

}


// ========================================
// LOAD LEAD NAME
// ========================================

async function loadLeadDetails() {

    if (!leadId) {

        document.getElementById(
            "leadDisplay"
        ).value =
            "No Lead ID";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads/${leadId}`,
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
                "Failed to load lead"
            );

        }


        const lead =
            await response.json();


        const leadName =
            lead.fullName ||
            lead.name ||
            "Unknown Lead";


        document.getElementById(
            "leadDisplay"
        ).value =
            `${leadName} (ID: ${leadId})`;


    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );


        document.getElementById(
            "leadDisplay"
        ).value =
            `Lead (ID: ${leadId})`;

    }

}


// ========================================
// SET CURRENT USER AS AGENT
// ========================================

const currentUserId =
    localStorage.getItem("userId");

if (currentUserId) {

    document.getElementById(
        "agentId"
    ).value =
        currentUserId;

}


// ========================================
// LOAD AGENT NAME
// ========================================

async function loadAgentDetails() {

    if (!currentUserId) {

        document.getElementById(
            "agentDisplay"
        ).value =
            "No Agent ID";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users/${currentUserId}`,
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
                "Failed to load agent"
            );

        }


        const agent =
            await response.json();


        const agentName =
            agent.fullName ||
            agent.name ||
            "Unknown Agent";


        document.getElementById(
            "agentDisplay"
        ).value =
            `${agentName} (ID: ${currentUserId})`;


    } catch (error) {

        console.error(
            "Error loading agent:",
            error
        );


        document.getElementById(
            "agentDisplay"
        ).value =
            `Agent (ID: ${currentUserId})`;

    }

}


// ========================================
// SET CURRENT DATE/TIME
// ========================================

function setCurrentDateTime() {

    const now =
        new Date();


    const localDateTime =
        new Date(
            now.getTime() -
            now.getTimezoneOffset() * 60000
        )
        .toISOString()
        .slice(0, 16);


    document.getElementById(
        "callStartTime"
    ).value =
        localDateTime;

}

setCurrentDateTime();


// ========================================
// BACK BUTTON
// ========================================

function goBackToLead() {

    if (leadId) {

        window.location.href =
            "lead-details.html?id=" +
            leadId;

    } else {

        window.location.href =
            "call-logs.html";

    }

}


document.getElementById("backButton")
    .addEventListener(
        "click",
        goBackToLead
    );


document.getElementById("cancelButton")
    .addEventListener(
        "click",
        goBackToLead
    );


// ========================================
// CALL LOG FORM
// ========================================

document.getElementById("callLogForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "message"
                );


            message.textContent =
                "Saving call log...";


            message.style.color =
                "#374151";


            const callLog = {

                leadId:
                    Number(
                        document.getElementById(
                            "leadId"
                        ).value
                    ),


                agentId:
                    Number(
                        document.getElementById(
                            "agentId"
                        ).value
                    ),


                callStartTime:
                    document.getElementById(
                        "callStartTime"
                    ).value,


                callEndTime:
                    document.getElementById(
                        "callEndTime"
                    ).value ||
                    null,


                durationSeconds:
                    document.getElementById(
                        "durationSeconds"
                    ).value
                        ? Number(
                            document.getElementById(
                                "durationSeconds"
                            ).value
                        )
                        : null,


                callStatus:
                    document.getElementById(
                        "callStatus"
                    ).value,


                callOutcome:
                    document.getElementById(
                        "callOutcome"
                    ).value ||
                    null,


                // CITY

                city:
                    document.getElementById(
                        "city"
                    ).value.trim() ||
                    null,


                // EDUCATION

                education:
                    document.getElementById(
                        "education"
                    ).value.trim() ||
                    null,


                // INTERESTED AREA

                interestedArea:
                    document.getElementById(
                        "interestedArea"
                    ).value.trim() ||
                    null,


                remarks:
                    document.getElementById(
                        "remarks"
                    ).value.trim()

            };


            // ========================================
            // VALIDATION
            // ========================================

            if (!callLog.leadId) {

                message.textContent =
                    "Lead ID is required.";

                message.style.color =
                    "red";

                return;

            }


            if (!callLog.agentId) {

                message.textContent =
                    "Agent ID is required.";

                message.style.color =
                    "red";

                return;

            }


            if (!callLog.callStartTime) {

                message.textContent =
                    "Call start time is required.";

                message.style.color =
                    "red";

                return;

            }


            if (!callLog.callStatus) {

                message.textContent =
                    "Please select call status.";

                message.style.color =
                    "red";

                return;

            }


            // ========================================
            // SAVE CALL LOG
            // ========================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/call-logs`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    token

                            },

                            body:
                                JSON.stringify(
                                    callLog
                                )

                        }
                    );


                const responseText =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Failed to create call log"
                    );

                }


                message.textContent =
                    "Call log saved successfully.";


                message.style.color =
                    "green";


                setTimeout(
                    function () {

                        window.location.href =
                            "lead-details.html?id=" +
                            callLog.leadId;

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error creating call log:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to connect to CRM server.";


                message.style.color =
                    "red";

            }

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

loadLeadDetails();

loadAgentDetails();