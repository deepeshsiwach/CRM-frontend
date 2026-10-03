const token =
    localStorage.getItem("jwtToken");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {

    window.location.href =
        "index.html";

}


// ========================================
// SHOW LOGGED-IN USER
// ========================================

const loggedInUserName =
    localStorage.getItem("userName");

const userNameElement =
    document.getElementById(
        "userName"
    );

if (userNameElement) {

    userNameElement.textContent =
        loggedInUserName ||
        "User";

}


// ========================================
// LOGOUT
// ========================================

document.getElementById(
    "logoutButton"
)
.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "jwtToken"
        );

        localStorage.removeItem(
            "userId"
        );

        localStorage.removeItem(
            "userName"
        );

        localStorage.removeItem(
            "userEmail"
        );

        localStorage.removeItem(
            "userRole"
        );

        window.location.href =
            "index.html";

    }
);


// ========================================
// GET LEAD ID FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const leadIdFromUrl =
    urlParams.get("leadId");


// ========================================
// SET LEAD ID
// ========================================

if (leadIdFromUrl) {

    document.getElementById(
        "leadId"
    ).value =
        leadIdFromUrl;

}


// ========================================
// GET CURRENT USER ID
// ========================================

const currentUserId =
    localStorage.getItem(
        "userId"
    );


if (currentUserId) {

    document.getElementById(
        "userId"
    ).value =
        currentUserId;

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    color = "#374151"
) {

    const messageElement =
        document.getElementById(
            "message"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

        messageElement.style.color =
            color;

    }

}


// ========================================
// LOAD LEAD DETAILS
// ========================================

async function loadLeadDetails() {

    const leadId =
        document.getElementById(
            "leadId"
        ).value;


    if (!leadId) {

        document.getElementById(
            "leadDisplay"
        ).value =
            "No Lead ID";

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
                            "Bearer " +
                            token

                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load lead"
            );

        }


        const lead =
            await response.json();


        const leadName =
            lead.fullName ||
            lead.name ||
            "Unknown Lead";


        document.getElementById(
            "leadDisplay"
        ).value =
            `${leadName} (ID: ${leadId})`;


    } catch (error) {

        console.error(
            "Error loading lead:",
            error
        );


        document.getElementById(
            "leadDisplay"
        ).value =
            `Lead (ID: ${leadId})`;

    }

}


// ========================================
// LOAD USER DETAILS
// ========================================

async function loadUserDetails() {

    const userId =
        document.getElementById(
            "userId"
        ).value;


    if (!userId) {

        document.getElementById(
            "userDisplay"
        ).value =
            "No User ID";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users/${userId}`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load user"
            );

        }


        const user =
            await response.json();


        const userName =
            user.fullName ||
            user.name ||
            user.username ||
            "Unknown User";


        document.getElementById(
            "userDisplay"
        ).value =
            `${userName} (ID: ${userId})`;


    } catch (error) {

        console.error(
            "Error loading user:",
            error
        );


        document.getElementById(
            "userDisplay"
        ).value =
            `User (ID: ${userId})`;

    }

}


// ========================================
// BACK BUTTON
// ========================================

function goBack() {

    if (leadIdFromUrl) {

        window.location.href =
            "lead-details.html?id=" +
            leadIdFromUrl;

    } else {

        window.location.href =
            "notes.html";

    }

}


document.getElementById(
    "backButton"
)
.addEventListener(
    "click",
    goBack
);


document.getElementById(
    "cancelButton"
)
.addEventListener(
    "click",
    goBack
);


// ========================================
// CLEAR BUTTON
// ========================================

document.getElementById(
    "clearButton"
)
.addEventListener(
    "click",
    function () {

        document.getElementById(
            "note"
        ).value = "";

        showMessage(
            ""
        );

    }
);


// ========================================
// ADD NOTE
// ========================================

document.getElementById(
    "addNoteForm"
)
.addEventListener(
    "submit",
    addNote
);


async function addNote(event) {

    event.preventDefault();


    const leadId =
        Number(
            document.getElementById(
                "leadId"
            ).value
        );


    const userId =
        Number(
            document.getElementById(
                "userId"
            ).value
        );


    const note =
        document.getElementById(
            "note"
        ).value.trim();


    // ========================================
    // VALIDATION
    // ========================================

    if (!leadId) {

        showMessage(
            "Please select a valid lead.",
            "red"
        );

        return;

    }


    if (!userId) {

        showMessage(
            "Please select a valid user.",
            "red"
        );

        return;

    }


    if (!note) {

        showMessage(
            "Please enter a note.",
            "red"
        );

        return;

    }


    // ========================================
    // PREPARE DATA
    // ========================================

    const noteData = {

        leadId:
            leadId,

        userId:
            userId,

        note:
            note

    };


    showMessage(
        "Adding note..."
    );


    // ========================================
    // SAVE NOTE
    // ========================================

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
                            "Bearer " +
                            token

                    },

                    body:
                        JSON.stringify(
                            noteData
                        )

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
                response.status,
                "red"
            );

            return;

        }


        showMessage(
            "Note added successfully.",
            "green"
        );


        setTimeout(
            function () {

                if (leadId) {

                    window.location.href =
                        "lead-details.html?id=" +
                        leadId;

                } else {

                    window.location.href =
                        "notes.html";

                }

            },
            800
        );


    } catch (error) {

        console.error(
            "Add Note error:",
            error
        );


        showMessage(
            "Unable to connect to the backend.",
            "red"
        );

    }

}


// ========================================
// INITIAL LOAD
// ========================================

loadLeadDetails();

loadUserDetails();