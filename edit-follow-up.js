const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}

const userName = localStorage.getItem("userName");

const userNameElement = document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent = userName || "User";
}


function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


function showMessage(message) {

    const messageElement =
        document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
    }
}


const params =
    new URLSearchParams(window.location.search);

const followUpId =
    params.get("id");


async function loadFollowUp() {

    if (!followUpId) {

        showMessage("Follow-up ID is missing.");

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/follow-ups/${followUpId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            showMessage(
                "Failed to load follow-up. Status: " +
                response.status
            );

            return;
        }


        const followUp =
            await response.json();


        console.log(
            "Follow-up loaded:",
            followUp
        );


        document.getElementById("leadId").value =
            followUp.leadId ?? "";


        document.getElementById("agentId").value =
            followUp.agentId ?? "";


        if (followUp.followUpDate) {

            document.getElementById("followUpDate").value =
                followUp.followUpDate.substring(0, 16);

        }


        document.getElementById("purpose").value =
            followUp.purpose ?? "";


        document.getElementById("status").value =
            followUp.status ?? "PENDING";


        document.getElementById("remarks").value =
            followUp.remarks ?? "";

    }


    catch (error) {

        console.error(
            "Error loading follow-up:",
            error
        );

        showMessage(
            "Unable to connect to the backend."
        );
    }
}


document
    .getElementById("editFollowUpForm")
    .addEventListener(
        "submit",
        updateFollowUp
    );


async function updateFollowUp(event) {

    event.preventDefault();


    const leadId =
        Number(
            document.getElementById("leadId").value
        );


    const agentId =
        Number(
            document.getElementById("agentId").value
        );


    const followUpDate =
        document.getElementById("followUpDate").value;


    const purpose =
        document.getElementById("purpose").value;


    const status =
        document.getElementById("status").value;


    const remarks =
        document.getElementById("remarks").value;


    const updatedFollowUp = {

        leadId: leadId,

        agentId: agentId,

        followUpDate: followUpDate,

        purpose: purpose,

        status: status,

        remarks: remarks

    };


    console.log(
        "Updating follow-up:",
        updatedFollowUp
    );


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/follow-ups/${followUpId}`,
            {
                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body:
                    JSON.stringify(
                        updatedFollowUp
                    )
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Update failed:",
                response.status,
                errorText
            );


            showMessage(
                "Failed to update follow-up. Status: " +
                response.status
            );

            return;
        }


        console.log(
            "Follow-up updated successfully."
        );


        showMessage(
            "Follow-up updated successfully."
        );


        setTimeout(() => {

            window.location.href =
                "follow-ups.html";

        }, 1000);

    }


    catch (error) {

        console.error(
            "Update error:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }
}


loadFollowUp();