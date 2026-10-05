const token = localStorage.getItem("jwtToken");


// ============================================================
// CHECK LOGIN
// ============================================================

if (!token) {

    window.location.href = "index.html";

}


// ============================================================
// SHOW LOGGED-IN USER
// ============================================================

const userName = localStorage.getItem("userName");

if (userName) {

    document.getElementById("userName").textContent =
        userName;

}


// ============================================================
// LOGOUT
// ============================================================

document.getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.href = "index.html";

    });


// ============================================================
// GET LEAD ID FROM URL
// ============================================================

const urlParams = new URLSearchParams(
    window.location.search
);

const leadId = urlParams.get("id");


// ============================================================
// STORE CURRENT LEAD
// ============================================================

let currentLead = null;


// ============================================================
// LOAD LEAD DETAILS
// ============================================================

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


        const lead =
            await response.json();


        currentLead = lead;


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


        // ========================================================
        // EDUCATION
        // ========================================================

        document.getElementById("leadEducation").textContent =
            lead.education || "-";


        // ========================================================
        // INTERESTED AREA
        // ========================================================

        document.getElementById("leadInterestedArea").textContent =
            lead.interestedArea || "-";


    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );

    }

}


// ============================================================
// LOAD CALL LOGS FOR THIS LEAD
// ============================================================

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


        const callLogs =
            await response.json();


        const callLogsContainer =
            document.getElementById("leadCallLogs");


        if (!callLogsContainer) {

            return;

        }


        if (!callLogs ||
            callLogs.length === 0) {

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


            callLogsContainer.appendChild(
                callCard
            );

        });


    } catch (error) {

        console.error(
            "Error loading call logs:",
            error
        );

    }

}


// ============================================================
// LOAD FOLLOW-UPS FOR THIS LEAD
// ============================================================

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


        if (!followUps ||
            followUps.length === 0) {

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


// ============================================================
// LOAD NOTES FOR THIS LEAD
// ============================================================

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


        if (!leadNotes ||
            leadNotes.length === 0) {

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


// ============================================================
// LOAD TEAMS FOR TRANSFER
// ============================================================

async function loadTransferTeams() {

    const teamSelect =
        document.getElementById(
            "transferTeamSelect"
        );


    teamSelect.innerHTML = `
        <option value="">
            Loading teams...
        </option>
    `;


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


        teamSelect.innerHTML = `
            <option value="">
                Select team
            </option>
        `;


        if (!teams ||
            teams.length === 0) {

            teamSelect.innerHTML = `
                <option value="">
                    No teams available
                </option>
            `;

            return;

        }


        teams.forEach(function (team) {

            // Only show active teams

            if (
                team.status &&
                String(team.status).toUpperCase() !== "ACTIVE"
            ) {

                return;

            }


            const option =
                document.createElement("option");


            option.value =
                team.id;


            option.textContent =
                getTeamDisplayName(team);


            teamSelect.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Error loading transfer teams:",
            error
        );


        teamSelect.innerHTML = `
            <option value="">
                Failed to load teams
            </option>
        `;

    }

}


// ============================================================
// LOAD AGENTS FOR TRANSFER
// ============================================================

async function loadTransferAgents(teamId) {

    const agentSelect =
        document.getElementById(
            "transferAgentSelect"
        );


    agentSelect.innerHTML = `
        <option value="">
            Loading agents...
        </option>
    `;


    if (!teamId) {

        agentSelect.innerHTML = `
            <option value="">
                Select team first
            </option>
        `;

        return;

    }


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


        agentSelect.innerHTML = `
            <option value="">
                Select agent
            </option>
        `;


        if (!users ||
            users.length === 0) {

            agentSelect.innerHTML = `
                <option value="">
                    No agents available
                </option>
            `;

            return;

        }


        users.forEach(function (user) {

            // Only AGENT users

            if (
                String(user.role).toUpperCase() !==
                "AGENT"
            ) {

                return;

            }


            // Only active agents

            if (
                user.status &&
                String(user.status).toUpperCase() !==
                "ACTIVE"
            ) {

                return;

            }


            const option =
                document.createElement("option");


            option.value =
                user.id;


            option.textContent =
                getAgentDisplayName(user);


            agentSelect.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Error loading transfer agents:",
            error
        );


        agentSelect.innerHTML = `
            <option value="">
                Failed to load agents
            </option>
        `;

    }

}


// ============================================================
// TEAM DISPLAY NAME
// ============================================================

function getTeamDisplayName(team) {

    const name =
        team.name ||
        team.teamName ||
        team.title ||
        ("Team " + team.id);


    return `${name} (ID: ${team.id})`;

}


// ============================================================
// AGENT DISPLAY NAME
// ============================================================

function getAgentDisplayName(user) {

    const name =
        user.fullName ||
        user.name ||
        user.username ||
        user.email ||
        ("Agent " + user.id);


    return `${name} (ID: ${user.id})`;

}


// ============================================================
// OPEN TRANSFER MODAL
// ============================================================

async function openTransferModal() {

    const overlay =
        document.getElementById(
            "transferModalOverlay"
        );


    const transferLeadId =
        document.getElementById(
            "transferLeadId"
        );


    const transferLeadName =
        document.getElementById(
            "transferLeadName"
        );


    const transferMessage =
        document.getElementById(
            "transferMessage"
        );


    transferLeadId.textContent =
        leadId || "-";


    transferLeadName.textContent =
        currentLead?.fullName || "-";


    transferMessage.textContent =
        "";


    transferMessage.className =
        "";


    document.getElementById(
        "transferAgentSelect"
    ).innerHTML = `
        <option value="">
            Select team first
        </option>
    `;


    overlay.classList.add("show");


    await loadTransferTeams();

}


// ============================================================
// CLOSE TRANSFER MODAL
// ============================================================

function closeTransferModal() {

    const overlay =
        document.getElementById(
            "transferModalOverlay"
        );


    overlay.classList.remove("show");


    document.getElementById(
        "transferMessage"
    ).textContent = "";

}


// ============================================================
// TRANSFER TEAM CHANGE
// ============================================================

document
    .getElementById("transferTeamSelect")
    .addEventListener(
        "change",
        async function () {

            const selectedTeamId =
                this.value;


            await loadTransferAgents(
                selectedTeamId
            );

        }
    );


// ============================================================
// OPEN TRANSFER BUTTON
// ============================================================

document
    .getElementById("openTransferButton")
    .addEventListener(
        "click",
        async function () {

            await openTransferModal();

        }
    );


// ============================================================
// CANCEL TRANSFER
// ============================================================

document
    .getElementById("cancelTransferButton")
    .addEventListener(
        "click",
        function () {

            closeTransferModal();

        }
    );


// ============================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ============================================================

document
    .getElementById("transferModalOverlay")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeTransferModal();

            }

        }
    );


