const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");
const userRole = localStorage.getItem("userRole");
const userId = localStorage.getItem("userId");

// ================================
// CHECK LOGIN
// ================================

if (!token) {
    window.location.href = "index.html";
}


// ================================
// SHOW LOGGED-IN USER
// ================================

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    userNameElement.textContent =
        userName || "User";

}


// ================================
// LOGOUT
// ================================

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


// ================================
// CHART VARIABLES
// ================================

let leadOverviewChart = null;
let crmActivityChart = null;
let agentLeadDistributionChart = null;


// ================================
// COMMON API HEADERS
// ================================

function getHeaders() {

    return {

        "Authorization":
            "Bearer " + token,

        "Content-Type":
            "application/json"

    };

}


// ================================
// SAFE JSON RESPONSE
// ================================

async function readJsonResponse(
    response,
    errorMessage
) {

    if (!response.ok) {

        let serverMessage = "";

        try {

            serverMessage =
                await response.text();

        } catch (error) {

            // Ignore response parsing error

        }


        throw new Error(

            errorMessage +
            " (" +
            response.status +
            ")" +
            (
                serverMessage
                    ? ": " + serverMessage
                    : ""
            )

        );

    }


    return await response.json();

}


// ================================
// COUNT FOLLOW-UP STATUS
// ================================

function countFollowUpStatus(
    followUps,
    status
) {

    return followUps.filter(
        function (followUp) {

            return String(
                followUp.status || ""
            ).toUpperCase() === status;

        }
    ).length;

}


// ================================
// CONFIGURE DASHBOARD BY ROLE
// ================================

function configureDashboardForRole() {

    const agentOnlyHiddenElements = [

        "unassignedLeadsCard",

        "agentLeadDistributionSection",

        "agentPerformanceSection",

        "campaignPerformanceSection",

        "leadSourcePerformanceSection"

    ];


    // ==========================================
    // AGENT
    // ==========================================

    if (userRole === "AGENT") {

        agentOnlyHiddenElements.forEach(
            function (elementId) {

                const element =
                    document.getElementById(
                        elementId
                    );

                if (element) {

                    element.style.display =
                        "none";

                }

            }
        );

    }


    // ==========================================
    // ADMIN / MANAGER
    // ==========================================

    else if (
        userRole === "ADMIN" ||
        userRole === "MANAGER"
    ) {

        agentOnlyHiddenElements.forEach(
            function (elementId) {

                const element =
                    document.getElementById(
                        elementId
                    );

                if (element) {

                    element.style.display =
                        "";

                }

            }
        );

    }

}


// ================================
// LOAD DASHBOARD DATA
// ================================

