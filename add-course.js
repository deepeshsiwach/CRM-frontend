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


// Add Course form
const addCourseForm =
    document.getElementById("addCourseForm");

if (addCourseForm) {

    addCourseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get values
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


            // Validation
            if (!courseName) {

                showMessage(
                    "Please enter course name.",
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
                    durationMonths < 1
                ) {

                    showMessage(
                        "Duration must be a positive whole number.",
                        true
                    );

                    return;
                }

            }


            if (!status) {

                showMessage(
                    "Please select status.",
                    true
                );

                return;
            }


            // Prepare course data
            const courseData = {

                courseName: courseName,

                description: description,

                durationMonths: durationMonths,

                status: status

            };


            try {

                showMessage(
                    "Creating course..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/courses`,
                        {

                            method: "POST",

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

                }

                catch (jsonError) {

                    result = null;

                }


                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        result?.error ||
                        "Failed to create course."
                    );

                }


                showMessage(
                    "Course created successfully."
                );


                addCourseForm.reset();


                document.getElementById(
                    "status"
                ).value = "ACTIVE";


                setTimeout(
                    function () {

                        window.location.href =
                            "courses.html";

                    },
                    1000
                );

            }

            catch (error) {

                console.error(
                    "Error creating course:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create course.",
                    true
                );

            }

        }
    );

}