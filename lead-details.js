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


        // ====================================================
        // DISPLAY EXISTING LEAD DETAILS
        // ====================================================

        const leadIdElement =
            document.getElementById("leadId");

        if (leadIdElement) {

            leadIdElement.textContent =
                lead.id;

        }


        const leadNameElement =
            document.getElementById("leadName");

        if (leadNameElement) {

            leadNameElement.textContent =
                lead.fullName || "-";

        }


        const leadEmailElement =
            document.getElementById("leadEmail");

        if (leadEmailElement) {

            leadEmailElement.textContent =
                lead.email || "-";

        }


        const leadPhoneElement =
            document.getElementById("leadPhone");

        if (leadPhoneElement) {

            leadPhoneElement.textContent =
                lead.phone || "-";

        }


        const leadCourseElement =
            document.getElementById("leadCourse");

        if (leadCourseElement) {

            leadCourseElement.textContent =
                lead.courseInterested || "-";

        }


        const leadSourceElement =
            document.getElementById("leadSource");

        if (leadSourceElement) {

            leadSourceElement.textContent =
                lead.leadSource || "-";

        }


        const leadStatusElement =
            document.getElementById("leadStatus");

        if (leadStatusElement) {

            leadStatusElement.textContent =
                lead.status || "-";

        }


        const leadPriorityElement =
            document.getElementById("leadPriority");

        if (leadPriorityElement) {

            leadPriorityElement.textContent =
                lead.priority || "-";

        }


        const leadCityElement =
            document.getElementById("leadCity");

        if (leadCityElement) {

            leadCityElement.textContent =
                lead.city || "-";

        }


        const leadEducationElement =
            document.getElementById("leadEducation");

        if (leadEducationElement) {

            leadEducationElement.textContent =
                lead.education || "-";

        }


        const leadInterestedAreaElement =
            document.getElementById(
                "leadInterestedArea"
            );

        if (leadInterestedAreaElement) {

            leadInterestedAreaElement.textContent =
                lead.interestedArea || "-";

        }


        // ====================================================
        // SET CURRENT STATUS IN STATUS SELECT
        // ====================================================

        const statusSelect =
            document.getElementById(
                "leadStatusSelect"
            );

        if (statusSelect && lead.status) {

            statusSelect.value =
                lead.status;

        }


        // ====================================================
        // FILL EDITABLE INPUTS
        // These elements will be added in lead-details.html
        // ====================================================

        setInputValue(
            "editLeadName",
            lead.fullName
        );

        setInputValue(
            "editLeadEmail",
            lead.email
        );

        setInputValue(
            "editLeadPhone",
            lead.phone
        );

        setInputValue(
            "editLeadAge",
            lead.age
        );

        setInputValue(
            "editLeadCity",
            lead.city
        );

        setInputValue(
            "editLeadEducation",
            lead.education
        );

        setInputValue(
            "editLeadCurrentProfession",
            lead.currentProfession
        );

        setInputValue(
            "editLeadPrimaryObjective",
            lead.primaryObjective
        );

        setInputValue(
            "editLeadTradingInvestmentExperience",
            lead.tradingInvestmentExperience
        );

        setInputValue(
            "editLeadCustomerLookingFor",
            lead.customerLookingFor
        );

        setInputValue(
            "editLeadInterestedArea",
            lead.interestedArea
        );


        // ====================================================
        // PRIORITY SELECT
        // ====================================================

        const prioritySelect =
            document.getElementById(
                "editLeadPriority"
            );

        if (prioritySelect && lead.priority) {

            prioritySelect.value =
                lead.priority;

        }


    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );

    }

}


// ============================================================
// SET INPUT VALUE SAFELY
// ============================================================

function setInputValue(
    elementId,
    value
) {

    const element =
        document.getElementById(elementId);

    if (!element) {

        return;

    }

    element.value =
        value !== null &&
        value !== undefined
            ? value
            : "";

}


// ============================================================
// SAVE EDITABLE LEAD DETAILS
// ============================================================

