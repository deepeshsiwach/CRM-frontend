const token = localStorage.getItem("jwtToken");

if (!token) {
    window.location.href = "index.html";
}


const userName = localStorage.getItem("userName");

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}


function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}

const urlParams = new URLSearchParams(window.location.search);

const leadIdFromUrl = urlParams.get("leadId");

const currentUserId =
    localStorage.getItem("userId");

if (leadIdFromUrl) {
    document.getElementById("leadId").value =
        leadIdFromUrl;
}

if (currentUserId) {
    document.getElementById("userId").value =
        currentUserId;
}


function showMessage(message) {

    const messageElement =
        document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
    }
}


document
    .getElementById("addNoteForm")
    .addEventListener(
        "submit",
        addNote
    );


async function addNote(event) {

    event.preventDefault();


    const leadId =
        Number(
            document.getElementById("leadId").value
        );


    const userId =
        Number(
            document.getElementById("userId").value
        );


    const note =
        document.getElementById("note").value.trim();


    // Basic validation

    if (!leadId) {

        showMessage(
            "Please enter a valid Lead ID."
        );

        return;
    }


    if (!userId) {

        showMessage(
            "Please enter a valid User ID."
        );

        return;
    }


    if (!note) {

        showMessage(
            "Please enter a note."
        );

        return;
    }


    const noteData = {

        leadId: leadId,

        userId: userId,

        note: note

    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/notes`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(noteData)
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Add Note failed:",
                response.status,
                errorText
            );


            showMessage(
                "Failed to add note. Status: " +
                response.status
            );

            return;
        }


        showMessage(
            "Note added successfully."
        );


        document
            .getElementById("addNoteForm")
            .reset();


        setTimeout(() => {

            window.location.href =
                "notes.html";

        }, 1000);

    }


    catch (error) {

        console.error(
            "Add Note error:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }
}