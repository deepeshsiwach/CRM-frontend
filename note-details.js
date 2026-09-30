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


function showMessage(message) {

    const messageElement =
        document.getElementById("message");

    if (messageElement) {
        messageElement.textContent = message;
    }
}


const params =
    new URLSearchParams(window.location.search);

const noteId =
    params.get("id");


async function loadNoteDetails() {

    if (!noteId) {

        showMessage(
            "Note ID is missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/notes/${noteId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            showMessage(
                "Failed to load note. Status: " +
                response.status
            );

            return;
        }


        const note =
            await response.json();


        console.log(
            "Note loaded:",
            note
        );


        document.getElementById("noteId").textContent =
            note.id ?? "";


        document.getElementById("leadId").textContent =
            note.leadId ?? "";


        document.getElementById("userId").textContent =
            note.userId ?? "";


        document.getElementById("note").textContent =
            note.note ?? "";


        document.getElementById("createdAt").textContent =
            note.createdAt ?? "";


        document.getElementById("updatedAt").textContent =
            note.updatedAt ?? "";

    }


    catch (error) {

        console.error(
            "Error loading note:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }
}


loadNoteDetails();