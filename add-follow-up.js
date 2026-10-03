const token =
    localStorage.getItem("jwtToken");


// ================================
// CHECK LOGIN
// ================================

if (!token) {

    window.location.href =
        "index.html";

}


// ================================
// SHOW LOGGED-IN USER
// ================================

const userName =
    localStorage.getItem("userName");

if (userName) {

    document.getElementById(
        "userName"
    ).textContent =
        userName;

}


// ================================
// LOGOUT
// ================================

document.getElementById(
    "logoutButton"
)
.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "jwtToken"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "userName"
        );

        localStorage.removeItem(
            "userEmail"
        );

        localStorage.removeItem(
            "userRole"
        );

        window.location.href =
            "index.html";

    }
);


// ================================
// GET LEAD ID FROM URL
// ================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const leadIdFromUrl =
    urlParams.get("leadId");


// ================================
// SET LEAD ID
// ================================

if (leadIdFromUrl) {

    document.getElementById(
        "leadId"
    ).value =
        leadIdFromUrl;

}


// ================================
// LOAD LEAD DETAILS
// ================================

async function loadLeadDetails() {

    const leadId =
        document.getElementById(
            "leadId"
        ).value;


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
                            "Bearer " +
                            token

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


// ================================
// LOAD AGENT NAME
// ================================

async function getAgentName(
    agentId
) {

    if (!agentId) {

        return "Unknown Agent";

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users/${agentId}`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

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


        return (
            agent.fullName ||
            agent.name ||
            agent.username ||
            "Unknown Agent"
        );


    } catch (error) {

        console.error(
            "Error loading agent:",
            error
        );


        return "Unknown Agent";

    }

}


// ================================
// LOAD ASSIGNED AGENT
// ================================

async function loadAssignedAgent() {

    const leadId =
        document.getElementById(
            "leadId"
        ).value;


    if (!leadId) {

        return;

    }


    const userId =
        localStorage.getItem(
            "userId"
        );


    const userRole =
        localStorage.getItem(
            "userRole"
        );


    const agentSelect =
        document.getElementById(
            "agentId"
        );


    // ========================================
    // AGENT LOGIN
    // ========================================

    if (userRole === "AGENT") {

        if (!userId) {

            agentSelect.innerHTML = `
                <option value="">
                    No Agent ID
                </option>
            `;

            return;

        }


        const agentName =
            await getAgentName(
                userId
            );


        agentSelect.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );


        option.value =
            userId;


        option.textContent =
            `${agentName} (ID: ${userId})`;


        option.selected =
            true;


        agentSelect.appendChild(
            option
        );


        return;

    }


    // ========================================
    // ADMIN / MANAGER
    // ========================================

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/lead-assignments/lead/${leadId}/active`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }
                }
            );


        if (!response.ok) {

            if (
                response.status === 404
            ) {

                agentSelect.innerHTML = `
                    <option value="">
                        No active agent assigned
                    </option>
                `;

                return;

            }


            throw new Error(
                "Failed to load lead assignment"
            );

        }


        const assignment =
            await response.json();


        if (
            !assignment ||
            !assignment.agentId
        ) {

            agentSelect.innerHTML = `
                <option value="">
                    No active agent assigned
                </option>
            `;

            return;

        }


        const agentId =
            assignment.agentId;


        const agentName =
            await getAgentName(
                agentId
            );


        agentSelect.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );


        option.value =
            agentId;


        option.textContent =
            `${agentName} (ID: ${agentId})`;


        option.selected =
            true;


        agentSelect.appendChild(
            option
        );


    } catch (error) {

        console.error(
            "Error loading assigned agent:",
            error
        );


        agentSelect.innerHTML = `
            <option value="">
                Unable to load agent
            </option>
        `;


        document.getElementById(
            "addFollowUpMessage"
        ).textContent =
            "Unable to load assigned agent.";

    }

}


// ================================
// ADD FOLLOW-UP
// ================================

document.getElementById(
    "addFollowUpForm"
)
.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const message =
            document.getElementById(
                "addFollowUpMessage"
            );


        const leadId =
            document.getElementById(
                "leadId"
            ).value;


        const agentId =
            document.getElementById(
                "agentId"
            ).value;


        const followUpDate =
            document.getElementById(
                "followUpDate"
            ).value;


        const purpose =
            document.getElementById(
                "purpose"
            ).value.trim();


        const status =
            document.getElementById(
                "status"
            ).value;


        const remarks =
            document.getElementById(
                "remarks"
            ).value.trim();


        // ================================
        // VALIDATION
        // ================================

        if (!leadId) {

            message.textContent =
                "Please select a valid lead.";

            message.style.color =
                "red";

            return;

        }


        if (!agentId) {

            message.textContent =
                "No active agent is assigned to this lead.";

            message.style.color =
                "red";

            return;

        }


        if (!followUpDate) {

            message.textContent =
                "Please select a follow-up date and time.";

            message.style.color =
                "red";

            return;

        }


        // ================================
        // PREPARE DATA
        // ================================

        const followUpData = {

            leadId:
                Number(
                    leadId
                ),

            agentId:
                Number(
                    agentId
                ),

            followUpDate:
                followUpDate,

            purpose:
                purpose,

            status:
                status,

            remarks:
                remarks

        };


        message.textContent =
            "Creating follow-up...";


        message.style.color =
            "#374151";


        // ================================
        // SAVE
        // ================================

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/follow-ups`,
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
                                followUpData
                            )

                    }
                );


            let data =
                null;


            try {

                data =
                    await response.json();

            } catch (error) {

                // Response may not contain JSON

            }


            if (!response.ok) {

                message.textContent =
                    (
                        data &&
                        data.message
                    ) ||
                    (
                        data &&
                        data.error
                    ) ||
                    "Failed to create follow-up.";

                message.style.color =
                    "red";

                return;

            }


            message.textContent =
                "Follow-up created successfully!";


            message.style.color =
                "green";


            setTimeout(
                function () {

                    window.location.href =
                        "lead-details.html?id=" +
                        leadId;

                },
                800
            );


        } catch (error) {

            console.error(
                "Error creating follow-up:",
                error
            );


            message.textContent =
                "Unable to connect to CRM server.";

            message.style.color =
                "red";

        }

    }
);


// ================================
// INITIAL LOAD
// ================================

loadLeadDetails();

loadAssignedAgent();