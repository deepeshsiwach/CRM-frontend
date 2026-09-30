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


// Get Course ID from URL
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const courseId =
    urlParams.get("id");


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


// Load course
async function loadCourse() {

    if (!courseId) {

        showMessage(
            "Course ID is missing.",
            true
        );

        return;
    }


    try {

        showMessage(
            "Loading course..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/courses/${courseId}`,
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
                "Failed to load course. Status: " +
                response.status
            );

        }


        const course =
            await response.json();


        displayCourse(course);

        showMessage("");

    }

    catch (error) {

        console.error(
            "Error loading course:",
            error
        );

        showMessage(
            "Unable to load course.",
            true
        );

    }

}


// Display course
function displayCourse(course) {

    const courseIdElement =
        document.getElementById(
            "courseId"
        );

    const courseNameElement =
        document.getElementById(
            "courseName"
        );

    const descriptionElement =
        document.getElementById(
            "description"
        );

    const durationElement =
        document.getElementById(
            "durationMonths"
        );

    const statusElement =
        document.getElementById(
            "status"
        );

    const createdAtElement =
        document.getElementById(
            "createdAt"
        );

    const updatedAtElement =
        document.getElementById(
            "updatedAt"
        );


    if (courseIdElement) {

        courseIdElement.textContent =
            course.id ?? "-";

    }


    if (courseNameElement) {

        courseNameElement.textContent =
            course.courseName ?? "-";

    }


    if (descriptionElement) {

        descriptionElement.textContent =
            course.description ?? "-";

    }


    if (durationElement) {

        durationElement.textContent =
            course.durationMonths != null
                ? course.durationMonths + " months"
                : "-";

    }


    if (statusElement) {

        statusElement.textContent =
            course.status ?? "-";

    }


    if (createdAtElement) {

        createdAtElement.textContent =
            course.createdAt ?? "-";

    }


    if (updatedAtElement) {

        updatedAtElement.textContent =
            course.updatedAt ?? "-";

    }

}


// Load course when page opens
loadCourse();