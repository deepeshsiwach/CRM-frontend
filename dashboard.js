// ============================================================
// DERIVION CRM - DASHBOARD
// ============================================================


// ============================================================
// LOGIN INFORMATION
// ============================================================

const token =
    localStorage.getItem("jwtToken");

const userName =
    localStorage.getItem("userName");


// ============================================================
// NORMALIZE USER ROLE
// Supports:
// AGENT
// ROLE_AGENT
// ADMIN
// ROLE_ADMIN
// MANAGER
// ROLE_MANAGER
// ============================================================

let userRole =
    (
        localStorage.getItem("userRole") || ""
    )
    .trim()
    .toUpperCase();


if (userRole.startsWith("ROLE_")) {

    userRole =
        userRole.substring(5);

}


// ============================================================
// CHECK LOGIN
// ============================================================

if (!token) {

    window.location.href =
        "index.html";

}


// ============================================================
// SHOW LOGGED-IN USER
// ============================================================

const userNameElement =
    document.getElementById(
        "userName"
    );


if (userNameElement) {

    userNameElement.textContent =
        userName || "User";

}


// ============================================================
// LOGOUT
// ============================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
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

}


// ============================================================
// HIDE MANAGEMENT INFORMATION FROM AGENTS
// ============================================================

function hideManagementSectionsForAgent() {

    if (userRole !== "AGENT") {

        return;

    }


    // --------------------------------------------------------
    // MANAGEMENT ANALYTICS
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".management-only"
        )
        .forEach(
            function (element) {

                element.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }
        );


    // --------------------------------------------------------
    // EXTRA SAFETY
    // If any of these sections exist without the class,
    // hide them by their IDs as well.
    // --------------------------------------------------------

    const restrictedElements = [

        "agentLeadDistributionChart",

        "agentPerformanceTable",

        "campaignPerformanceTable",

        "leadSourcePerformanceTable",

        "unassignedLeadsCard"

    ];


    restrictedElements.forEach(
        function (elementId) {

            const element =
                document.getElementById(
                    elementId
                );


            if (!element) {

                return;

            }


            const parentCard =
                element.closest(
                    ".analytics-card, .dashboard-card"
                );


            if (parentCard) {

                parentCard.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

        }
    );

}


// ============================================================
// RUN ACCESS RESTRICTIONS
// ============================================================

hideManagementSectionsForAgent();


document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideManagementSectionsForAgent();

    }
);


// Extra protection after dashboard rendering

setTimeout(
    hideManagementSectionsForAgent,
    100
);


setTimeout(
    hideManagementSectionsForAgent,
    500
);


setTimeout(
    hideManagementSectionsForAgent,
    1000
);


// ============================================================
// CHART VARIABLES
// ============================================================

let leadOverviewChart = null;

let crmActivityChart = null;


// ============================================================
// COMMON API HEADERS
// ============================================================

function getHeaders() {

    return {

        "Authorization":
            "Bearer " + token

    };

}


// ============================================================
// GET TODAY'S DATE
// ============================================================

function getTodayDateString() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


// ============================================================
// CHECK WHETHER CALL IS TODAY
// ============================================================

function isCallFromToday(call) {

    if (!call) {

        return false;

    }


    const callStartTime =
        call.callStartTime;


    if (!callStartTime) {

        return false;

    }


    const callDate =
        new Date(
            callStartTime
        );


    if (
        Number.isNaN(
            callDate.getTime()
        )
    ) {

        return false;

    }


    const year =
        callDate.getFullYear();


    const month =
        String(
            callDate.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            callDate.getDate()
        )
        .padStart(
            2,
            "0"
        );


    const callDateString =
        `${year}-${month}-${day}`;


    return (
        callDateString ===
        getTodayDateString()
    );

}


// ============================================================
// AGENT WORK SUMMARY
// ============================================================

function calculateAgentWorkSummary(
    assignments,
    calls
) {

    // --------------------------------------------------------
    // TOTAL ACTIVE ASSIGNED LEADS
    // --------------------------------------------------------

    const totalLeads =
        Array.isArray(
            assignments
        )
            ? assignments.length
            : 0;


    // --------------------------------------------------------
    // GET TODAY'S CALLS
    // --------------------------------------------------------

    const todayCalls =
        Array.isArray(
            calls
        )
            ? calls.filter(
                function (call) {

                    return isCallFromToday(
                        call
                    );

                }
            )
            : [];


    // --------------------------------------------------------
    // UNIQUE LEADS ATTENDED TODAY
    // --------------------------------------------------------

    const attendedLeadIds =
        new Set();


    todayCalls.forEach(
        function (call) {

            if (
                call.leadId !== null &&
                call.leadId !== undefined
            ) {

                attendedLeadIds.add(
                    String(
                        call.leadId
                    )
                );

            }

        }
    );


    // --------------------------------------------------------
    // CURRENTLY ASSIGNED LEADS
    // --------------------------------------------------------

    const assignedLeadIds =
        new Set();


    if (Array.isArray(assignments)) {

        assignments.forEach(
            function (assignment) {

                const leadId =
                    assignment.leadId;


                if (
                    leadId !== null &&
                    leadId !== undefined
                ) {

                    assignedLeadIds.add(
                        String(
                            leadId
                        )
                    );

                }

            }
        );

    }


    // --------------------------------------------------------
    // COUNT UNIQUE ATTENDED LEADS
    // THAT ARE CURRENTLY ASSIGNED
    // --------------------------------------------------------

    let attendedLeads = 0;


    attendedLeadIds.forEach(
        function (leadId) {

            if (
                assignedLeadIds.has(
                    leadId
                )
            ) {

                attendedLeads++;

            }

        }
    );


    // --------------------------------------------------------
    // REMAINING LEADS
    // --------------------------------------------------------

    const remainingLeads =
        Math.max(
            0,
            totalLeads -
            attendedLeads
        );


    return {

        totalLeads:
            totalLeads,

        attendedLeads:
            attendedLeads,

        remainingLeads:
            remainingLeads

    };

}


