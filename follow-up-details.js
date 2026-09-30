const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}

const userName = localStorage.getItem("userName");

document.getElementById("userName").textContent =
    userName || "User";


function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


async function loadFollowUpDetails() {

    const params =
        new URLSearchParams(window.location.search);

    const id =
        params.get("id");


    if (!id) {

        document.getElementById("message").textContent =
            "Follow-up ID is missing.";

        return;
    }


    try {

        const response = await fetch(
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

            document.getElementById("message").textContent =
                "Failed to load follow-up details.";

            return;
        }


        const followUp =
            await response.json();


        document.getElementById("followUpId").textContent =
            followUp.id ?? "";


        document.getElementById("leadId").textContent =
            followUp.leadId ?? "";


        document.getElementById("agentId").textContent =
            followUp.agentId ?? "";


        document.getElementById("followUpDate").textContent =
            followUp.followUpDate ?? "";


        document.getElementById("purpose").textContent =
            followUp.purpose ?? "";


        document.getElementById("status").textContent =
            followUp.status ?? "";


        document.getElementById("remarks").textContent =
            followUp.remarks ?? "";


        document.getElementById("createdAt").textContent =
            followUp.createdAt ?? "";


        document.getElementById("updatedAt").textContent =
            followUp.updatedAt ?? "";


    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to connect to the backend.";

    }
}


loadFollowUpDetails();

document
    .getElementById("updateFollowUpStatusButton")
    .addEventListener("click", async function () {

        const params =
            new URLSearchParams(window.location.search);

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

        try {

            const response = await fetch(
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

            document.getElementById("status")
                .textContent =
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
    });