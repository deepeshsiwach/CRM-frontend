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

const userName =
    localStorage.getItem("userName");

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
// GET LEAD ID FROM URL
// ================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const leadIdFromUrl =
    urlParams.get("leadId");


// ================================
// AUTO-FILL LEAD ID
// ================================

if (leadIdFromUrl) {

    document.getElementById("leadId").value =
        leadIdFromUrl;

}


// ================================
// LOAD ASSIGNED AGENT FOR LEAD
// ================================

// ================================
// LOAD AGENT FOR FOLLOW-UP
// ================================

async function loadAssignedAgent() {

    const leadId =
        document.getElementById("leadId").value;

    if (!leadId) {
        return;
    }

    const userId =
        localStorage.getItem("userId");

    const userRole =
        localStorage.getItem("userRole");


    // ========================================
    // AGENT
    // ========================================
    // If logged-in user is an AGENT,
    // use their own ID.
    // Backend will verify the assignment.

    if (userRole === "AGENT") {

        const agentSelect =
            document.getElementById("agentId");

        agentSelect.innerHTML = "";

        const option =
            document.createElement("option");

        option.value =
            userId;

        option.textContent =
            `Current Agent (ID: ${userId})`;

        option.selected = true;

        agentSelect.appendChild(option);

        return;
    }


    // ========================================
    // ADMIN / MANAGER
    // ========================================
    // For Admin/Manager, find the lead's
    // active assigned agent.

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/lead-assignments/lead/${leadId}/active`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const agentSelect =
            document.getElementById("agentId");


        if (!response.ok) {

            if (response.status === 404) {

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


        if (!assignment ||
            !assignment.agentId) {

            agentSelect.innerHTML = `
                <option value="">
                    No active agent assigned
                </option>
            `;

            return;
        }


        agentSelect.innerHTML = "";


        const option =
            document.createElement("option");


        option.value =
            assignment.agentId;


        option.textContent =
            `Assigned Agent (ID: ${assignment.agentId})`;


        option.selected = true;


        agentSelect.appendChild(option);


    } catch (error) {

        console.error(
            "Error loading assigned agent:",
            error
        );

        document.getElementById(
            "addFollowUpMessage"
        ).textContent =
            "Unable to load assigned agent.";
    }
}



// ================================
// ADD FOLLOW-UP
// ================================

document.getElementById("addFollowUpForm")
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
            // BASIC VALIDATION
            // ================================

            if (!leadId) {

                message.textContent =
                    "Please enter a Lead ID.";

                return;
            }


            if (!agentId) {

                message.textContent =
                    "No active agent is assigned to this lead.";

                return;
            }


            if (!followUpDate) {

                message.textContent =
                    "Please select a follow-up date and time.";

                return;
            }


            // ================================
            // PREPARE DATA
            // ================================

            const followUpData = {

                leadId:
                    Number(leadId),

                agentId:
                    Number(agentId),

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
                                    "Bearer " + token
                            },

                            body:
                                JSON.stringify(
                                    followUpData
                                )
                        }
                    );


                let data = null;


                try {

                    data =
                        await response.json();

                } catch (error) {

                    // Response may not contain JSON

                }


                if (!response.ok) {

                    message.textContent =
                        (data && data.message) ||
                        (data && data.error) ||
                        "Failed to create follow-up.";

                    return;
                }


                message.textContent =
                    "Follow-up created successfully!";


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
            }

        }
    );


// ================================
// INITIAL LOAD
// ================================

loadAssignedAgent();