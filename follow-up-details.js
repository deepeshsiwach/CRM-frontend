// ==========================================================
// AUTHENTICATION
// ==========================================================

const token =
    localStorage.getItem("jwtToken");


if (!token) {

    window.location.href =
        "index.html";

}


const userName =
    localStorage.getItem("userName");


document.getElementById("userName").textContent =
    userName || "User";


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href =
        "index.html";

}


// ==========================================================
// LOAD FOLLOW-UP DETAILS
// ==========================================================

async function loadFollowUpDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        document.getElementById(
            "message"
        ).textContent =
            "Follow-up ID is missing.";

        return;
    }


    try {

        // ==================================================
        // LOAD FOLLOW-UP
        // ==================================================

        const response =
            await fetch(
                `${API_BASE_URL}/api/follow-ups/${id}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            document.getElementById(
                "message"
            ).textContent =
                "Failed to load follow-up details.";

            return;
        }


        const followUp =
            await response.json();


        // ==================================================
        // DISPLAY FOLLOW-UP DETAILS
        // ==================================================

        document.getElementById(
            "followUpId"
        ).textContent =
            followUp.id ?? "-";


        document.getElementById(
            "leadId"
        ).textContent =
            followUp.leadId ?? "-";


        document.getElementById(
            "agentId"
        ).textContent =
            followUp.agentId ?? "-";


        document.getElementById(
            "followUpDate"
        ).textContent =
            followUp.followUpDate ?? "-";


        document.getElementById(
            "purpose"
        ).textContent =
            followUp.purpose ?? "-";


        document.getElementById(
            "status"
        ).textContent =
            followUp.status ?? "-";


        document.getElementById(
            "remarks"
        ).textContent =
            followUp.remarks ?? "-";


        document.getElementById(
            "createdAt"
        ).textContent =
            followUp.createdAt ?? "-";


        document.getElementById(
            "updatedAt"
        ).textContent =
            followUp.updatedAt ?? "-";


        // ==================================================
        // SET STATUS DROPDOWN
        // ==================================================

        const statusSelect =
            document.getElementById(
                "followUpStatusSelect"
            );


        if (statusSelect && followUp.status) {

            statusSelect.value =
                followUp.status;

        }


        // ==================================================
        // LOAD LEAD DETAILS
        // ==================================================

        if (followUp.leadId) {

            await loadLeadDetails(
                followUp.leadId
            );

        }


    } catch (error) {

        console.error(
            "Error loading follow-up:",
            error
        );


        document.getElementById(
            "message"
        ).textContent =
            "Unable to connect to the backend.";

    }

}


// ==========================================================
// LOAD LEAD DETAILS
// ==========================================================

async function loadLeadDetails(leadId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads/${leadId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load lead details."
            );

        }


        const lead =
            await response.json();


        // ==================================================
        // LEAD NAME
        // ==================================================

        const leadNameElement =
            document.getElementById(
                "leadName"
            );


        if (leadNameElement) {

            leadNameElement.textContent =
                lead.fullName || "-";

        }


        // ==================================================
        // LEAD ID
        // ==================================================

        const leadIdDisplayElement =
            document.getElementById(
                "leadIdDisplay"
            );


        if (leadIdDisplayElement) {

            leadIdDisplayElement.textContent =
                `Lead ID: ${lead.id ?? leadId}`;

        }


        // ==================================================
        // PHONE
        // ==================================================

        const leadPhoneElement =
            document.getElementById(
                "leadPhone"
            );


        if (leadPhoneElement) {

            const phone =
                lead.phone || "";


            if (phone) {

                leadPhoneElement.textContent =
                    phone;

                leadPhoneElement.href =
                    `tel:${phone}`;

            } else {

                leadPhoneElement.textContent =
                    "-";

                leadPhoneElement.removeAttribute(
                    "href"
                );

            }

        }


        // ==================================================
        // EMAIL
        // ==================================================

        const leadEmailElement =
            document.getElementById(
                "leadEmail"
            );


        if (leadEmailElement) {

            leadEmailElement.textContent =
                lead.email || "-";

        }


        // ==================================================
        // COURSE
        // ==================================================

        const leadCourseElement =
            document.getElementById(
                "leadCourse"
            );


        if (leadCourseElement) {

            leadCourseElement.textContent =
                lead.courseInterested || "-";

        }


        // ==================================================
        // SOURCE
        // ==================================================

        const leadSourceElement =
            document.getElementById(
                "leadSource"
            );


        if (leadSourceElement) {

            leadSourceElement.textContent =
                lead.leadSource || "-";

        }


        // ==================================================
        // LEAD STATUS
        // ==================================================

        const leadStatusElement =
            document.getElementById(
                "leadStatus"
            );


        if (leadStatusElement) {

            leadStatusElement.textContent =
                lead.status || "-";

        }


        // ==================================================
        // PRIORITY
        // ==================================================

        const leadPriorityElement =
            document.getElementById(
                "leadPriority"
            );


        if (leadPriorityElement) {

            leadPriorityElement.textContent =
                lead.priority || "-";

        }


        // ==================================================
        // CITY
        // ==================================================

        const leadCityElement =
            document.getElementById(
                "leadCity"
            );


        if (leadCityElement) {

            leadCityElement.textContent =
                lead.city || "-";

        }


        // ==================================================
        // EDUCATION
        // ==================================================

        const leadEducationElement =
            document.getElementById(
                "leadEducation"
            );


        if (leadEducationElement) {

            leadEducationElement.textContent =
                lead.education || "-";

        }


        // ==================================================
        // INTERESTED AREA
        // ==================================================

        const leadInterestedAreaElement =
            document.getElementById(
                "leadInterestedArea"
            );


        if (leadInterestedAreaElement) {

            leadInterestedAreaElement.textContent =
                lead.interestedArea || "-";

        }


    } catch (error) {

        console.error(
            "Error loading lead details:",
            error
        );


        const leadNameElement =
            document.getElementById(
                "leadName"
            );


        if (leadNameElement) {

            leadNameElement.textContent =
                "Unable to load lead";

        }

    }

}


// ==========================================================
// UPDATE FOLLOW-UP STATUS
// ==========================================================

document
    .getElementById(
        "updateFollowUpStatusButton"
    )
    .addEventListener(
        "click",
        async function () {


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const id =
                params.get("id");


            const selectedStatus =
                document.getElementById(
                    "followUpStatusSelect"
                ).value;


            const messageElement =
                document.getElementById(
                    "followUpStatusMessage"
                );


            if (!id) {

                messageElement.textContent =
                    "Follow-up ID is missing.";

                return;

            }


            try {

                messageElement.textContent =
                    "Updating status...";


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/follow-ups/${id}/status?status=${selectedStatus}`,
                        {
                            method: "PUT",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Failed to update follow-up status"
                    );

                }


                const updatedFollowUp =
                    await response.json();


                // ==================================================
                // UPDATE DISPLAYED STATUS
                // ==================================================

                document.getElementById(
                    "status"
                ).textContent =
                    updatedFollowUp.status;


                document.getElementById(
                    "followUpStatusSelect"
                ).value =
                    updatedFollowUp.status;


                messageElement.textContent =
                    "Follow-up status updated successfully.";


            } catch (error) {

                console.error(
                    "Error updating follow-up status:",
                    error
                );


                messageElement.textContent =
                    "Failed to update follow-up status.";

            }

        }
    );


// ==========================================================
// INITIAL LOAD
// ==========================================================

loadFollowUpDetails();