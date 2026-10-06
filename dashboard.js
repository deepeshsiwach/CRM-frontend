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
// SHOW USER NAME
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
// CHART VARIABLES
// ============================================================

let leadOverviewChart = null;

let crmActivityChart = null;

let agentLeadDistributionChart = null;


// ============================================================
// API HEADERS
// ============================================================

function getHeaders() {

    return {

        "Authorization":
            "Bearer " + token,

        "Content-Type":
            "application/json"

    };

}


// ============================================================
// HIDE MANAGEMENT SECTIONS FOR AGENT
// ============================================================

function hideManagementSectionsForAgent() {

    if (userRole !== "AGENT") {

        return;

    }


    // --------------------------------------------------------
    // Elements marked management-only
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
    // Extra protection by IDs
    // --------------------------------------------------------

    const restrictedIds = [

        "agentLeadDistributionChart",

        "agentPerformanceTable",

        "campaignPerformanceTable",

        "leadSourcePerformanceTable",

        "unassignedLeads",

        "unassignedLeadsCard"

    ];


    restrictedIds.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );

            if (!element) {

                return;

            }


            const card =
                element.closest(
                    ".analytics-card, .dashboard-card"
                );


            if (card) {

                card.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            } else {

                element.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

        }
    );


    // --------------------------------------------------------
    // Extra protection by heading
    // --------------------------------------------------------

    const restrictedTitles = [

        "agent lead distribution",

        "agent performance",

        "campaign performance",

        "lead source performance",

        "unassigned leads"

    ];


    document
        .querySelectorAll("h3")
        .forEach(
            function (heading) {

                const title =
                    (
                        heading.textContent || ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    restrictedTitles.includes(
                        title
                    )
                ) {

                    const card =
                        heading.closest(
                            ".analytics-card, .dashboard-card"
                        );


                    if (card) {

                        card.style.setProperty(
                            "display",
                            "none",
                            "important"
                        );

                    }

                }

            }
        );

}


// ============================================================
// APPLY AGENT RESTRICTION
// ============================================================

hideManagementSectionsForAgent();


document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideManagementSectionsForAgent();

    }
);


setTimeout(
    hideManagementSectionsForAgent,
    200
);


setTimeout(
    hideManagementSectionsForAgent,
    700
);


setTimeout(
    hideManagementSectionsForAgent,
    1500
);


// ============================================================
// TODAY DATE
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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================================================
// CHECK CALL IS TODAY
// ============================================================

