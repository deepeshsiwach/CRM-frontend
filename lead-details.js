const token = localStorage.getItem("jwtToken");

// Check login
if (!token) {
    window.location.href = "index.html";
}


// Show logged-in user
const userName = localStorage.getItem("userName");

if (userName) {
    document.getElementById("userName").textContent =
        userName;
}


// Logout
document.getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.href = "index.html";
    });


// Get lead ID from URL
const urlParams = new URLSearchParams(
    window.location.search
);

const leadId = urlParams.get("id");


// ========================================
// LOAD LEAD DETAILS
// ========================================

async function loadLeadDetails() {

    if (!leadId) {
        console.error("Lead ID not found");
        return;
    }

    try {

        const response = await fetch(
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


        const lead = await response.json();


        document.getElementById("leadId").textContent =
            lead.id;


        document.getElementById("leadName").textContent =
            lead.fullName || "-";


        document.getElementById("leadEmail").textContent =
            lead.email || "-";


        document.getElementById("leadPhone").textContent =
            lead.phone || "-";


        document.getElementById("leadCourse").textContent =
            lead.courseInterested || "-";


        document.getElementById("leadSource").textContent =
            lead.leadSource || "-";


        document.getElementById("leadStatus").textContent =
            lead.status || "-";


        document.getElementById("leadPriority").textContent =
            lead.priority || "-";


        document.getElementById("leadCity").textContent =
            lead.city || "-";


        // ========================================
        // EDUCATION
        // ========================================

        document.getElementById("leadEducation").textContent =
            lead.education || "-";


        // ========================================
        // INTERESTED AREA
        // ========================================

        document.getElementById("leadInterestedArea").textContent =
            lead.interestedArea || "-";


    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );
    }
}


// ========================================
// LOAD CALL LOGS FOR THIS LEAD
// ========================================

async function loadLeadCallLogs() {

    if (!leadId) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/call-logs/lead/${leadId}`,
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


        const callLogs = await response.json();


        const callLogsContainer =
            document.getElementById("leadCallLogs");


        if (!callLogsContainer) {
            return;
        }


        if (!callLogs || callLogs.length === 0) {

            callLogsContainer.innerHTML = `
                <div class="activity-empty">
                    No call history available for this lead.
                </div>
            `;

            return;
        }


        callLogsContainer.innerHTML = "";


        callLogs.forEach(function (call) {

            const callCard =
                document.createElement("div");


            callCard.className =
                "lead-activity-card";


            callCard.innerHTML = `

                <div class="activity-row">
                    <strong>Call ID</strong>
                    <span>${call.id ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Agent ID</strong>
                    <span>${call.agentId ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Status</strong>
                    <span>${call.callStatus ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Outcome</strong>
                    <span>${call.outcome ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Duration</strong>
                    <span>${call.duration ?? "-"} sec</span>
                </div>

                <div class="activity-row">
                    <strong>Remarks</strong>
                    <span>${call.remarks ?? "-"}</span>
                </div>

            `;


            callLogsContainer.appendChild(callCard);

        });


    } catch (error) {

        console.error(
            "Error loading call logs:",
            error
        );
    }
}


// ========================================
// LOAD FOLLOW-UPS FOR THIS LEAD
// ========================================

async function loadLeadFollowUps() {

    if (!leadId) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/follow-ups/lead/${leadId}`,
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
                "Failed to load follow-ups"
            );
        }


        const followUps =
            await response.json();


        const followUpsContainer =
            document.getElementById("leadFollowUps");


        if (!followUpsContainer) {
            return;
        }


        if (!followUps || followUps.length === 0) {

            followUpsContainer.innerHTML = `
                <div class="activity-empty">
                    No follow-ups available for this lead.
                </div>
            `;

            return;
        }


        followUpsContainer.innerHTML = "";


        followUps.forEach(function (followUp) {

            const followUpCard =
                document.createElement("div");


            followUpCard.className =
                "lead-activity-card";


            followUpCard.innerHTML = `

                <div class="activity-row">
                    <strong>Follow-up ID</strong>
                    <span>${followUp.id ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Agent ID</strong>
                    <span>${followUp.agentId ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Date</strong>
                    <span>${followUp.followUpDate ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Purpose</strong>
                    <span>${followUp.purpose ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Status</strong>
                    <span>${followUp.status ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Remarks</strong>
                    <span>${followUp.remarks ?? "-"}</span>
                </div>

            `;


            followUpsContainer.appendChild(
                followUpCard
            );

        });


    } catch (error) {

        console.error(
            "Error loading follow-ups:",
            error
        );
    }
}


// ========================================
// LOAD NOTES FOR THIS LEAD
// ========================================

async function loadLeadNotes() {

    if (!leadId) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/notes`,
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
                "Failed to load notes"
            );
        }


        const allNotes =
            await response.json();


        const notesContainer =
            document.getElementById("leadNotes");


        if (!notesContainer) {
            return;
        }


        // Only show notes belonging to this lead
        const leadNotes =
            allNotes.filter(function (note) {

                return String(note.leadId) ===
                    String(leadId);

            });


        if (!leadNotes || leadNotes.length === 0) {

            notesContainer.innerHTML = `
                <div class="activity-empty">
                    No notes available for this lead.
                </div>
            `;

            return;
        }


        notesContainer.innerHTML = "";


        leadNotes.forEach(function (note) {

            const noteCard =
                document.createElement("div");


            noteCard.className =
                "lead-activity-card";


            noteCard.innerHTML = `

                <div class="activity-row">
                    <strong>Note ID</strong>
                    <span>${note.id ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>User ID</strong>
                    <span>${note.userId ?? "-"}</span>
                </div>

                <div class="activity-row">
                    <strong>Note</strong>
                    <span>${note.note ?? "-"}</span>
                </div>

            `;


            notesContainer.appendChild(
                noteCard
            );

        });


    } catch (error) {

        console.error(
            "Error loading notes:",
            error
        );
    }
}


// ========================================
// LOAD PAGE
// ========================================

loadLeadDetails();
loadLeadCallLogs();
loadLeadFollowUps();
loadLeadNotes();



document
    .getElementById("updateLeadStatusButton")
    .addEventListener("click", async function () {


        const selectedStatus =
            document.getElementById("leadStatusSelect").value;


        const messageElement =
            document.getElementById("leadStatusMessage");


        const userRole =
            localStorage.getItem("userRole");


        let endpoint;


        if (userRole === "AGENT") {

            endpoint =
                `${API_BASE_URL}/api/agent/leads/${leadId}/status`;

        } else {

            endpoint =
                `${API_BASE_URL}/api/leads/${leadId}/status`;
        }


        try {

            const response = await fetch(
                endpoint,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify(selectedStatus)
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    errorText || "Failed to update lead status"
                );
            }


            const updatedLead =
                await response.json();


            document.getElementById(
                "leadStatus"
            ).textContent =
                updatedLead.status;


            document.getElementById(
                "leadStatusSelect"
            ).value =
                updatedLead.status;


            messageElement.textContent =
                "Lead status updated successfully.";


        } catch (error) {

            console.error(
                "Error updating lead status:",
                error
            );


            messageElement.textContent =
                "Failed to update lead status.";
        }
    });