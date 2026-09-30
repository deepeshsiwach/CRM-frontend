const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");

if (!token) {
    window.location.href = "index.html";
}


// ==============================
// User Name
// ==============================

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}


// ==============================
// Logout
// ==============================

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


// ==============================
// Message
// ==============================

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


// ==============================
// Load Courses
// ==============================

async function loadCourses() {

    const courseSelect =
        document.getElementById("courseId");

    if (!courseSelect) {
        return;
    }

    try {

        courseSelect.innerHTML = `
            <option value="">
                Loading courses...
            </option>
        `;


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


        courseSelect.innerHTML = `
            <option value="">
                Select Course
            </option>
        `;


        courses.forEach(
            function (course) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    course.id;

                option.textContent =
                    course.courseName;

                courseSelect.appendChild(
                    option
                );
            }
        );


    } catch (error) {

        console.error(
            "Error loading courses:",
            error
        );


        courseSelect.innerHTML = `
            <option value="">
                Unable to load courses
            </option>
        `;


        showMessage(
            "Unable to load courses.",
            true
        );
    }
}


// ==============================
// Add Campaign Form
// ==============================

const addCampaignForm =
    document.getElementById(
        "addCampaignForm"
    );


if (addCampaignForm) {

    addCampaignForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ------------------------------
            // Get Form Values
            // ------------------------------

            const campaignName =
                document.getElementById(
                    "campaignName"
                ).value.trim();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const source =
                document.getElementById(
                    "source"
                ).value.trim();


            const courseIdValue =
                document.getElementById(
                    "courseId"
                ).value;


            const startDate =
                document.getElementById(
                    "startDate"
                ).value;


            const endDate =
                document.getElementById(
                    "endDate"
                ).value;


            const status =
                document.getElementById(
                    "status"
                ).value;


            // ------------------------------
            // Validation
            // ------------------------------

            if (!campaignName) {

                showMessage(
                    "Campaign name is required.",
                    true
                );

                return;
            }


            if (
                startDate &&
                endDate &&
                endDate < startDate
            ) {

                showMessage(
                    "Campaign end date cannot be before start date.",
                    true
                );

                return;
            }


            // ------------------------------
            // Prepare Campaign Data
            // ------------------------------

            const campaignData = {

                campaignName:
                    campaignName,

                description:
                    description,

                source:
                    source,

                courseId:
                    courseIdValue
                        ? Number(courseIdValue)
                        : null,

                startDate:
                    startDate
                        ? startDate
                        : null,

                endDate:
                    endDate
                        ? endDate
                        : null,

                status:
                    status

            };


            try {

                showMessage(
                    "Creating campaign..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/campaigns`,
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
                                    campaignData
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
                        "Unable to create campaign."
                    );
                }


                showMessage(
                    "Campaign created successfully."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "campaigns.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error creating campaign:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create campaign.",
                    true
                );
            }

        }
    );
}


// ==============================
// Initial Load
// ==============================

loadCourses();