// ============================================================
// UPDATE AGENT WORK CARDS
// ============================================================

function updateAgentWorkCards(
    assignments,
    calls
) {

    const totalLeadsElement =
        document.getElementById(
            "totalLeads"
        );


    const attendedLeadsElement =
        document.getElementById(
            "attendedLeads"
        );


    const remainingLeadsElement =
        document.getElementById(
            "remainingLeads"
        );


    const attendedLeadsCard =
        document.getElementById(
            "attendedLeadsCard"
        );


    const remainingLeadsCard =
        document.getElementById(
            "remainingLeadsCard"
        );


    // ========================================================
    // AGENT DASHBOARD
    // ========================================================

    if (userRole === "AGENT") {

        const summary =
            calculateAgentWorkSummary(
                assignments,
                calls
            );


        if (totalLeadsElement) {

            totalLeadsElement.textContent =
                summary.totalLeads;

        }


        if (attendedLeadsElement) {

            attendedLeadsElement.textContent =
                summary.attendedLeads;

        }


        if (remainingLeadsElement) {

            remainingLeadsElement.textContent =
                summary.remainingLeads;

        }


        // Show Agent cards

        if (attendedLeadsCard) {

            attendedLeadsCard.style.display =
                "";

        }


        if (remainingLeadsCard) {

            remainingLeadsCard.style.display =
                "";

        }


        // Total lead label

        const totalCard =
            totalLeadsElement
                ?.closest(
                    ".dashboard-card"
                );


        if (totalCard) {

            const label =
                totalCard.querySelector(
                    ".card-label"
                );


            if (label) {

                label.textContent =
                    "Currently assigned";

            }

        }


        // Make absolutely sure restricted
        // dashboard sections stay hidden.

        hideManagementSectionsForAgent();


        return;

    }


    // ========================================================
    // ADMIN / MANAGER DASHBOARD
    // ========================================================

    if (attendedLeadsCard) {

        attendedLeadsCard.style.display =
            "none";

    }


    if (remainingLeadsCard) {

        remainingLeadsCard.style.display =
            "none";

    }

}


// ============================================================
// LOAD DASHBOARD DATA
// ============================================================