function isCallFromToday(call) {

    if (!call) {

        return false;

    }


    if (!call.callStartTime) {

        return false;

    }


    const date =
        new Date(
            call.callStartTime
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}` ===
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

    const assignmentList =
        Array.isArray(
            assignments
        )
            ? assignments
            : [];


    const callList =
        Array.isArray(
            calls
        )
            ? calls
            : [];


    // --------------------------------------------------------
    // CURRENT ACTIVE ASSIGNED LEADS
    // --------------------------------------------------------

    const assignedLeadIds =
        new Set();


    assignmentList.forEach(
        function (assignment) {

            if (
                assignment &&
                assignment.leadId !== null &&
                assignment.leadId !== undefined
            ) {

                assignedLeadIds.add(
                    String(
                        assignment.leadId
                    )
                );

            }

        }
    );


    // --------------------------------------------------------
    // TODAY'S CALLS
    // --------------------------------------------------------

    const todayCalls =
        callList.filter(
            function (call) {

                return isCallFromToday(
                    call
                );

            }
        );


    // --------------------------------------------------------
    // UNIQUE LEADS CALLED TODAY
    // --------------------------------------------------------

    const attendedLeadIds =
        new Set();


    todayCalls.forEach(
        function (call) {

            if (
                call &&
                call.leadId !== null &&
                call.leadId !== undefined
            ) {

                const leadId =
                    String(
                        call.leadId
                    );


                if (
                    assignedLeadIds.has(
                        leadId
                    )
                ) {

                    attendedLeadIds.add(
                        leadId
                    );

                }

            }

        }
    );


    const totalLeads =
        assignedLeadIds.size;


    const attendedLeads =
        attendedLeadIds.size;


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

    if (userRole !== "AGENT") {

        return;

    }


    const summary =
        calculateAgentWorkSummary(
            assignments,
            calls
        );


    const totalElement =
        document.getElementById(
            "totalLeads"
        );


    const attendedElement =
        document.getElementById(
            "attendedLeads"
        );


    const remainingElement =
        document.getElementById(
            "remainingLeads"
        );


    if (totalElement) {

        totalElement.textContent =
            summary.totalLeads;

    }


    if (attendedElement) {

        attendedElement.textContent =
            summary.attendedLeads;

    }


    if (remainingElement) {

        remainingElement.textContent =
            summary.remainingLeads;

    }

}


// ============================================================
// UPDATE FOLLOW-UP CARDS
// ============================================================

function updateFollowUpCards(
    followUps
) {

    const list =
        Array.isArray(
            followUps
        )
            ? followUps
            : [];


    const totalElement =
        document.getElementById(
            "totalFollowUps"
        );


    const pendingElement =
        document.getElementById(
            "pendingFollowUps"
        );


    const completedElement =
        document.getElementById(
            "completedFollowUps"
        );


    const missedElement =
        document.getElementById(
            "missedFollowUps"
        );


    const cancelledElement =
        document.getElementById(
            "cancelledFollowUps"
        );


    const todayElement =
        document.getElementById(
            "todayFollowUps"
        );


    if (totalElement) {

        totalElement.textContent =
            list.length;

    }


    let pending = 0;

    let completed = 0;

    let missed = 0;

    let cancelled = 0;

    let today = 0;


    const todayString =
        getTodayDateString();


    list.forEach(
        function (followUp) {

            const status =
                String(
                    followUp.status ||
                    ""
                )
                .toUpperCase();


            if (
                status ===
                "PENDING"
            ) {

                pending++;

            }


            if (
                status ===
                "COMPLETED"
            ) {

                completed++;

            }


            if (
                status ===
                "MISSED"
            ) {

                missed++;

            }


            if (
                status ===
                "CANCELLED"
            ) {

                cancelled++;

            }


            const dateValue =
                followUp.followUpDate ||
                followUp.scheduledDate ||
                followUp.date ||
                followUp.followUpTime;


            if (dateValue) {

                const date =
                    new Date(
                        dateValue
                    );


                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    const year =
                        date.getFullYear();

                    const month =
                        String(
                            date.getMonth() + 1
                        )
                        .padStart(
                            2,
                            "0"
                        );

                    const day =
                        String(
                            date.getDate()
                        )
                        .padStart(
                            2,
                            "0"
                        );


                    const dateString =
                        `${year}-${month}-${day}`;


                    if (
                        dateString ===
                        todayString
                    ) {

                        today++;

                    }

                }

            }

        }
    );


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (missedElement) {

        missedElement.textContent =
            missed;

    }


    if (cancelledElement) {

        cancelledElement.textContent =
            cancelled;

    }


    if (todayElement) {

        todayElement.textContent =
            today;

    }

}


// ============================================================
// UPDATE CALL COUNT
// ============================================================

function updateCallCount(
    calls
) {

    const element =
        document.getElementById(
            "totalCalls"
        );


    if (element) {

        element.textContent =
            Array.isArray(calls)
                ? calls.length
                : 0;

    }

}


// ============================================================
// UPDATE UNASSIGNED LEADS
// ADMIN / MANAGER ONLY
// ============================================================

function updateUnassignedLeads(
    leads,
    assignments
) {

    if (userRole === "AGENT") {

        return;

    }


    const element =
        document.getElementById(
            "unassignedLeads"
        );


    if (!element) {

        return;

    }


    const assignedIds =
        new Set();


    (
        Array.isArray(assignments)
            ? assignments
            : []
    )
    .forEach(
        function (assignment) {

            if (
                assignment &&
                assignment.leadId !== null &&
                assignment.leadId !== undefined
            ) {

                assignedIds.add(
                    String(
                        assignment.leadId
                    )
                );

            }

        }
    );


    const list =
        Array.isArray(
            leads
        )
            ? leads
            : [];


    let count = 0;


    list.forEach(
        function (lead) {

            if (
                !lead ||
                lead.id === null ||
                lead.id === undefined
            ) {

                return;

            }


            const status =
                String(
                    lead.status ||
                    ""
                )
                .toUpperCase();


            const closed =
                status === "ENROLLED" ||
                status === "NOT_INTERESTED" ||
                status === "LOST" ||
                status === "WRONG_NUMBER";


            if (
                !closed &&
                !assignedIds.has(
                    String(
                        lead.id
                    )
                )
            ) {

                count++;

            }

        }
    );


    element.textContent =
        count;

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


    if (leadOverviewChart) {

        leadOverviewChart.destroy();

    }


    const counts = {};


    (
        Array.isArray(leads)
            ? leads
            : []
    )
    .forEach(
        function (lead) {

            let status =
                lead.status ||
                lead.leadStatus ||
                "UNSPECIFIED";


            status =
                String(
                    status
                )
                .toUpperCase();


            counts[status] =
                (
                    counts[status] ||
                    0
                ) + 1;

        }
    );


    const labels =
        Object.keys(
            counts
        );


    const values =
        Object.values(
            counts
        );


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
                            values,

                        borderWidth:
                            0,

                        hoverOffset:
                            8

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

                                usePointStyle:
                                    true,

                                padding:
                                    15

                            }

                        }

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


    if (crmActivityChart) {

        crmActivityChart.destroy();

    }


    const leadCount =
        Array.isArray(leads)
            ? leads.length
            : 0;


    const assignmentCount =
        Array.isArray(assignments)
            ? assignments.length
            : 0;


    const followUpCount =
        Array.isArray(followUps)
            ? followUps.length
            : 0;


    const callCount =
        Array.isArray(calls)
            ? calls.length
            : 0;


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

                            leadCount,

                            assignmentCount,

                            followUpCount,

                            callCount

                        ],

                        borderRadius:
                            8,

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

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            }

                        },

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// AGENT LEAD DISTRIBUTION CHART
// ADMIN / MANAGER ONLY
// ============================================================

function renderAgentLeadDistribution(
    data
) {

    if (userRole === "AGENT") {

        return;

    }


    const canvas =
        document.getElementById(
            "agentLeadDistributionChart"
        );


    if (!canvas) {

        return;

    }


    if (agentLeadDistributionChart) {

        agentLeadDistributionChart.destroy();

    }


    const list =
        Array.isArray(data)
            ? data
            : [];


    const labels =
        list.map(
            function (item) {

                return (
                    item.agentName ||
                    (
                        "Agent " +
                        (
                            item.agentId ||
                            "-"
                        )
                    )
                );

            }
        );


    const values =
        list.map(
            function (item) {

                return Number(
                    item.activeLeads ||
                    0
                );

            }
        );


    agentLeadDistributionChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels:
                        labels,

                    datasets: [{

                        label:
                            "Active Leads",

                        data:
                            values,

                        borderRadius:
                            8,

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

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// AGENT PERFORMANCE TABLE
// ADMIN / MANAGER ONLY
// ============================================================

function renderAgentPerformance(
    data
) {

    if (userRole === "AGENT") {

        return;

    }


    const body =
        document.getElementById(
            "agentPerformanceTableBody"
        );


    if (!body) {

        return;

    }


    const list =
        Array.isArray(data)
            ? data
            : [];


    body.innerHTML =
        "";


    if (!list.length) {

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    No agent performance data available.
                </td>
            </tr>
            `;

        return;

    }


    list.forEach(
        function (item) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =
                `
                <td style="padding:12px;">
                    ${
                        item.agentName ||
                        "-"
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        Number(
                            item.activeLeads ||
                            0
                        )
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        Number(
                            item.totalCalls ||
                            0
                        )
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        Number(
                            item.enrolledLeads ||
                            0
                        )
                    }
                </td>
                `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================================
// CAMPAIGN PERFORMANCE TABLE
// ADMIN / MANAGER ONLY
// ============================================================

function renderCampaignPerformance(
    data
) {

    if (userRole === "AGENT") {

        return;

    }


    const body =
        document.getElementById(
            "campaignPerformanceTableBody"
        );


    if (!body) {

        return;

    }


    const list =
        Array.isArray(data)
            ? data
            : [];


    body.innerHTML =
        "";


    if (!list.length) {

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    No campaign performance data available.
                </td>
            </tr>
            `;

        return;

    }


    list.forEach(
        function (item) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =
                `
                <td style="padding:12px;">
                    ${
                        item.campaignName ||
                        "-"
                    }
                </td>

                <td style="padding:12px;">
                    ${
                        item.source ||
                        "-"
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        item.status ||
                        "-"
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        Number(
                            item.totalLeads ||
                            0
                        )
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${
                        Number(
                            item.enrolledLeads ||
                            0
                        )
                    }
                </td>
                `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================================
// LEAD SOURCE PERFORMANCE TABLE
// ADMIN / MANAGER ONLY
// ============================================================

function renderLeadSourcePerformance(
    data
) {

    if (userRole === "AGENT") {

        return;

    }


    const body =
        document.getElementById(
            "leadSourcePerformanceTableBody"
        );


    if (!body) {

        return;

    }


    const list =
        Array.isArray(data)
            ? data
            : [];


    body.innerHTML =
        "";


    if (!list.length) {

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    No lead source data available.
                </td>
            </tr>
            `;

        return;

    }


    list.forEach(
        function (item) {

            const total =
                Number(
                    item.totalLeads ||
                    0
                );


            const enrolled =
                Number(
                    item.enrolledLeads ||
                    0
                );


            let conversionRate;


            if (
                item.conversionRate !==
                undefined &&
                item.conversionRate !==
                null
            ) {

                conversionRate =
                    Number(
                        item.conversionRate
                    )
                    .toFixed(
                        1
                    ) +
                    "%";

            } else {

                conversionRate =
                    total > 0
                        ?
                        (
                            (
                                enrolled /
                                total
                            ) *
                            100
                        )
                        .toFixed(
                            1
                        ) +
                        "%"
                        :
                        "0.0%";

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =
                `
                <td style="padding:12px;">
                    ${
                        item.source ||
                        "Unknown"
                    }
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${total}
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${enrolled}
                </td>

                <td
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    ${conversionRate}
                </td>
                `;


            body.appendChild(
                row
            );

        }
    );

}


// ============================================================
// LOAD MANAGEMENT DASHBOARD SUMMARY
// ADMIN / MANAGER ONLY
// ============================================================

async function loadManagementAnalytics() {

    if (
        userRole !== "ADMIN" &&
        userRole !== "MANAGER"
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/dashboard/summary`,
                {

                    method:
                        "GET",

                    headers:
                        getHeaders()

                }
            );


        if (!response.ok) {

            console.error(
                "Dashboard summary failed:",
                response.status
            );

            return;

        }


        const summary =
            await response.json();


        console.log(
            "Management dashboard summary:",
            summary
        );


        // ----------------------------------------------------
        // MANAGEMENT ANALYTICS
        // ----------------------------------------------------

        renderAgentLeadDistribution(
            summary.agentLeadDistribution
        );


        renderAgentPerformance(
            summary.agentPerformance
        );


        renderCampaignPerformance(
            summary.campaignPerformance
        );


        renderLeadSourcePerformance(
            summary.leadSourcePerformance
        );


        // ----------------------------------------------------
        // SUMMARY VALUES
        // ----------------------------------------------------

        const totalLeadsElement =
            document.getElementById(
                "totalLeads"
            );


        if (
            totalLeadsElement &&
            summary.totalLeads !==
                undefined
        ) {

            totalLeadsElement.textContent =
                summary.totalLeads;

        }


        const totalFollowUpsElement =
            document.getElementById(
                "totalFollowUps"
            );


        if (
            totalFollowUpsElement &&
            summary.totalFollowUps !==
                undefined
        ) {

            totalFollowUpsElement.textContent =
                summary.totalFollowUps;

        }


        const pendingElement =
            document.getElementById(
                "pendingFollowUps"
            );


        if (
            pendingElement &&
            summary.pendingFollowUps !==
                undefined
        ) {

            pendingElement.textContent =
                summary.pendingFollowUps;

        }


        const completedElement =
            document.getElementById(
                "completedFollowUps"
            );


        if (
            completedElement &&
            summary.completedFollowUps !==
                undefined
        ) {

            completedElement.textContent =
                summary.completedFollowUps;

        }


        const missedElement =
            document.getElementById(
                "missedFollowUps"
            );


        if (
            missedElement &&
            summary.missedFollowUps !==
                undefined
        ) {

            missedElement.textContent =
                summary.missedFollowUps;

        }


        const cancelledElement =
            document.getElementById(
                "cancelledFollowUps"
            );


        if (
            cancelledElement &&
            summary.cancelledFollowUps !==
                undefined
        ) {

            cancelledElement.textContent =
                summary.cancelledFollowUps;

        }


        const unassignedElement =
            document.getElementById(
                "unassignedLeads"
            );


        if (
            unassignedElement &&
            summary.unassignedLeads !==
                undefined
        ) {

            unassignedElement.textContent =
                summary.unassignedLeads;

        }

    } catch (error) {

        console.error(
            "Management analytics error:",
            error
        );

    }

}


// ============================================================
// LOAD DASHBOARD DATA
// ============================================================

async function loadDashboardData() {

    try {

        // ====================================================
        // API URLS
        // ====================================================

        const leadsUrl =
            `${API_BASE_URL}/api/leads`;


        const assignmentsUrl =
            userRole === "AGENT"
                ?
                `${API_BASE_URL}/api/agent/leads/${localStorage.getItem("userId")}`
                :
                `${API_BASE_URL}/api/lead-assignments/status/ACTIVE`;


        const followUpsUrl =
            `${API_BASE_URL}/api/follow-ups`;


        const callsUrl =
            `${API_BASE_URL}/api/call-logs`;


        // ====================================================
        // LOAD MAIN DATA
        // ====================================================

        const [

            leadsResponse,

            assignmentsResponse,

            followUpsResponse,

            callsResponse

        ] =
            await Promise.all([

                fetch(
                    leadsUrl,
                    {

                        method:
                            "GET",

                        headers:
                            getHeaders()

                    }
                ),

                fetch(
                    assignmentsUrl,
                    {

                        method:
                            "GET",

                        headers:
                            getHeaders()

                    }
                ),

                fetch(
                    followUpsUrl,
                    {

                        method:
                            "GET",

                        headers:
                            getHeaders()

                    }
                ),

                fetch(
                    callsUrl,
                    {

                        method:
                            "GET",

                        headers:
                            getHeaders()

                    }
                )

            ]);


        // ====================================================
        // CHECK API RESPONSES
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
        // PARSE JSON
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
        // SAFETY ARRAYS
        // ====================================================

        const leadList =
            Array.isArray(leads)
                ? leads
                : [];


        const assignmentList =
            Array.isArray(assignments)
                ? assignments
                : [];


        const followUpList =
            Array.isArray(followUps)
                ? followUps
                : [];


        const callList =
            Array.isArray(calls)
                ? calls
                : [];


        // ====================================================
        // AGENT DASHBOARD
        // ====================================================

        if (userRole === "AGENT") {

            updateAgentWorkCards(
                assignmentList,
                callList
            );

        }


        // ====================================================
        // ADMIN / MANAGER DASHBOARD
        // ====================================================

        else {

            const totalLeadsElement =
                document.getElementById(
                    "totalLeads"
                );


            if (totalLeadsElement) {

                totalLeadsElement.textContent =
                    leadList.length;

            }


            const attendedCard =
                document.getElementById(
                    "attendedLeadsCard"
                );


            const remainingCard =
                document.getElementById(
                    "remainingLeadsCard"
                );


            if (attendedCard) {

                attendedCard.style.display =
                    "none";

            }


            if (remainingCard) {

                remainingCard.style.display =
                    "none";

            }


            updateUnassignedLeads(
                leadList,
                assignmentList
            );

        }


        // ====================================================
        // FOLLOW-UP CARDS
        // ====================================================

        updateFollowUpCards(
            followUpList
        );


        // ====================================================
        // CALL COUNT
        // ====================================================

        updateCallCount(
            callList
        );


        // ====================================================
        // LEAD OVERVIEW
        //
        // IMPORTANT:
        // For Agent, /api/leads already returns
        // only the agent's permitted leads.
        // ====================================================

        createLeadOverviewChart(
            leadList
        );


        // ====================================================
        // CRM ACTIVITY
        // ====================================================

        createCRMActivityChart(
            leadList,
            assignmentList,
            followUpList,
            callList
        );


        // ====================================================
        // ADMIN / MANAGER ANALYTICS
        // ====================================================

        await loadManagementAnalytics();


        // ====================================================
        // FINAL AGENT SECURITY
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
// START DASHBOARD
// ============================================================

loadDashboardData();


// ============================================================
// FINAL AGENT SECURITY CHECKS
// ============================================================

setTimeout(
    hideManagementSectionsForAgent,
    1000
);


setTimeout(
    hideManagementSectionsForAgent,
    2000
);


setTimeout(
    hideManagementSectionsForAgent,
    3000
);