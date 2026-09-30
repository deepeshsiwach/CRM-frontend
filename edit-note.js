const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");

const params = new URLSearchParams(window.location.search);
const noteId = params.get("id");


// ================================
// CHECK LOGIN
// ================================

if (!token) {
    window.location.href = "index.html";
}


// ================================
// DISPLAY USER NAME
// ================================

if (userName) {
    document.getElementById("userName").textContent = userName;
}


// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ================================
// SHOW MESSAGE
// ================================

function showMessage(message, isError = false) {

    const messageElement =
        document.getElementById("message");

    messageElement.textContent = message;

    if (isError) {
        messageElement.style.color = "red";
    } else {
        messageElement.style.color = "green";
    }
}


// ================================
// LOAD EXISTING NOTE
// ================================

async function loadNote() {

    if (!noteId) {

        showMessage(
            "Note ID is missing.",
            true
        );

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/notes/${noteId}`,
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
                "Failed to load note"
            );
        }

        const note =
            await response.json();

        document.getElementById("noteId").value =
            note.id;

        document.getElementById("leadId").value =
            note.leadId;

        document.getElementById("userId").value =
            note.userId;

        document.getElementById("note").value =
            note.note;

    } catch (error) {

        console.error(
            "Error loading note:",
            error
        );

        showMessage(
            "Unable to load note.",
            true
        );
    }
}


// ================================
// UPDATE NOTE
// ================================

document.getElementById("editNoteForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const noteText =
            document.getElementById("note").value.trim();

        if (!noteText) {

            showMessage(
                "Note cannot be empty.",
                true
            );

            return;
        }

        const leadId =
            Number(
                document.getElementById("leadId").value
            );

        const userId =
            Number(
                document.getElementById("userId").value
            );

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/notes/${noteId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        leadId: leadId,

                        userId: userId,

                        note: noteText

                    })
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to update note"
                );
            }

            showMessage(
                "Note updated successfully."
            );

            setTimeout(function () {

                window.location.href =
                    "note-details.html?id=" + noteId;

            }, 800);

        } catch (error) {

            console.error(
                "Error updating note:",
                error
            );

            showMessage(
                "Failed to update note.",
                true
            );
        }

    });


// ================================
// LOAD NOTE WHEN PAGE OPENS
// ================================

loadNote();