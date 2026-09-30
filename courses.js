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
const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");

            window.location.href = "index.html";
        }
    );
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


// Load courses
async function loadCourses() {

    try {

        showMessage("Loading courses...");

        const response =
            await fetch(
                `${API_BASE_URL}/api/courses`,
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
                "Failed to load courses. Status: " +
                response.status
            );

        }


        const courses =
            await response.json();


        displayCourses(courses);

        showMessage("");

    }

    catch (error) {

        console.error(
            "Error loading courses:",
            error
        );

        showMessage(
            "Unable to load courses.",
            true
        );

    }
}


// Display courses
function displayCourses(courses) {

    const tableBody =
        document.getElementById(
            "coursesTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!courses || courses.length === 0) {

        showMessage(
            "No courses found."
        );

        return;
    }


    courses.forEach(course => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${course.id ?? ""}
            </td>

            <td>
                ${course.courseName ?? ""}
            </td>

            <td>
                ${course.description ?? ""}
            </td>

            <td>
                ${course.durationMonths != null
                    ? course.durationMonths + " months"
                    : ""}
            </td>

            <td>
                ${course.status ?? ""}
            </td>

            <td>
                ${course.createdAt ?? ""}
            </td>

            <td>

                <button
                    type="button"
                    onclick="viewCourse(${course.id})">

                    View

                </button>

                <button
                    type="button"
                    onclick="editCourse(${course.id})">

                    Edit

                </button>

                <button
                    type="button"
                    onclick="deleteCourse(${course.id})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// View course
function viewCourse(id) {

    window.location.href =
        `course-details.html?id=${id}`;

}


// Edit course
function editCourse(id) {

    window.location.href =
        `edit-course.html?id=${id}`;

}


async function deleteCourse(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this course?"
        );

    if (!confirmed) {
        return;
    }

    try {

        showMessage("Deleting course...");


        const response =
            await fetch(
                `${API_BASE_URL}/api/courses/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        let result = null;

        try {

            result =
                await response.json();

        } catch (jsonError) {

            result = null;
        }


        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Unable to delete course."
            );
        }


        showMessage(
            "Course deleted successfully."
        );


        loadCourses();

    } catch (error) {

        console.error(
            "Error deleting course:",
            error
        );

        showMessage(
            error.message ||
            "Unable to delete course.",
            true
        );
    }
}


// Search courses
function searchCourses() {

    const searchInput =
        document.getElementById(
            "searchCourse"
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
            "#coursesTableBody tr"
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


// Refresh courses
function refreshCourses() {

    loadCourses();

}


// Search event
const searchCourse =
    document.getElementById(
        "searchCourse"
    );


if (searchCourse) {

    searchCourse.addEventListener(
        "input",
        searchCourses
    );

}


// Refresh event
const refreshButton =
    document.getElementById(
        "refreshCourses"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshCourses
    );

}


// Initial load
loadCourses();