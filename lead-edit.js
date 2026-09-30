const token = localStorage.getItem("jwtToken");
const userRole =
    (localStorage.getItem("userRole") || "")
        .trim()
        .toUpperCase();


// ============================================================
// CHECK LOGIN
// ============================================================

if (!token) {

    window.location.href = "index.html";

}


// ============================================================
// SHOW LOGGED-IN USER
// ============================================================

const userName =
    localStorage.getItem("userName");

const userNameElement =
    document.getElementById("userName");

if (
    userName &&
    userNameElement
) {

    userNameElement.textContent =
        userName;

}


// ============================================================
// LOGOUT
// ============================================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
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

}


// ============================================================
// GET LEAD ID
// ============================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const leadId =
    urlParams.get("id");


// ============================================================
// STORE ORIGINAL LEAD
// ============================================================

let originalLead = null;


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(message) {

    const editMessage =
        document.getElementById(
            "editMessage"
        );

    if (editMessage) {

        editMessage.textContent =
            message;

    }

}


// ============================================================
// LOAD EXISTING LEAD
// ============================================================

async function loadLead() {

    if (!leadId) {

        showMessage(
            "Lead ID not found."
        );

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

            let errorMessage =
                "Failed to load lead.";

            try {

                const text =
                    await response.text();

                if (text) {

                    errorMessage =
                        text;

                }

            } catch (error) {

                // Ignore parsing error

            }


            throw new Error(
                errorMessage
            );

        }


        const lead =
            await response.json();


        originalLead =
            JSON.parse(
                JSON.stringify(lead)
            );


        // ====================================================
        // FILL FORM
        // ====================================================

        setValue(
            "fullName",
            lead.fullName
        );

        setValue(
            "email",
            lead.email
        );

        setValue(
            "phone",
            lead.phone
        );

        setValue(
            "courseInterested",
            lead.courseInterested
        );

        setValue(
            "leadSource",
            lead.leadSource
        );

        setValue(
            "status",
            lead.status || "NEW"
        );

        setValue(
            "priority",
            lead.priority || "MEDIUM"
        );

        setValue(
            "city",
            lead.city
        );


        // ====================================================
        // AGENT MODE
        // ====================================================

        if (userRole === "AGENT") {

            configureAgentEditMode();

        }

    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );

        showMessage(
            "Unable to load lead."
        );

    }

}


// ============================================================
// SET FORM VALUE
// ============================================================

function setValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (element) {

        element.value =
            value || "";

    }

}


// ============================================================
// AGENT EDIT MODE
// ============================================================

function configureAgentEditMode() {

    const allFieldIds = [

        "fullName",
        "email",
        "phone",
        "courseInterested",
        "leadSource",
        "status",
        "priority",
        "city"

    ];


    allFieldIds.forEach(
        function (fieldId) {

            const field =
                document.getElementById(
                    fieldId
                );


            if (!field) {

                return;

            }


            if (fieldId === "status") {

                field.disabled =
                    false;

            } else {

                field.disabled =
                    true;

            }

        }
    );


    showMessage(
        "Agent mode: only lead status can be updated."
    );

}


// ============================================================
// LOAD LEAD
// ============================================================

loadLead();


// ============================================================
// FORM SUBMIT
// ============================================================

const editLeadForm =
    document.getElementById(
        "editLeadForm"
    );


if (editLeadForm) {

    editLeadForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            showMessage(
                "Saving changes..."
            );


            const statusElement =
                document.getElementById(
                    "status"
                );


            const selectedStatus =
                statusElement
                    ? statusElement.value
                    : "";


            // ==================================================
            // AGENT
            // ==================================================

            if (userRole === "AGENT") {

                await updateAgentLeadStatus(
                    selectedStatus
                );

                return;

            }


            // ==================================================
            // ADMIN / MANAGER
            // ==================================================

            await updateFullLead();

        }
    );

}


// ============================================================
// AGENT STATUS UPDATE
// ============================================================

async function updateAgentLeadStatus(
    selectedStatus
) {

    if (!selectedStatus) {

        showMessage(
            "Please select a lead status."
        );

        return;

    }


    const originalStatus =
        originalLead
            ? originalLead.status
            : null;


    // ========================================================
    // NO CHANGE
    // ========================================================

    if (
        originalStatus ===
        selectedStatus
    ) {

        showMessage(
            "No status changes made."
        );

        return;

    }


    try {

        // ====================================================
        // UPDATE STATUS
        // ====================================================

        const response =
            await fetch(
                `${API_BASE_URL}/api/agent/leads/${leadId}/status`,
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


        // ====================================================
        // HANDLE ERROR
        // ====================================================

        if (!response.ok) {

            let errorMessage =
                "Failed to update lead status.";

            try {

                const text =
                    await response.text();

                if (text) {

                    errorMessage =
                        text;

                }

            } catch (error) {

                // Ignore parsing error

            }


            console.error(
                "Agent status update failed:",
                response.status,
                errorMessage
            );


            showMessage(
                errorMessage
            );

            return;

        }


        // ====================================================
        // READ UPDATED LEAD
        // ====================================================

        const updatedLead =
            await response.json();


        // Keep local copy updated
        originalLead =
            updatedLead;


        showMessage(
            "Lead status updated successfully!"
        );


        // ====================================================
        // REDIRECT
        // ====================================================

        setTimeout(
            function () {

                window.location.href =
                    "lead-details.html?id=" +
                    leadId;

            },
            600
        );


    } catch (error) {

        console.error(
            "Error updating Agent lead status:",
            error
        );


        showMessage(
            "Unable to connect to CRM server."
        );

    }

}


// ============================================================
// ADMIN / MANAGER FULL UPDATE
// ============================================================

async function updateFullLead() {

    const updatedLead = {

        fullName:
            getValue("fullName"),

        email:
            getValue("email"),

        phone:
            getValue("phone"),

        courseInterested:
            getValue("courseInterested"),

        leadSource:
            getValue("leadSource"),

        status:
            getValue("status"),

        priority:
            getValue("priority"),

        city:
            getValue("city")

    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads/${leadId}`,
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
                            updatedLead
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

            showMessage(
                data &&
                data.error
                    ? data.error
                    : "Failed to update lead."
            );

            return;

        }


        showMessage(
            "Lead updated successfully!"
        );


        setTimeout(
            function () {

                window.location.href =
                    "lead-details.html?id=" +
                    leadId;

            },
            600
        );


    } catch (error) {

        console.error(
            "Error updating lead:",
            error
        );


        showMessage(
            "Unable to connect to CRM server."
        );

    }

}


// ============================================================
// GET FORM VALUE
// ============================================================

function getValue(elementId) {

    const element =
        document.getElementById(
            elementId
        );


    return element
        ? element.value
        : "";

}