async function loadDashboardData() {

    try {

        const [

            leadsResponse,

            assignmentsResponse,

            followUpsResponse,

            callsResponse

        ] = await Promise.all([


            // ------------------------------------------------
            // LEADS
            // ------------------------------------------------

            fetch(
                `${API_BASE_URL}/api/leads`,
                {

                    method: "GET",

                    headers:
                        getHeaders()

                }
            ),


            // ------------------------------------------------
            // ASSIGNMENTS
            // ------------------------------------------------

            fetch(

                userRole === "AGENT"

                    ?

                    `${API_BASE_URL}/api/agent/leads/${localStorage.getItem("userId")}`

                    :

                    `${API_BASE_URL}/api/lead-assignments/status/ACTIVE`,

                {

                    method: "GET",

                    headers:
                        getHeaders()

                }

            ),


            // ------------------------------------------------
            // FOLLOW-UPS
            // ------------------------------------------------

            fetch(
                `${API_BASE_URL}/api/follow-ups`,
                {

                    method: "GET",

                    headers:
                        getHeaders()

                }
            ),


            // ------------------------------------------------
            // CALL LOGS
            // ------------------------------------------------

            fetch(
                `${API_BASE_URL}/api/call-logs`,
                {

                    method: "GET",

                    headers:
                        getHeaders()

                }
            )

        ]);


        // ====================================================
        // CHECK RESPONSES
        // ====================================================

        if (!leadsResponse.ok) {

            throw new Error(
                "Failed to load leads"
            );

        }


        if (!assignmentsResponse.ok) {

            throw new Error(
                "Failed to load assignments"
            );

        }


        if (!followUpsResponse.ok) {

            throw new Error(
                "Failed to load follow-ups"
            );

        }


        if (!callsResponse.ok) {

            throw new Error(
                "Failed to load call logs"
            );

        }


        // ====================================================
        // CONVERT TO JSON
        // ====================================================

        const leads =
            await leadsResponse.json();


        const assignments =
            await assignmentsResponse.json();


        const followUps =
            await followUpsResponse.json();


        const calls =
            await callsResponse.json();


        // ====================================================
        // TOTAL LEADS
        // ====================================================

        const totalLeadsElement =
            document.getElementById(
                "totalLeads"
            );


        // ====================================================
        // AGENT
        // ====================================================

        if (userRole === "AGENT") {

            updateAgentWorkCards(
                assignments,
                calls
            );

        }


        // ====================================================
        // ADMIN / MANAGER
        // ====================================================

        else {

            if (totalLeadsElement) {

                totalLeadsElement.textContent =
                    leads.length;

            }


            const totalLeadCard =
                totalLeadsElement
                    ?.closest(
                        ".dashboard-card"
                    );


            if (totalLeadCard) {

                const label =
                    totalLeadCard.querySelector(
                        ".card-label"
                    );


                if (label) {

                    label.textContent =
                        "All CRM leads";

                }

            }

        }


        // ====================================================
        // FOLLOW-UPS
        // ====================================================

        const totalFollowUpsElement =
            document.getElementById(
                "totalFollowUps"
            );


        if (totalFollowUpsElement) {

            totalFollowUpsElement.textContent =
                followUps.length;

        }


        // ====================================================
        // CALL LOGS
        // ====================================================

        const totalCallsElement =
            document.getElementById(
                "totalCalls"
            );


        if (totalCallsElement) {

            totalCallsElement.textContent =
                calls.length;

        }


        // ====================================================
        // CREATE CHARTS
        // ====================================================

        createLeadOverviewChart(
            leads
        );


        createCRMActivityChart(
            leads,
            assignments,
            followUps,
            calls
        );


        // ====================================================
        // FINAL AGENT SECURITY CHECK
        // ====================================================

        hideManagementSectionsForAgent();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ============================================================
// LEAD OVERVIEW CHART
// ============================================================

function createLeadOverviewChart(
    leads
) {

    const canvas =
        document.getElementById(
            "leadOverviewChart"
        );


    if (!canvas) {

        return;

    }


    // Destroy old chart

    if (leadOverviewChart) {

        leadOverviewChart.destroy();

    }


    // ========================================================
    // GROUP LEADS BY STATUS
    // ========================================================

    const statusCounts = {};


    if (Array.isArray(leads)) {

        leads.forEach(
            function (lead) {

                let status =
                    lead.status ||
                    lead.leadStatus ||
                    "UNSPECIFIED";


                status =
                    String(
                        status
                    ).toUpperCase();


                if (
                    !statusCounts[status]
                ) {

                    statusCounts[status] =
                        0;

                }


                statusCounts[status]++;

            }
        );

    }


    const labels =
        Object.keys(
            statusCounts
        );


    const data =
        Object.values(
            statusCounts
        );


    // ========================================================
    // CREATE DOUGHNUT CHART
    // ========================================================

    leadOverviewChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels:
                        labels,

                    datasets: [{

                        data:
                            data,

                        borderWidth:
                            0,

                        hoverOffset:
                            10

                    }]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",


                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding:
                                    18,

                                usePointStyle:
                                    true,

                                font: {

                                    size:
                                        12

                                }

                            }

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (

                                            " " +

                                            context.label +

                                            ": " +

                                            context.raw

                                        );

                                    }

                            }

                        }

                    },


                    animation: {

                        animateRotate:
                            true,

                        animateScale:
                            true,

                        duration:
                            1200

                    }

                }

            }
        );

}


// ============================================================
// CRM ACTIVITY CHART
// ============================================================

function createCRMActivityChart(
    leads,
    assignments,
    followUps,
    calls
) {

    const canvas =
        document.getElementById(
            "crmActivityChart"
        );


    if (!canvas) {

        return;

    }


    // Destroy old chart

    if (crmActivityChart) {

        crmActivityChart.destroy();

    }


    // ========================================================
    // CREATE BAR CHART
    // ========================================================

    crmActivityChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels: [

                        "Leads",

                        "Assigned",

                        "Follow-ups",

                        "Calls"

                    ],


                    datasets: [{

                        label:
                            "CRM Activity",

                        data: [

                            Array.isArray(leads)
                                ? leads.length
                                : 0,

                            Array.isArray(assignments)
                                ? assignments.length
                                : 0,

                            Array.isArray(followUps)
                                ? followUps.length
                                : 0,

                            Array.isArray(calls)
                                ? calls.length
                                : 0

                        ],

                        borderRadius:
                            10,

                        borderSkipped:
                            false,

                        maxBarThickness:
                            60

                    }]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (

                                            " " +

                                            context.raw +

                                            " records"

                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            },


                            ticks: {

                                font: {

                                    size:
                                        12

                                }

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            ticks: {

                                precision:
                                    0

                            },


                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"

                            }

                        }

                    },


                    animation: {

                        duration:
                            1200,

                        easing:
                            "easeOutQuart"

                    }

                }

            }
        );

}


// ============================================================
// START DASHBOARD
// ============================================================

loadDashboardData();


// ============================================================
// FINAL SECURITY CHECKS
// ============================================================

setTimeout(
    hideManagementSectionsForAgent,
    1500
);

setTimeout(
    hideManagementSectionsForAgent,
    2500
);