async function loadDashboardData() {

    try {

        let summary = null;

        let leads = [];
        let assignments = [];
        let followUps = [];
        let calls = [];
        let todayFollowUps = [];

        let agentLeadDistribution = [];
        let agentPerformance = [];
        let campaignPerformance = [];
        let leadSourcePerformance = [];


        // ==================================================
        // ADMIN / MANAGER
        // ==================================================

        if (
            userRole === "ADMIN" ||
            userRole === "MANAGER"
        ) {

            const [

                summaryResponse,
                assignmentsResponse,
                followUpsResponse,
                callsResponse,
                todayFollowUpsResponse

            ] = await Promise.all([

                fetch(
                    `${API_BASE_URL}/api/dashboard/summary`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/lead-assignments/status/ACTIVE`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/follow-ups`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/call-logs`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/follow-ups/today`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                )

            ]);


            summary =
                await readJsonResponse(
                    summaryResponse,
                    "Failed to load dashboard summary"
                );


            assignments =
                await readJsonResponse(
                    assignmentsResponse,
                    "Failed to load assignments"
                );


            followUps =
                await readJsonResponse(
                    followUpsResponse,
                    "Failed to load follow-ups"
                );


            calls =
                await readJsonResponse(
                    callsResponse,
                    "Failed to load call logs"
                );


            todayFollowUps =
                await readJsonResponse(
                    todayFollowUpsResponse,
                    "Failed to load today's follow-ups"
                );


            // ==========================================
            // SUMMARY DATA
            // ==========================================

            agentLeadDistribution =
                summary.agentLeadDistribution || [];


            agentPerformance =
                summary.agentPerformance || [];


            campaignPerformance =
                summary.campaignPerformance || [];


            leadSourcePerformance =
                summary.leadSourcePerformance || [];

        }


        // ==================================================
        // AGENT
        // ==================================================

        else if (userRole === "AGENT") {

            const [

                leadsResponse,
                assignmentsResponse,
                followUpsResponse,
                callsResponse,
                todayFollowUpsResponse

            ] = await Promise.all([

                fetch(
                    `${API_BASE_URL}/api/leads`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/agent/leads/${userId}`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/follow-ups`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/call-logs`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                ),

                fetch(
                    `${API_BASE_URL}/api/follow-ups/today`,
                    {
                        method: "GET",
                        headers: getHeaders()
                    }
                )

            ]);


            leads =
                await readJsonResponse(
                    leadsResponse,
                    "Failed to load leads"
                );


            assignments =
                await readJsonResponse(
                    assignmentsResponse,
                    "Failed to load assignments"
                );


            followUps =
                await readJsonResponse(
                    followUpsResponse,
                    "Failed to load follow-ups"
                );


            calls =
                await readJsonResponse(
                    callsResponse,
                    "Failed to load call logs"
                );


            todayFollowUps =
                await readJsonResponse(
                    todayFollowUpsResponse,
                    "Failed to load today's follow-ups"
                );

        }


        // ==================================================
        // INVALID ROLE
        // ==================================================

        else {

            throw new Error(
                "Invalid or missing user role"
            );

        }


        // ==================================================
        // DASHBOARD ELEMENTS
        // ==================================================

        const totalLeadsElement =
            document.getElementById(
                "totalLeads"
            );


        const assignedLeadsElement =
            document.getElementById(
                "assignedLeads"
            );


        const unassignedLeadsElement =
            document.getElementById(
                "unassignedLeads"
            );


        const totalFollowUpsElement =
            document.getElementById(
                "totalFollowUps"
            );


        const todayFollowUpsElement =
            document.getElementById(
                "todayFollowUps"
            );


        const totalCallsElement =
            document.getElementById(
                "totalCalls"
            );


        const pendingFollowUpsElement =
            document.getElementById(
                "pendingFollowUps"
            );


        const completedFollowUpsElement =
            document.getElementById(
                "completedFollowUps"
            );


        const missedFollowUpsElement =
            document.getElementById(
                "missedFollowUps"
            );


        const cancelledFollowUpsElement =
            document.getElementById(
                "cancelledFollowUps"
            );


        // ==================================================
        // TOTAL LEADS
        // ==================================================

        if (totalLeadsElement) {

            totalLeadsElement.textContent =
                summary
                    ? summary.totalLeads
                    : leads.length;

        }


        // ==================================================
        // ASSIGNED LEADS
        // ==================================================

        if (assignedLeadsElement) {

            assignedLeadsElement.textContent =
                summary &&
                summary.assignedLeads !== undefined

                    ? summary.assignedLeads

                    : assignments.length;

        }


        // ==================================================
        // UNASSIGNED LEADS
        // ==================================================

        if (unassignedLeadsElement) {

            if (summary) {

                unassignedLeadsElement.textContent =
                    summary.unassignedLeads || 0;

            } else {

                unassignedLeadsElement.textContent =
                    0;

            }

        }


        // ==================================================
        // TOTAL FOLLOW-UPS
        // ==================================================

        if (totalFollowUpsElement) {

            totalFollowUpsElement.textContent =
                summary
                    ? summary.totalFollowUps
                    : followUps.length;

        }


        // ==================================================
        // TODAY'S FOLLOW-UPS
        // ==================================================

        if (todayFollowUpsElement) {

            todayFollowUpsElement.textContent =
                todayFollowUps.length;

        }


        // ==================================================
        // TOTAL CALLS
        // ==================================================

        if (totalCallsElement) {

            totalCallsElement.textContent =
                calls.length;

        }


        // ==================================================
        // FOLLOW-UP STATUS
        // ==================================================

        let pendingFollowUps = 0;

        let completedFollowUps = 0;

        let missedFollowUps = 0;

        let cancelledFollowUps = 0;


        if (summary) {

            pendingFollowUps =
                summary.pendingFollowUps || 0;

            completedFollowUps =
                summary.completedFollowUps || 0;

            missedFollowUps =
                summary.missedFollowUps || 0;

            cancelledFollowUps =
                summary.cancelledFollowUps || 0;

        } else {

            pendingFollowUps =
                countFollowUpStatus(
                    followUps,
                    "PENDING"
                );


            completedFollowUps =
                countFollowUpStatus(
                    followUps,
                    "COMPLETED"
                );


            missedFollowUps =
                countFollowUpStatus(
                    followUps,
                    "MISSED"
                );


            cancelledFollowUps =
                countFollowUpStatus(
                    followUps,
                    "CANCELLED"
                );

        }


        // ==================================================
        // UPDATE FOLLOW-UP CARDS
        // ==================================================

        if (pendingFollowUpsElement) {

            pendingFollowUpsElement.textContent =
                pendingFollowUps;

        }


        if (completedFollowUpsElement) {

            completedFollowUpsElement.textContent =
                completedFollowUps;

        }


        if (missedFollowUpsElement) {

            missedFollowUpsElement.textContent =
                missedFollowUps;

        }


        if (cancelledFollowUpsElement) {

            cancelledFollowUpsElement.textContent =
                cancelledFollowUps;

        }


        // ==================================================
        // LEAD OVERVIEW
        // ==================================================

        if (summary) {

            createLeadOverviewChartFromSummary(
                summary
            );

        } else {

            createLeadOverviewChart(
                leads
            );

        }


        // ==================================================
        // CRM ACTIVITY
        // ==================================================

        createCRMActivityChart(
            summary,
            leads,
            assignments,
            followUps,
            calls
        );


        // ==================================================
        // AGENT LEAD DISTRIBUTION
        // ==================================================

        if (
            userRole === "ADMIN" ||
            userRole === "MANAGER"
        ) {

            createAgentLeadDistributionChart(
                agentLeadDistribution
            );

        } else {

            destroyAgentLeadDistributionChart();

        }


        // ==================================================
        // AGENT PERFORMANCE
        // ==================================================

        if (
            userRole === "ADMIN" ||
            userRole === "MANAGER"
        ) {

            renderAgentPerformanceTable(
                agentPerformance
            );

        } else {

            clearTable(
                "agentPerformanceTableBody"
            );

        }


        // ==================================================
        // CAMPAIGN PERFORMANCE
        // ==================================================

        if (
            userRole === "ADMIN" ||
            userRole === "MANAGER"
        ) {

            renderCampaignPerformanceTable(
                campaignPerformance
            );

        } else {

            clearTable(
                "campaignPerformanceTableBody"
            );

        }


        // ==================================================
        // LEAD SOURCE PERFORMANCE
        // ==================================================

        if (
            userRole === "ADMIN" ||
            userRole === "MANAGER"
        ) {

            renderLeadSourcePerformanceTable(
                leadSourcePerformance
            );

        } else {

            clearTable(
                "leadSourcePerformanceTableBody"
            );

        }


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ================================
// LEAD OVERVIEW
// ADMIN / MANAGER
// ================================

function createLeadOverviewChartFromSummary(
    summary
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


    const labels = [

        "NEW",
        "CONTACTED",
        "INTERESTED",
        "FOLLOW_UP",
        "COUNSELLING",
        "ENROLLED",
        "NOT_INTERESTED",
        "WRONG_NUMBER",
        "NO_RESPONSE",
        "LOST"

    ];


    const data = [

        summary.newLeads || 0,
        summary.contactedLeads || 0,
        summary.interestedLeads || 0,
        summary.followUpLeads || 0,
        summary.counsellingLeads || 0,
        summary.enrolledLeads || 0,
        summary.notInterestedLeads || 0,
        summary.wrongNumberLeads || 0,
        summary.noResponseLeads || 0,
        summary.lostLeads || 0

    ];


    leadOverviewChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [{

                        data: data,

                        borderWidth: 0,

                        hoverOffset: 10

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                padding: 18,

                                usePointStyle: true,

                                font: {

                                    size: 12

                                }

                            }

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

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

                        animateRotate: true,

                        animateScale: true,

                        duration: 1200

                    }

                }

            }
        );

}


// ================================
// LEAD OVERVIEW
// AGENT
// ================================

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


    const statusCounts = {};


    leads.forEach(function (lead) {

        let status =
            lead.status ||
            lead.leadStatus ||
            "UNSPECIFIED";


        status =
            String(status).toUpperCase();


        if (!statusCounts[status]) {

            statusCounts[status] = 0;

        }


        statusCounts[status]++;

    });


    const labels =
        Object.keys(statusCounts);


    const data =
        Object.values(statusCounts);


    leadOverviewChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [{

                        data: data,

                        borderWidth: 0,

                        hoverOffset: 10

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                padding: 18,

                                usePointStyle: true,

                                font: {

                                    size: 12

                                }

                            }

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            context.raw
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


// ================================
// CRM ACTIVITY CHART
// ================================

function createCRMActivityChart(
    summary,
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


    const totalLeads =
        summary
            ? summary.totalLeads
            : leads.length;


    const totalFollowUps =
        summary
            ? summary.totalFollowUps
            : followUps.length;


    const totalAssignments =
        summary &&
        summary.assignedLeads !== undefined

            ? summary.assignedLeads

            : assignments.length;


    const totalCalls =
        calls.length;


    crmActivityChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [

                        "Leads",
                        "Assigned",
                        "Follow-ups",
                        "Calls"

                    ],

                    datasets: [

                        {

                            label:
                                "Leads",

                            data: [

                                totalLeads,
                                null,
                                null,
                                null

                            ],

                            yAxisID:
                                "y",

                            grouped:
                                false,

                            borderRadius:
                                10,

                            borderSkipped:
                                false,

                            maxBarThickness:
                                60

                        },

                        {

                            label:
                                "Other Activity",

                            data: [

                                null,
                                totalAssignments,
                                totalFollowUps,
                                totalCalls

                            ],

                            yAxisID:
                                "y1",

                            grouped:
                                false,

                            borderRadius:
                                10,

                            borderSkipped:
                                false,

                            maxBarThickness:
                                60

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },

                    plugins: {

                        legend: {

                            display:
                                true,

                            position:
                                "top"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        if (
                                            context.raw === null ||
                                            context.raw === undefined
                                        ) {

                                            return "";

                                        }


                                        return (
                                            " " +
                                            context.dataset.label +
                                            ": " +
                                            context.raw
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            type:
                                "linear",

                            position:
                                "left",

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "Leads"

                            },

                            grid: {

                                display:
                                    true,

                                color:
                                    "rgba(148,163,184,0.15)"

                            }

                        },


                        y1: {

                            type:
                                "linear",

                            position:
                                "right",

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "Activities"

                            },

                            grid: {

                                drawOnChartArea:
                                    false

                            }

                        },


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


// ================================
// AGENT LEAD DISTRIBUTION
// ================================

function createAgentLeadDistributionChart(
    agentLeadDistribution
) {

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


    if (
        !agentLeadDistribution ||
        agentLeadDistribution.length === 0
    ) {

        return;

    }


    const labels =
        agentLeadDistribution.map(
            function (agent) {

                return agent.agentName;

            }
        );


    const data =
        agentLeadDistribution.map(
            function (agent) {

                return agent.activeLeads || 0;

            }
        );


    agentLeadDistributionChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Active Leads",

                            data: data,

                            borderRadius:
                                8,

                            borderSkipped:
                                false,

                            maxBarThickness:
                                45

                        }

                    ]

                },

                options: {

                    indexAxis:
                        "y",

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
                                    function (context) {

                                        return (
                                            " Active Leads: " +
                                            context.raw
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "Active Leads"

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"

                            }

                        },

                        y: {

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


// ================================
// DESTROY AGENT DISTRIBUTION
// ================================

function destroyAgentLeadDistributionChart() {

    if (agentLeadDistributionChart) {

        agentLeadDistributionChart.destroy();

        agentLeadDistributionChart =
            null;

    }

}


// ================================
// CLEAR TABLE
// ================================

function clearTable(tableBodyId) {

    const tableBody =
        document.getElementById(
            tableBodyId
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";

}


// ================================
// AGENT PERFORMANCE TABLE
// ================================

function renderAgentPerformanceTable(
    agentPerformance
) {

    const tableBody =
        document.getElementById(
            "agentPerformanceTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !agentPerformance ||
        agentPerformance.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td
                colspan="4"
                style="
                    text-align:center;
                    padding:20px;
                "
            >
                No agent performance data available.
            </td>
        `;


        tableBody.appendChild(row);

        return;

    }


    agentPerformance.forEach(
        function (agent) {

            const row =
                document.createElement("tr");


            const agentNameCell =
                document.createElement("td");


            agentNameCell.textContent =
                agent.agentName || "Unknown";


            agentNameCell.style.textAlign =
                "left";


            agentNameCell.style.padding =
                "12px";


            const activeLeadsCell =
                document.createElement("td");


            activeLeadsCell.textContent =
                agent.activeLeads || 0;


            activeLeadsCell.style.textAlign =
                "center";


            activeLeadsCell.style.padding =
                "12px";


            const totalCallsCell =
                document.createElement("td");


            totalCallsCell.textContent =
                agent.totalCalls || 0;


            totalCallsCell.style.textAlign =
                "center";


            totalCallsCell.style.padding =
                "12px";


            const enrolledLeadsCell =
                document.createElement("td");


            enrolledLeadsCell.textContent =
                agent.enrolledLeads || 0;


            enrolledLeadsCell.style.textAlign =
                "center";


            enrolledLeadsCell.style.padding =
                "12px";


            row.appendChild(
                agentNameCell
            );


            row.appendChild(
                activeLeadsCell
            );


            row.appendChild(
                totalCallsCell
            );


            row.appendChild(
                enrolledLeadsCell
            );


            tableBody.appendChild(
                row
            );

        }
    );

}


// ================================
// CAMPAIGN PERFORMANCE TABLE
// ================================

function renderCampaignPerformanceTable(
    campaignPerformance
) {

    const tableBody =
        document.getElementById(
            "campaignPerformanceTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !campaignPerformance ||
        campaignPerformance.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td
                colspan="5"
                style="
                    text-align:center;
                    padding:20px;
                "
            >
                No campaign performance data available.
            </td>
        `;


        tableBody.appendChild(row);

        return;

    }


    campaignPerformance.forEach(
        function (campaign) {

            const row =
                document.createElement("tr");


            const campaignNameCell =
                document.createElement("td");


            campaignNameCell.textContent =
                campaign.campaignName ||
                "Unknown";


            campaignNameCell.style.textAlign =
                "left";


            campaignNameCell.style.padding =
                "12px";


            const sourceCell =
                document.createElement("td");


            sourceCell.textContent =
                campaign.source || "-";


            sourceCell.style.textAlign =
                "left";


            sourceCell.style.padding =
                "12px";


            const statusCell =
                document.createElement("td");


            statusCell.textContent =
                campaign.status || "-";


            statusCell.style.textAlign =
                "center";


            statusCell.style.padding =
                "12px";


            const totalLeadsCell =
                document.createElement("td");


            totalLeadsCell.textContent =
                campaign.totalLeads || 0;


            totalLeadsCell.style.textAlign =
                "center";


            totalLeadsCell.style.padding =
                "12px";


            const enrolledLeadsCell =
                document.createElement("td");


            enrolledLeadsCell.textContent =
                campaign.enrolledLeads || 0;


            enrolledLeadsCell.style.textAlign =
                "center";


            enrolledLeadsCell.style.padding =
                "12px";


            row.appendChild(
                campaignNameCell
            );


            row.appendChild(
                sourceCell
            );


            row.appendChild(
                statusCell
            );


            row.appendChild(
                totalLeadsCell
            );


            row.appendChild(
                enrolledLeadsCell
            );


            tableBody.appendChild(
                row
            );

        }
    );

}


// ================================
// LEAD SOURCE PERFORMANCE TABLE
// ================================

function renderLeadSourcePerformanceTable(
    leadSourcePerformance
) {

    const tableBody =
        document.getElementById(
            "leadSourcePerformanceTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !leadSourcePerformance ||
        leadSourcePerformance.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td
                colspan="4"
                style="
                    text-align:center;
                    padding:20px;
                "
            >
                No lead source performance data available.
            </td>
        `;


        tableBody.appendChild(row);

        return;

    }


    leadSourcePerformance.forEach(
        function (sourceData) {

            const row =
                document.createElement("tr");


            const sourceCell =
                document.createElement("td");


            sourceCell.textContent =
                sourceData.source ||
                "Unknown";


            sourceCell.style.textAlign =
                "left";


            sourceCell.style.padding =
                "12px";


            const totalLeadsCell =
                document.createElement("td");


            totalLeadsCell.textContent =
                sourceData.totalLeads || 0;


            totalLeadsCell.style.textAlign =
                "center";


            totalLeadsCell.style.padding =
                "12px";


            const enrolledLeadsCell =
                document.createElement("td");


            enrolledLeadsCell.textContent =
                sourceData.enrolledLeads || 0;


            enrolledLeadsCell.style.textAlign =
                "center";


            enrolledLeadsCell.style.padding =
                "12px";


            const conversionRateCell =
                document.createElement("td");


            const conversionRate =
                Number(
                    sourceData.conversionRate || 0
                );


            conversionRateCell.textContent =
                conversionRate.toFixed(2) +
                "%";


            conversionRateCell.style.textAlign =
                "center";


            conversionRateCell.style.padding =
                "12px";


            row.appendChild(
                sourceCell
            );


            row.appendChild(
                totalLeadsCell
            );


            row.appendChild(
                enrolledLeadsCell
            );


            row.appendChild(
                conversionRateCell
            );


            tableBody.appendChild(
                row
            );

        }
    );

}


// ================================
// START DASHBOARD
// ================================

configureDashboardForRole();

loadDashboardData();


// ================================
// AUTO REFRESH
// ================================

setInterval(
    function () {

        loadDashboardData();

    },
    30000
);