// ============================================================
// CONFIRM TRANSFER
// ============================================================

document
    .getElementById("confirmTransferButton")
    .addEventListener(
        "click",
        async function () {

            const teamId =
                document.getElementById(
                    "transferTeamSelect"
                ).value;


            const agentId =
                document.getElementById(
                    "transferAgentSelect"
                ).value;


            const messageElement =
                document.getElementById(
                    "transferMessage"
                );


            const confirmButton =
                document.getElementById(
                    "confirmTransferButton"
                );


            // ----------------------------------------------------
            // VALIDATION
            // ----------------------------------------------------

            if (!teamId) {

                messageElement.textContent =
                    "Please select the team.";

                messageElement.className =
                    "transfer-error";

                return;

            }


            if (!agentId) {

                messageElement.textContent =
                    "Please select the agent.";

                messageElement.className =
                    "transfer-error";

                return;

            }


            // ----------------------------------------------------
            // CONFIRM
            // ----------------------------------------------------

            const confirmed =
                window.confirm(
                    "Are you sure you want to transfer this lead to the selected team and agent?"
                );


            if (!confirmed) {

                return;

            }


            // ----------------------------------------------------
            // DISABLE BUTTON
            // ----------------------------------------------------

            confirmButton.disabled =
                true;

            confirmButton.textContent =
                "Transferring...";


            messageElement.textContent =
                "";


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/lead-assignments/${leadId}/reassign`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body: JSON.stringify({

                                newAgentId:
                                    Number(agentId),

                                newTeamId:
                                    Number(teamId)

                            })
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Failed to transfer lead"
                    );

                }


                const transferredAssignment =
                    await response.json();


                console.log(
                    "Lead transferred successfully:",
                    transferredAssignment
                );


                messageElement.textContent =
                    "Lead transferred successfully.";

                messageElement.className =
                    "transfer-success";


                // ------------------------------------------------
                // CLOSE AFTER SHORT DELAY
                // ------------------------------------------------

                setTimeout(
                    function () {

                        closeTransferModal();

                        window.location.reload();

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Error transferring lead:",
                    error
                );


                messageElement.textContent =
                    error.message ||
                    "Failed to transfer lead.";

                messageElement.className =
                    "transfer-error";


                confirmButton.disabled =
                    false;

                confirmButton.textContent =
                    "Transfer Lead";

            }

        }
    );


// ============================================================
// LOAD PAGE
// ============================================================

loadLeadDetails();

loadLeadCallLogs();

loadLeadFollowUps();

loadLeadNotes();


// ============================================================
// UPDATE LEAD STATUS
// ============================================================

document
    .getElementById("updateLeadStatusButton")
    .addEventListener(
        "click",
        async function () {


            const selectedStatus =
                document.getElementById(
                    "leadStatusSelect"
                ).value;


            const messageElement =
                document.getElementById(
                    "leadStatusMessage"
                );


            const userRole =
                localStorage.getItem(
                    "userRole"
                );


            let endpoint;


            if (userRole === "AGENT") {

                endpoint =
                    `${API_BASE_URL}/api/agent/leads/${leadId}/status`;

            } else {

                endpoint =
                    `${API_BASE_URL}/api/leads/${leadId}/status`;

            }


            try {

                const response =
                    await fetch(
                        endpoint,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body:
                                JSON.stringify(
                                    selectedStatus
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Failed to update lead status"
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

        }
    );