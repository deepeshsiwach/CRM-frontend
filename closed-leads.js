// ============================================================
// DERIVION CRM - CLOSED / DISPOSED LEADS
// ============================================================

const token =
    localStorage.getItem("jwtToken");

const userName =
    localStorage.getItem("userName");

const userRole =
    (
        localStorage.getItem("userRole") || ""
    )
    .trim()
    .toUpperCase();

const currentUserId =
    Number(
        localStorage.getItem("userId")
    );


// ============================================================
// LOGIN CHECK
// ============================================================

if (!token) {

    window.location.href =
        "index.html";

}


// ============================================================
// ROLE CHECK
// ADMIN + MANAGER + AGENT ARE ALLOWED
// ============================================================

if (
    userRole !== "ADMIN" &&
    userRole !== "MANAGER" &&
    userRole !== "AGENT"
) {

    window.location.href =
        "dashboard.html";

}


// ============================================================
// DISPLAY USER NAME
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

            [
                "jwtToken",
                "userId",
                "userName",
                "userEmail",
                "userRole"
            ].forEach(
                function (key) {

                    localStorage.removeItem(
                        key
                    );

                }
            );

            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// GLOBAL DATA
// ============================================================

let allClosedLeads = [];

let assignments = [];

let users = [];

let outcomeChart = null;

let successChart = null;


const headers = {

    "Authorization":
        "Bearer " + token

};


// ============================================================
// LOAD CLOSED LEADS
// ============================================================

async function loadClosedLeads() {

    try {

        const [
            leadsResponse,
            assignmentsResponse,
            usersResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/api/leads`,
                {
                    headers
                }
            ),

            fetch(
                `${API_BASE_URL}/api/lead-assignments`,
                {
                    headers
                }
            ),

            fetch(
                `${API_BASE_URL}/api/users`,
                {
                    headers
                }
            )

        ]);


        if (
            !leadsResponse.ok ||
            !assignmentsResponse.ok ||
            !usersResponse.ok
        ) {

            throw new Error(
                "Failed to load closed lead data"
            );

        }


        const leads =
            await leadsResponse.json();

        assignments =
            await assignmentsResponse.json();

        users =
            await usersResponse.json();


        // ====================================================
        // FINAL / CLOSED STATUSES
        // ====================================================

        const finalStatuses = [

            "ENROLLED",

            "NOT_INTERESTED",

            "LOST",

            "WRONG_NUMBER"

        ];


        let closedLeads =
            leads.filter(
                function (lead) {

                    return finalStatuses.includes(
                        String(
                            lead.status || ""
                        ).toUpperCase()
                    );

                }
            );


        // ====================================================
        // AGENT FILTER
        //
        // ADMIN:
        //     All closed leads
        //
        // MANAGER:
        //     All closed leads
        //
        // AGENT:
        //     Only ACTIVE assigned closed leads
        // ====================================================

        if (
            userRole === "AGENT"
        ) {

            closedLeads =
                closedLeads.filter(
                    function (lead) {

                        return assignments.some(
                            function (assignment) {

                                return (

                                    Number(
                                        assignment.leadId
                                    ) ===
                                    Number(
                                        lead.id
                                    )

                                    &&

                                    Number(
                                        assignment.agentId
                                    ) ===
                                    currentUserId

                                    &&

                                    String(
                                        assignment.status || ""
                                    ).toUpperCase()
                                    ===
                                    "ACTIVE"

                                );

                            }
                        );

                    }
                );

        }


        // ====================================================
        // SAVE DATA
        // ====================================================

        allClosedLeads =
            closedLeads;


        // ====================================================
        // UPDATE PAGE
        // ====================================================

        populateAgentFilter();

        updateSummary();

        renderTable();


    } catch (error) {

        console.error(
            "Closed leads error:",
            error
        );


        const tableBody =
            document.getElementById(
                "closedLeadsTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="closed-empty"
                    >
                        Failed to load closed leads.
                    </td>

                </tr>

            `;

        }

    }

}


// ============================================================
// GET AGENT NAME
// ============================================================

function getAgentName(
    leadId
) {

    const leadAssignments =
        assignments.filter(
            function (assignment) {

                return (
                    Number(
                        assignment.leadId
                    ) ===
                    Number(
                        leadId
                    )
                );

            }
        );


    if (
        !leadAssignments.length
    ) {

        return "Unassigned";

    }


    // Prefer ACTIVE assignment

    const activeAssignment =
        leadAssignments.find(
            function (assignment) {

                return String(
                    assignment.status || ""
                )
                .toUpperCase()
                ===
                "ACTIVE";

            }
        );


    const latest =
        activeAssignment ||
        leadAssignments[
            leadAssignments.length - 1
        ];


    const user =
        users.find(
            function (u) {

                return (
                    Number(u.id) ===
                    Number(
                        latest.agentId
                    )
                );

            }
        );


    return user
        ? user.fullName
        : `Agent ${latest.agentId}`;

}


