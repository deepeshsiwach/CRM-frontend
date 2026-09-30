const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");

if (!token) {
    window.location.href = "index.html";
}

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}


/* ================================
   LOGOUT
================================ */

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

            window.location.href =
                "index.html";
        }
    );
}


/* ================================
   GET COURSE ID FROM URL
================================ */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const courseId =
    urlParams.get("id");


/* ================================
   MESSAGE
================================ */

function showMessage(
    message,
    isError = false
) {

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


/* ================================
   LOAD COURSE
================================ */

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


        /* Course ID */

        document.getElementById(
            "courseId"
        ).value =
            course.id ?? "";


        /* Course Name */

        document.getElementById(
            "courseName"
        ).value =
            course.courseName ?? "";


        /* Description */

        document.getElementById(
            "description"
        ).value =
            course.description ?? "";


        /* Duration */

        document.getElementById(
            "durationMonths"
        ).value =
            course.durationMonths ?? "";


        /* Status */

        document.getElementById(
            "status"
        ).value =
            course.status ?? "ACTIVE";


        showMessage("");

    } catch (error) {

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


/* ================================
   UPDATE COURSE
================================ */

const editCourseForm =
    document.getElementById(
        "editCourseForm"
    );

if (editCourseForm) {

    editCourseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* Get form values */

            const courseName =
                document.getElementById(
                    "courseName"
                ).value.trim();

            const description =
                document.getElementById(
                    "description"
                ).value.trim();

            const durationValue =
                document.getElementById(
                    "durationMonths"
                ).value;

            const status =
                document.getElementById(
                    "status"
                ).value;


            /* Validation */

            if (!courseName) {

                showMessage(
                    "Course name is required.",
                    true
                );

                return;
            }


            let durationMonths = null;

            if (durationValue !== "") {

                durationMonths =
                    Number(durationValue);

                if (
                    !Number.isInteger(
                        durationMonths
                    ) ||
                    durationMonths <= 0
                ) {

                    showMessage(
                        "Duration must be a positive whole number.",
                        true
                    );

                    return;
                }
            }


            /* Request body */

            const courseData = {

                courseName:
                    courseName,

                description:
                    description,

                durationMonths:
                    durationMonths,

                status:
                    status
            };


            try {

                showMessage(
                    "Saving changes..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/courses/${courseId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body:
                                JSON.stringify(
                                    courseData
                                )
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
                        "Unable to update course."
                    );
                }


                showMessage(
                    "Course updated successfully."
                );


                /*
                 * Return to Courses page
                 * after successful update.
                 */

                setTimeout(
                    function () {

                        window.location.href =
                            "courses.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error updating course:",
                    error
                );

                showMessage(
                    error.message ||
                    "Unable to update course.",
                    true
                );
            }

        }
    );
}


/* ================================
   INITIAL LOAD
================================ */

loadCourse();