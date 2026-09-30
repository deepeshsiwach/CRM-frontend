const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");


// Check login
if (!token) {
    window.location.href = "index.html";
}


// Display logged-in user
const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    userNameElement.textContent =
        userName || "User";

}


// Logout
function logout() {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// Show message
function showMessage(message, isError = false) {

    const messageElement =
        document.getElementById("message");

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    messageElement.style.color =
        isError ? "red" : "green";
}


// Load users
async function loadUsers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users`,
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
                "Failed to load users. Status: " +
                response.status
            );

        }


        const users =
            await response.json();


        displayUsers(users);

    }

    catch (error) {

        console.error(
            "Error loading users:",
            error
        );

        showMessage(
            "Unable to load users.",
            true
        );

    }

}


// Display users
function displayUsers(users) {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!users || users.length === 0) {

        showMessage(
            "No users found."
        );

        return;
    }


    showMessage("");


    users.forEach(user => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${user.id ?? ""}
            </td>

            <td>
                ${user.fullName ?? ""}
            </td>

            <td>
                ${user.email ?? ""}
            </td>

            <td>
                ${user.role ?? ""}
            </td>

            <td>
                ${user.status ?? ""}
            </td>

            <td>
                ${user.createdAt ?? ""}
            </td>

            <td>

                <button
                    type="button"
                    onclick="viewUser(${user.id})">

                    View

                </button>


                <button
                    type="button"
                    onclick="editUser(${user.id})">

                    Edit

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// View user
function viewUser(id) {

    window.location.href =
        `user-details.html?id=${id}`;

}


// Edit user
function editUser(id) {

    window.location.href =
        `edit-user.html?id=${id}`;

}


// Search users
function searchUsers() {

    const searchInput =
        document.getElementById(
            "searchUser"
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
            "#usersTableBody tr"
        );


    rows.forEach(row => {

        const rowText =
            row.textContent.toLowerCase();


        row.style.display =
            rowText.includes(searchText)
                ? ""
                : "none";

    });

}


// Refresh
function refreshUsers() {

    loadUsers();

}


// Search event
const searchUser =
    document.getElementById(
        "searchUser"
    );

if (searchUser) {

    searchUser.addEventListener(
        "input",
        searchUsers
    );

}


// Refresh event
const refreshButton =
    document.getElementById(
        "refreshUsers"
    );

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshUsers
    );

}


// Load users when page opens
loadUsers();