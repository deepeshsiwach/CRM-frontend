const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}


// Display logged-in user
const userName = localStorage.getItem("userName");

if (userName) {
    document.getElementById("userName").textContent = userName;
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


// Add Lead Form
document.getElementById("addLeadForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const message =
            document.getElementById("addLeadMessage");


        // Get form values
        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();


        // Validate full name
        if (!fullName) {

            message.textContent =
                "Full name is required.";

            return;
        }


        // Validate email
        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            message.textContent =
                "Please enter a valid email address.";

            return;
        }


        // Validate phone number
        if (!/^\d{10}$/.test(phone)) {

            message.textContent =
                "Phone number must contain exactly 10 digits.";

            return;
        }


        // Prepare lead data
        const leadData = {

            fullName: fullName,

            email: email,

            phone: phone,

            courseInterested:
                document.getElementById("courseInterested").value.trim(),

            leadSource:
                document.getElementById("leadSource").value.trim(),

            status:
                document.getElementById("status").value,

            priority:
                document.getElementById("priority").value,

            city:
                document.getElementById("city").value.trim(),

            campaignId:
                document.getElementById("campaignId").value
                    ? Number(
                        document.getElementById("campaignId").value
                    )
                    : null
        };


        message.textContent =
            "Creating lead...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify(leadData)
                }
            );


            let data = null;


            try {

                data = await response.json();

            } catch (error) {

                // Response may not contain JSON

            }


            if (!response.ok) {

                message.textContent =
                    (data && data.message) ||
                    (data && data.error) ||
                    "Failed to create lead.";

                return;
            }


            message.textContent =
                "Lead created successfully!";


            // Clear form
            document.getElementById("addLeadForm").reset();


            // Return to Leads page
            setTimeout(function () {

                window.location.href =
                    "leads.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Error creating lead:",
                error
            );


            message.textContent =
                "Unable to connect to CRM server.";
        }

    });