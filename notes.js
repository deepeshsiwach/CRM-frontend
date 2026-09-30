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


async function loadNotes() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/notes`,
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
                "Failed to load notes. Status: " +
                response.status
            );

            return;
        }


        const notes =
            await response.json();

        displayNotes(notes);

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the backend."
        );
    }
}


function displayNotes(notes) {

    const tableBody =
        document.getElementById(
            "notesTableBody"
        );


    if (!tableBody) {

        console.error(
            "notesTableBody was not found."
        );

        return;
    }


    tableBody.innerHTML = "";


    if (!notes || notes.length === 0) {

        showMessage(
            "No notes found."
        );

        return;
    }


    showMessage("");


    notes.forEach(note => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${note.id ?? ""}
            </td>

            <td>
                ${note.leadId ?? ""}
            </td>

            <td>
                ${note.userId ?? ""}
            </td>

            <td>
                ${note.note ?? ""}
            </td>

            <td>
                ${note.createdAt ?? ""}
            </td>

            <td>

                <button
                    type="button"
                    onclick="viewNote(${note.id})">

                    View

                </button>


                <button
                    type="button"
                    onclick="editNote(${note.id})">

                    Edit

                </button>


                <button
                    type="button"
                    onclick="deleteNote(${note.id})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


function viewNote(id) {

    window.location.href =
        `note-details.html?id=${id}`;
}


function editNote(id) {

    window.location.href =
        `edit-note.html?id=${id}`;
}


function searchNotes() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#notesTableBody tr"
        );


    rows.forEach(row => {

        const rowText =
            row.textContent.toLowerCase();


        if (rowText.includes(searchText)) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });
}


function refreshNotes() {

    loadNotes();
}


async function deleteNote(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/notes/${id}`,
                {
                    method: "DELETE",

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
                "Failed to delete note"
            );
        }


        showMessage(
            "Note deleted successfully."
        );


        loadNotes();

    } catch (error) {

        console.error(
            "Error deleting note:",
            error
        );


        showMessage(
            "Failed to delete note."
        );
    }
}


loadNotes();
