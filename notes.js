const token = localStorage.getItem("jwtToken");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {
    window.location.href = "index.html";
}


// ==========================================
// USER NAME
// ==========================================

const userName =
    localStorage.getItem("userName");

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    userNameElement.textContent =
        userName || "User";
}


// ==========================================
// NAME MAPS
// ==========================================

let leadNameMap = {};

let userNameMap = {};


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("jwtToken");

    localStorage.removeItem("userId");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");

    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    const messageElement =
        document.getElementById("message");


    if (messageElement) {

        messageElement.textContent =
            message;
    }
}


// ==========================================
// LOAD LEAD NAME MAP
// ==========================================

async function loadLeadNames() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "Unable to load leads for name mapping."
            );

            return;
        }


        const leads =
            await response.json();


        leadNameMap = {};


        leads.forEach(function (lead) {

            leadNameMap[
                String(lead.id)
            ] =
                lead.fullName ||
                lead.name ||
                "Unknown Lead";
        });


    } catch (error) {

        console.error(
            "Error loading lead names:",
            error
        );
    }
}


// ==========================================
// LOAD USER NAME MAP
// ==========================================

async function loadUserNames() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "Unable to load users for name mapping."
            );

            return;
        }


        const users =
            await response.json();


        userNameMap = {};


        users.forEach(function (user) {

            userNameMap[
                String(user.id)
            ] =
                user.fullName ||
                user.name ||
                user.username ||
                "Unknown User";
        });


    } catch (error) {

        console.error(
            "Error loading user names:",
            error
        );
    }
}


// ==========================================
// GET LEAD NAME
// ==========================================

function getLeadName(leadId) {

    if (!leadId) {

        return "Unknown Lead";
    }


    return (
        leadNameMap[String(leadId)] ||
        "Unknown Lead"
    );
}


// ==========================================
// GET USER NAME
// ==========================================

function getUserName(userId) {

    if (!userId) {

        return "Unknown User";
    }


    return (
        userNameMap[String(userId)] ||
        "Unknown User"
    );
}


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {

    try {

        /*
         * Load Notes, Leads and Users
         * simultaneously.
         *
         * OLD:
         * Notes
         * + individual Lead requests
         * + individual User requests
         *
         * NEW:
         * Notes + Leads + Users
         */

        const [
            notesResponse,
            leadsResponse,
            usersResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/api/notes`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            ),

            fetch(
                `${API_BASE_URL}/api/users`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            )

        ]);


        // ==========================================
        // CHECK NOTES RESPONSE
        // ==========================================

        if (!notesResponse.ok) {

            showMessage(
                "Failed to load notes. Status: " +
                notesResponse.status
            );

            return;
        }


        // ==========================================
        // READ NOTES
        // ==========================================

        const notes =
            await notesResponse.json();


        // ==========================================
        // READ LEADS
        // ==========================================

        if (leadsResponse.ok) {

            const leads =
                await leadsResponse.json();


            leadNameMap = {};


            leads.forEach(function (lead) {

                leadNameMap[
                    String(lead.id)
                ] =
                    lead.fullName ||
                    lead.name ||
                    "Unknown Lead";
            });
        }


        // ==========================================
        // READ USERS
        // ==========================================

        if (usersResponse.ok) {

            const users =
                await usersResponse.json();


            userNameMap = {};


            users.forEach(function (user) {

                userNameMap[
                    String(user.id)
                ] =
                    user.fullName ||
                    user.name ||
                    user.username ||
                    "Unknown User";
            });
        }


        // ==========================================
        // DISPLAY NOTES
        // ==========================================

        displayNotes(notes);


    } catch (error) {

        console.error(
            "Error loading notes:",
            error
        );


        showMessage(
            "Unable to connect to the backend."
        );
    }
}


// ==========================================
// DISPLAY NOTES
// ==========================================

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


        const leadName =
            getLeadName(
                note.leadId
            );


        const userName =
            getUserName(
                note.userId
            );


        row.innerHTML = `

            <td>
                ${note.id ?? ""}
            </td>


            <td>
                ${leadName}
                <br>
                <small>
                    ID: ${note.leadId ?? ""}
                </small>
            </td>


            <td>
                ${userName}
                <br>
                <small>
                    ID: ${note.userId ?? ""}
                </small>
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


// ==========================================
// VIEW NOTE
// ==========================================

function viewNote(id) {

    window.location.href =
        `note-details.html?id=${id}`;
}


// ==========================================
// EDIT NOTE
// ==========================================

function editNote(id) {

    window.location.href =
        `edit-note.html?id=${id}`;
}


// ==========================================
// SEARCH NOTES
// ==========================================

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
            row.textContent
                .toLowerCase();


        if (
            rowText.includes(
                searchText
            )
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";
        }

    });

}


// ==========================================
// REFRESH NOTES
// ==========================================

function refreshNotes() {

    loadNotes();
}


// ==========================================
// DELETE NOTE
// ==========================================

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


// ==========================================
// INITIAL LOAD
// ==========================================

loadNotes();