// ============================================================
// POPULATE AGENT FILTER
// ============================================================

function populateAgentFilter() {

    const select =
        document.getElementById(
            "closedAgentFilter"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">All Agents</option>';


    const agentIds = [

        ...new Set(

            allClosedLeads.flatMap(
                function (lead) {

                    return assignments

                        .filter(
                            function (assignment) {

                                return (

                                    Number(
                                        assignment.leadId
                                    ) ===
                                    Number(
                                        lead.id
                                    )

                                    &&

                                    assignment.agentId != null

                                );

                            }
                        )

                        .map(
                            function (assignment) {

                                return Number(
                                    assignment.agentId
                                );

                            }
                        );

                }
            )

        )

    ];


    agentIds.sort(
        function (a, b) {

            return a - b;

        }
    );


    agentIds.forEach(
        function (id) {

            const user =
                users.find(
                    function (u) {

                        return (
                            Number(u.id) ===
                            Number(id)
                        );

                    }
                );


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                id;


            option.textContent =
                user
                    ? user.fullName
                    : `Agent ${id}`;


            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// UPDATE SUMMARY
// ============================================================

function updateSummary() {

    const counts = {

        ENROLLED: 0,

        NOT_INTERESTED: 0,

        LOST: 0,

        WRONG_NUMBER: 0

    };


    allClosedLeads.forEach(
        function (lead) {

            const status =
                String(
                    lead.status || ""
                ).toUpperCase();


            if (
                counts[status] !== undefined
            ) {

                counts[status]++;

            }

        }
    );


    const total =
        Object.values(
            counts
        )
        .reduce(
            function (a, b) {

                return a + b;

            },
            0
        );


    const rate =
        total
            ? (
                (
                    counts.ENROLLED /
                    total
                ) * 100
            ).toFixed(1)
            : "0.0";


    const totalClosed =
        document.getElementById(
            "totalClosed"
        );


    const totalEnrolled =
        document.getElementById(
            "totalEnrolled"
        );


    const totalNotInterested =
        document.getElementById(
            "totalNotInterested"
        );


    const totalLost =
        document.getElementById(
            "totalLost"
        );


    const totalWrongNumber =
        document.getElementById(
            "totalWrongNumber"
        );


    const successRate =
        document.getElementById(
            "successRate"
        );


    if (totalClosed) {

        totalClosed.textContent =
            total;

    }


    if (totalEnrolled) {

        totalEnrolled.textContent =
            counts.ENROLLED;

    }


    if (totalNotInterested) {

        totalNotInterested.textContent =
            counts.NOT_INTERESTED;

    }


    if (totalLost) {

        totalLost.textContent =
            counts.LOST;

    }


    if (totalWrongNumber) {

        totalWrongNumber.textContent =
            counts.WRONG_NUMBER;

    }


    if (successRate) {

        successRate.textContent =
            rate + "%";

    }


    createOutcomeChart(
        counts
    );

    createSuccessChart(
        counts
    );

}


// ============================================================
// OUTCOME CHART
// ============================================================

function createOutcomeChart(
    counts
) {

    const canvas =
        document.getElementById(
            "outcomeChart"
        );


    if (!canvas) {
        return;
    }


    if (outcomeChart) {

        outcomeChart.destroy();

    }


    outcomeChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "ENROLLED",

                        "NOT_INTERESTED",

                        "LOST",

                        "WRONG_NUMBER"

                    ],

                    datasets: [

                        {

                            data: [

                                counts.ENROLLED,

                                counts.NOT_INTERESTED,

                                counts.LOST,

                                counts.WRONG_NUMBER

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "65%",

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


// ============================================================
// SUCCESS CHART
// ============================================================

function createSuccessChart(
    counts
) {

    const canvas =
        document.getElementById(
            "successChart"
        );


    if (!canvas) {
        return;
    }


    if (successChart) {

        successChart.destroy();

    }


    const unsuccessful =
        counts.NOT_INTERESTED +
        counts.LOST +
        counts.WRONG_NUMBER;


    successChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [

                        "Successful",

                        "Closed / Not Converted"

                    ],

                    datasets: [

                        {

                            label: "Leads",

                            data: [

                                counts.ENROLLED,

                                unsuccessful

                            ],

                            borderRadius: 8,

                            maxBarThickness: 70

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }

        );

}


// ============================================================
// FILTERED LEADS
// ============================================================

function filtered() {

    const searchInput =
        document.getElementById(
            "closedSearch"
        );


    const statusInput =
        document.getElementById(
            "closedStatusFilter"
        );


    const agentInput =
        document.getElementById(
            "closedAgentFilter"
        );


    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        statusInput
            ? statusInput.value
            : "";


    const agent =
        agentInput
            ? agentInput.value
            : "";


    return allClosedLeads.filter(
        function (lead) {

            const text = `

                ${lead.id}

                ${lead.fullName || ""}

                ${lead.phone || ""}

                ${lead.email || ""}

                ${lead.courseInterested || ""}

                ${lead.city || ""}

            `
            .toLowerCase();


            const matchesAgent =
                !agent ||

                assignments.some(
                    function (assignment) {

                        return (

                            Number(
                                assignment.leadId
                            ) ===
                            Number(
                                lead.id
                            )

                            &&

                            Number(
                                assignment.agentId
                            ) ===
                            Number(
                                agent
                            )

                        );

                    }
                );


            const matchesSearch =
                !query ||
                text.includes(
                    query
                );


            const matchesStatus =
                !status ||

                String(
                    lead.status || ""
                )
                .toUpperCase()
                ===
                status;


            return (

                matchesSearch &&

                matchesStatus &&

                matchesAgent

            );

        }
    );

}


// ============================================================
// RENDER TABLE
// ============================================================

function renderTable() {

    const tableBody =
        document.getElementById(
            "closedLeadsTableBody"
        );


    if (!tableBody) {
        return;
    }


    const rows =
        filtered();


    tableBody.innerHTML =
        "";


    if (!rows.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="closed-empty"
                >
                    No closed/disposed leads found.
                </td>

            </tr>

        `;


        return;

    }


    rows.forEach(
        function (lead) {

            const status =
                String(
                    lead.status || ""
                )
                .toUpperCase();


            const statusClass =
                "status-" +
                status
                    .toLowerCase()
                    .replaceAll(
                        "_",
                        "-"
                    );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${lead.id}
                </td>


                <td>
                    <strong>
                        ${esc(
                            lead.fullName ||
                            "-"
                        )}
                    </strong>
                </td>


                <td>
                    ${esc(
                        lead.phone ||
                        "-"
                    )}
                </td>


                <td>
                    ${esc(
                        lead.courseInterested ||
                        "-"
                    )}
                </td>


                <td>
                    ${esc(
                        getAgentName(
                            lead.id
                        )
                    )}
                </td>


                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${status}
                    </span>

                </td>


                <td>
                    ${date(
                        lead.updatedAt ||
                        lead.createdAt
                    )}
                </td>


                <td>

                    <button
                        type="button"
                        onclick="viewLead(${lead.id})"
                    >
                        View
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ============================================================
// VIEW LEAD
// ============================================================

function viewLead(
    id
) {

    window.location.href =
        `lead-details.html?id=${id}`;

}


// ============================================================
// DATE FORMAT
// ============================================================

function date(
    value
) {

    if (!value) {

        return "-";

    }


    const d =
        new Date(
            value
        );


    if (
        Number.isNaN(
            d.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return d.toLocaleString(
        "en-IN"
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function esc(
    value
) {

    return String(
        value
    )

    .replaceAll(
        "&",
        "&amp;"
    )

    .replaceAll(
        "<",
        "&lt;"
    )

    .replaceAll(
        ">",
        "&gt;"
    )

    .replaceAll(
        '"',
        "&quot;"
    )

    .replaceAll(
        "'",
        "&#039;"
    );

}


// ============================================================
// SEARCH
// ============================================================

const closedSearch =
    document.getElementById(
        "closedSearch"
    );


if (closedSearch) {

    closedSearch.addEventListener(
        "input",
        renderTable
    );

}


// ============================================================
// STATUS FILTER
// ============================================================

const closedStatusFilter =
    document.getElementById(
        "closedStatusFilter"
    );


if (closedStatusFilter) {

    closedStatusFilter.addEventListener(
        "change",
        renderTable
    );

}


// ============================================================
// AGENT FILTER
// ============================================================

const closedAgentFilter =
    document.getElementById(
        "closedAgentFilter"
    );


if (closedAgentFilter) {

    closedAgentFilter.addEventListener(
        "change",
        renderTable
    );

}


// ============================================================
// CLEAR FILTERS
// ============================================================

const clearClosedFilters =
    document.getElementById(
        "clearClosedFilters"
    );


if (clearClosedFilters) {

    clearClosedFilters.addEventListener(
        "click",
        function () {

            if (closedSearch) {

                closedSearch.value =
                    "";

            }


            if (closedStatusFilter) {

                closedStatusFilter.value =
                    "";

            }


            if (closedAgentFilter) {

                closedAgentFilter.value =
                    "";

            }


            renderTable();

        }
    );

}


// ============================================================
// REFRESH
// ============================================================

const refreshClosedLeads =
    document.getElementById(
        "refreshClosedLeads"
    );


if (refreshClosedLeads) {

    refreshClosedLeads.addEventListener(
        "click",
        loadClosedLeads
    );

}


// ============================================================
// START
// ============================================================

loadClosedLeads();