async function saveLeadDetails() {

    if (!leadId) {

        return;

    }


    const messageElement =
        document.getElementById(
            "leadDetailsMessage"
        );


    const saveButton =
        document.getElementById(
            "saveLeadDetailsButton"
        );


    // ========================================================
    // GET VALUES
    // ========================================================

    const fullName =
        getInputValue("editLeadName");

    const email =
        getInputValue("editLeadEmail");

    const phone =
        getInputValue("editLeadPhone");

    const ageValue =
        getInputValue("editLeadAge");

    const city =
        getInputValue("editLeadCity");

    const education =
        getInputValue("editLeadEducation");

    const currentProfession =
        getInputValue(
            "editLeadCurrentProfession"
        );

    const primaryObjective =
        getInputValue(
            "editLeadPrimaryObjective"
        );

    const tradingInvestmentExperience =
        getInputValue(
            "editLeadTradingInvestmentExperience"
        );

    const customerLookingFor =
        getInputValue(
            "editLeadCustomerLookingFor"
        );

    const interestedArea =
        getInputValue(
            "editLeadInterestedArea"
        );


    const prioritySelect =
        document.getElementById(
            "editLeadPriority"
        );

    const priority =
        prioritySelect
            ? prioritySelect.value
            : null;


    const statusSelect =
        document.getElementById(
            "leadStatusSelect"
        );

    const status =
        statusSelect
            ? statusSelect.value
            : null;


    const age =
        ageValue
            ? Number(ageValue)
            : null;


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (!fullName) {

        showLeadDetailsMessage(
            "Full name is required.",
            "error"
        );

        return;

    }


    if (!phone) {

        showLeadDetailsMessage(
            "Phone number is required.",
            "error"
        );

        return;

    }


    if (!/^\+?[0-9]{10,15}$/.test(phone)) {

        showLeadDetailsMessage(
            "Phone number must contain 10 to 15 digits.",
            "error"
        );

        return;

    }


    if (
        age !== null &&
        (
            Number.isNaN(age) ||
            age < 1 ||
            age > 120
        )
    ) {

        showLeadDetailsMessage(
            "Age must be between 1 and 120.",
            "error"
        );

        return;

    }


    // ========================================================
    // REQUEST BODY
    // ========================================================

    const leadDetails = {

        fullName:
            fullName,

        email:
            email || null,

        phone:
            phone,

        age:
            age,

        city:
            city || null,

        education:
            education || null,

        currentProfession:
            currentProfession || null,

        primaryObjective:
            primaryObjective || null,

        tradingInvestmentExperience:
            tradingInvestmentExperience || null,

        customerLookingFor:
            customerLookingFor || null,

        interestedArea:
            interestedArea || null,

        priority:
            priority || null,

        status:
            status || null

    };


    // ========================================================
    // DISABLE SAVE BUTTON
    // ========================================================

    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Saving...";

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/agent/leads/${leadId}/details`,
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
                            leadDetails
                        )

                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Failed to update lead details"
            );

        }


        const updatedLead =
            responseText
                ? JSON.parse(responseText)
                : null;


        // ====================================================
        // UPDATE CURRENT LEAD
        // ====================================================

        if (updatedLead) {

            currentLead =
                updatedLead;

        }


        // ====================================================
        // UPDATE DISPLAY VALUES
        // ====================================================

        updateDisplayedLeadDetails(
            updatedLead || leadDetails
        );


        showLeadDetailsMessage(
            "Lead details updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Error updating lead details:",
            error
        );


        showLeadDetailsMessage(
            error.message ||
            "Failed to update lead details.",
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save Lead Details";

        }

    }

}


// ============================================================
// GET INPUT VALUE
// ============================================================

function getInputValue(elementId) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {

        return "";

    }

    return element.value.trim();

}


// ============================================================
// UPDATE DISPLAYED LEAD DETAILS
// ============================================================

function updateDisplayedLeadDetails(
    lead
) {

    const fullName =
        lead.fullName;

    const email =
        lead.email;

    const phone =
        lead.phone;

    const city =
        lead.city;

    const education =
        lead.education;

    const interestedArea =
        lead.interestedArea;


    const leadNameElement =
        document.getElementById(
            "leadName"
        );

    if (leadNameElement) {

        leadNameElement.textContent =
            fullName || "-";

    }


    const leadEmailElement =
        document.getElementById(
            "leadEmail"
        );

    if (leadEmailElement) {

        leadEmailElement.textContent =
            email || "-";

    }


    const leadPhoneElement =
        document.getElementById(
            "leadPhone"
        );

    if (leadPhoneElement) {

        leadPhoneElement.textContent =
            phone || "-";

    }


    const leadCityElement =
        document.getElementById(
            "leadCity"
        );

    if (leadCityElement) {

        leadCityElement.textContent =
            city || "-";

    }


    const leadEducationElement =
        document.getElementById(
            "leadEducation"
        );

    if (leadEducationElement) {

        leadEducationElement.textContent =
            education || "-";

    }


    const leadInterestedAreaElement =
        document.getElementById(
            "leadInterestedArea"
        );

    if (leadInterestedAreaElement) {

        leadInterestedAreaElement.textContent =
            interestedArea || "-";

    }


    if (lead.status) {

        const statusElement =
            document.getElementById(
                "leadStatus"
            );

        if (statusElement) {

            statusElement.textContent =
                lead.status;

        }


        const statusSelect =
            document.getElementById(
                "leadStatusSelect"
            );

        if (statusSelect) {

            statusSelect.value =
                lead.status;

        }

    }


    if (lead.priority) {

        const priorityElement =
            document.getElementById(
                "leadPriority"
            );

        if (priorityElement) {

            priorityElement.textContent =
                lead.priority;

        }


        const prioritySelect =
            document.getElementById(
                "editLeadPriority"
            );

        if (prioritySelect) {

            prioritySelect.value =
                lead.priority;

        }

    }

}


// ============================================================
// LEAD DETAILS MESSAGE
// ============================================================

function showLeadDetailsMessage(
    message,
    type
) {

    const messageElement =
        document.getElementById(
            "leadDetailsMessage"
        );


    if (!messageElement) {

        return;

    }


    messageElement.textContent =
        message;


    if (type === "success") {

        messageElement.style.color =
            "#15803d";

    } else {

        messageElement.style.color =
            "#dc2626";

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
            document.getElementById(
                "leadCallLogs"
            );


        if (!callLogsContainer) {

            return;

        }


        if (
            !callLogs ||
            callLogs.length === 0
        ) {

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
            document.getElementById(
                "leadFollowUps"
            );


        if (!followUpsContainer) {

            return;

        }


        if (
            !followUps ||
            followUps.length === 0
        ) {

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
            document.getElementById(
                "leadNotes"
            );


        if (!notesContainer) {

            return;

        }


        // Only show notes belonging to this lead

        const leadNotes =
            allNotes.filter(function (note) {

                return String(note.leadId) ===
                    String(leadId);

            });


        if (
            !leadNotes ||
            leadNotes.length === 0
        ) {

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


    if (!teamSelect) {

        return;

    }


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


        if (
            !teams ||
            teams.length === 0
        ) {

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


    if (!agentSelect) {

        return;

    }


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


        if (
            !users ||
            users.length === 0
        ) {

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


    if (!overlay) {

        return;

    }


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


    if (transferLeadId) {

        transferLeadId.textContent =
            leadId || "-";

    }


    if (transferLeadName) {

        transferLeadName.textContent =
            currentLead?.fullName || "-";

    }


    if (transferMessage) {

        transferMessage.textContent =
            "";

        transferMessage.className =
            "";

    }


    const transferAgentSelect =
        document.getElementById(
            "transferAgentSelect"
        );


    if (transferAgentSelect) {

        transferAgentSelect.innerHTML = `
            <option value="">
                Select team first
            </option>
        `;

    }


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


    if (overlay) {

        overlay.classList.remove("show");

    }


    const transferMessage =
        document.getElementById(
            "transferMessage"
        );


    if (transferMessage) {

        transferMessage.textContent =
            "";

    }

}


// ============================================================
// TRANSFER TEAM CHANGE
// ============================================================

const transferTeamSelect =
    document.getElementById(
        "transferTeamSelect"
    );


if (transferTeamSelect) {

    transferTeamSelect.addEventListener(
        "change",
        async function () {

            const selectedTeamId =
                this.value;


            await loadTransferAgents(
                selectedTeamId
            );

        }
    );

}


// ============================================================
// OPEN TRANSFER BUTTON
// ============================================================

const openTransferButton =
    document.getElementById(
        "openTransferButton"
    );


if (openTransferButton) {

    openTransferButton.addEventListener(
        "click",
        async function () {

            await openTransferModal();

        }
    );

}


// ============================================================
// CANCEL TRANSFER
// ============================================================

const cancelTransferButton =
    document.getElementById(
        "cancelTransferButton"
    );


if (cancelTransferButton) {

    cancelTransferButton.addEventListener(
        "click",
        function () {

            closeTransferModal();

        }
    );

}


// ============================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ============================================================

const transferModalOverlay =
    document.getElementById(
        "transferModalOverlay"
    );


if (transferModalOverlay) {

    transferModalOverlay.addEventListener(
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

}


// ============================================================
// CONFIRM TRANSFER
// ============================================================

const confirmTransferButton =
    document.getElementById(
        "confirmTransferButton"
    );


if (confirmTransferButton) {

    confirmTransferButton.addEventListener(
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

}


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

const updateLeadStatusButton =
    document.getElementById(
        "updateLeadStatusButton"
    );


if (updateLeadStatusButton) {

    updateLeadStatusButton.addEventListener(
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
                    error.message ||
                    "Failed to update lead status.";

            }

        }
    );

}


// ============================================================
// SAVE LEAD DETAILS BUTTON
// ============================================================

const saveLeadDetailsButton =
    document.getElementById(
        "saveLeadDetailsButton"
    );


if (saveLeadDetailsButton) {

    saveLeadDetailsButton.addEventListener(
        "click",
        saveLeadDetails
    );

}