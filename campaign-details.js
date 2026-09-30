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
// Campaign ID
// ==============================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const campaignId =
    urlParams.get("id");


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
// Edit Button
// ==============================

const editCampaignButton =
    document.getElementById(
        "editCampaignButton"
    );

if (editCampaignButton) {

    editCampaignButton.addEventListener(
        "click",
        function () {

            if (!campaignId) {
                return;
            }

            window.location.href =
                `edit-campaign.html?id=${campaignId}`;
        }
    );
}


// ==============================
// Load Campaign
// ==============================

async function loadCampaign() {

    if (!campaignId) {

        showMessage(
            "Campaign ID is missing.",
            true
        );

        return;
    }

    try {

        showMessage(
            "Loading campaign..."
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/campaigns/${campaignId}`,
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
                "Failed to load campaign. Status: " +
                response.status
            );
        }

        const campaign =
            await response.json();


        // ==========================
        // Display Campaign
        // ==========================

        const campaignIdElement =
            document.getElementById(
                "campaignId"
            );

        const campaignNameElement =
            document.getElementById(
                "campaignName"
            );

        const descriptionElement =
            document.getElementById(
                "description"
            );

        const sourceElement =
            document.getElementById(
                "source"
            );

        const courseIdElement =
            document.getElementById(
                "courseId"
            );

        const startDateElement =
            document.getElementById(
                "startDate"
            );

        const endDateElement =
            document.getElementById(
                "endDate"
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


        if (campaignIdElement) {
            campaignIdElement.textContent =
                campaign.id ?? "-";
        }

        if (campaignNameElement) {
            campaignNameElement.textContent =
                campaign.campaignName ?? "-";
        }

        if (descriptionElement) {
            descriptionElement.textContent =
                campaign.description ?? "-";
        }

        if (sourceElement) {
            sourceElement.textContent =
                campaign.source ?? "-";
        }

        if (courseIdElement) {
            courseIdElement.textContent =
                campaign.courseId ?? "-";
        }

        if (startDateElement) {
            startDateElement.textContent =
                campaign.startDate ?? "-";
        }

        if (endDateElement) {
            endDateElement.textContent =
                campaign.endDate ?? "-";
        }

        if (statusElement) {
            statusElement.textContent =
                campaign.status ?? "-";
        }

        if (createdAtElement) {
            createdAtElement.textContent =
                campaign.createdAt ?? "-";
        }

        if (updatedAtElement) {
            updatedAtElement.textContent =
                campaign.updatedAt ?? "-";
        }

        showMessage("");

    } catch (error) {

        console.error(
            "Error loading campaign:",
            error
        );

        showMessage(
            "Unable to load campaign.",
            true
        );
    }
}


// ==============================
// Campaign Analytics
// ==============================

let campaignLeadStatusChart = null;
let campaignCityChart = null;

let campaignCallStatusChart = null;
let campaignCallOutcomeChart = null;


async function loadCampaignAnalytics() {

    if (!campaignId) {
        return;
    }

    try {

        // ==========================
        // Load Campaign Leads
        // ==========================

        const response = await fetch(
            `${API_BASE_URL}/api/leads/campaign/${campaignId}`,
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
                "Failed to load campaign leads. Status: " +
                response.status
            );
        }

        const leads =
            await response.json();


        // ==========================
        // Campaign Call Logs
        // ==========================

        const callResponse = await fetch(
            `${API_BASE_URL}/api/call-logs/campaign/${campaignId}`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (!callResponse.ok) {

            throw new Error(
                "Failed to load campaign call logs. Status: " +
                callResponse.status
            );
        }

        const callLogs =
            await callResponse.json();


        // ==========================
        // Call Analytics Calculations
        // ==========================

        const totalCalls =
            callLogs.length;

        const answeredCalls =
            callLogs.filter(
                call =>
                    call.callStatus === "ANSWERED"
            ).length;

        const notAnsweredCalls =
            callLogs.filter(
                call =>
                    call.callStatus === "NOT_ANSWERED"
            ).length;

        const busyCalls =
            callLogs.filter(
                call =>
                    call.callStatus === "BUSY"
            ).length;

        const failedCalls =
            callLogs.filter(
                call =>
                    call.callStatus === "FAILED"
            ).length;

        const totalCallDuration =
            callLogs.reduce(
                (total, call) =>
                    total +
                    (call.durationSeconds || 0),
                0
            );

        const averageCallDuration =
            totalCalls > 0
                ? Math.round(
                    totalCallDuration /
                    totalCalls
                )
                : 0;


        // ==========================
        // Call Status Data
        // ==========================

        const callStatusCounts = {};

        callLogs.forEach(call => {

            const status =
                call.callStatus ||
                "UNKNOWN";

            callStatusCounts[status] =
                (callStatusCounts[status] || 0) + 1;
        });


        // ==========================
        // Call Outcome Data
        // ==========================

        const callOutcomeCounts = {};

        callLogs.forEach(call => {

            const outcome =
                call.callOutcome ||
                "UNKNOWN";

            callOutcomeCounts[outcome] =
                (callOutcomeCounts[outcome] || 0) + 1;
        });


        // ==========================
        // Lead KPI Calculations
        // ==========================

        const totalLeads =
            leads.length;

        const newLeads =
            leads.filter(
                lead =>
                    lead.status === "NEW"
            ).length;

        const interestedLeads =
            leads.filter(
                lead =>
                    lead.status === "INTERESTED"
            ).length;

        const enrolledLeads =
            leads.filter(
                lead =>
                    lead.status === "ENROLLED"
            ).length;


        // ==========================
        // Display Lead KPI Values
        // ==========================

        const totalElement =
            document.getElementById(
                "analyticsTotalLeads"
            );

        const newElement =
            document.getElementById(
                "analyticsNewLeads"
            );

        const interestedElement =
            document.getElementById(
                "analyticsInterestedLeads"
            );

        const enrolledElement =
            document.getElementById(
                "analyticsEnrolledLeads"
            );


        if (totalElement) {
            totalElement.textContent =
                totalLeads;
        }

        if (newElement) {
            newElement.textContent =
                newLeads;
        }

        if (interestedElement) {
            interestedElement.textContent =
                interestedLeads;
        }

        if (enrolledElement) {
            enrolledElement.textContent =
                enrolledLeads;
        }


        // ==========================
        // Display Call KPI Values
        // ==========================

        const totalCallsElement =
            document.getElementById(
                "analyticsTotalCalls"
            );

        const answeredCallsElement =
            document.getElementById(
                "analyticsAnsweredCalls"
            );

        const notAnsweredCallsElement =
            document.getElementById(
                "analyticsNotAnsweredCalls"
            );

        const averageCallDurationElement =
            document.getElementById(
                "analyticsAverageCallDuration"
            );


        if (totalCallsElement) {
            totalCallsElement.textContent =
                totalCalls;
        }

        if (answeredCallsElement) {
            answeredCallsElement.textContent =
                answeredCalls;
        }

        if (notAnsweredCallsElement) {
            notAnsweredCallsElement.textContent =
                notAnsweredCalls;
        }

        if (averageCallDurationElement) {
            averageCallDurationElement.textContent =
                averageCallDuration + " sec";
        }


        // ==========================
        // Lead Status Data
        // ==========================

        const statusCounts = {};

        leads.forEach(lead => {

            const status =
                lead.status ||
                "UNKNOWN";

            statusCounts[status] =
                (statusCounts[status] || 0) + 1;
        });


        // ==========================
        // City Data
        // ==========================

        const cityCounts = {};

        leads.forEach(lead => {

            const city =
                lead.city &&
                lead.city.trim()
                    ? lead.city.trim()
                    : "Unknown";

            cityCounts[city] =
                (cityCounts[city] || 0) + 1;
        });


        // ==========================
        // Lead Status Chart
        // ==========================

        const statusCanvas =
            document.getElementById(
                "campaignLeadStatusChart"
            );

        if (statusCanvas) {

            if (campaignLeadStatusChart) {
                campaignLeadStatusChart.destroy();
            }

            if (
                Object.keys(statusCounts).length > 0
            ) {

                campaignLeadStatusChart =
                    new Chart(
                        statusCanvas,
                        {
                            type: "doughnut",

                            data: {
                                labels:
                                    Object.keys(
                                        statusCounts
                                    ),

                                datasets: [{
                                    data:
                                        Object.values(
                                            statusCounts
                                        )
                                }]
                            },

                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "bottom"
                                    }
                                }
                            }
                        }
                    );
            }
        }


        // ==========================
        // City Chart
        // ==========================

        const cityCanvas =
            document.getElementById(
                "campaignCityChart"
            );

        if (cityCanvas) {

            if (campaignCityChart) {
                campaignCityChart.destroy();
            }

            if (
                Object.keys(cityCounts).length > 0
            ) {

                campaignCityChart =
                    new Chart(
                        cityCanvas,
                        {
                            type: "bar",

                            data: {
                                labels:
                                    Object.keys(
                                        cityCounts
                                    ),

                                datasets: [{
                                    label: "Leads",

                                    data:
                                        Object.values(
                                            cityCounts
                                        )
                                }]
                            },

                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                scales: {
                                    y: {
                                        beginAtZero: true,

                                        ticks: {
                                            precision: 0
                                        }
                                    }
                                },

                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        }
                    );
            }
        }


        // ==========================
        // Call Status Chart
        // ==========================

        const callStatusCanvas =
            document.getElementById(
                "campaignCallStatusChart"
            );

        const callStatusEmpty =
            document.getElementById(
                "campaignCallStatusEmpty"
            );

        if (
            Object.keys(callStatusCounts).length === 0
        ) {

            if (callStatusCanvas) {
                callStatusCanvas.style.display =
                    "none";
            }

            if (callStatusEmpty) {
                callStatusEmpty.style.display =
                    "flex";
            }

        } else {

            if (callStatusCanvas) {
                callStatusCanvas.style.display =
                    "block";
            }

            if (callStatusEmpty) {
                callStatusEmpty.style.display =
                    "none";
            }

            if (callStatusCanvas) {

                if (campaignCallStatusChart) {
                    campaignCallStatusChart.destroy();
                }

                campaignCallStatusChart =
                    new Chart(
                        callStatusCanvas,
                        {
                            type: "doughnut",

                            data: {
                                labels:
                                    Object.keys(
                                        callStatusCounts
                                    ),

                                datasets: [{
                                    data:
                                        Object.values(
                                            callStatusCounts
                                        )
                                }]
                            },

                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "bottom"
                                    }
                                }
                            }
                        }
                    );
            }
        }


        // ==========================
        // Call Outcome Chart
        // ==========================

        const callOutcomeCanvas =
            document.getElementById(
                "campaignCallOutcomeChart"
            );

        const callOutcomeEmpty =
            document.getElementById(
                "campaignCallOutcomeEmpty"
            );

        if (
            Object.keys(callOutcomeCounts).length === 0
        ) {

            if (callOutcomeCanvas) {
                callOutcomeCanvas.style.display =
                    "none";
            }

            if (callOutcomeEmpty) {
                callOutcomeEmpty.style.display =
                    "flex";
            }

        } else {

            if (callOutcomeCanvas) {
                callOutcomeCanvas.style.display =
                    "block";
            }

            if (callOutcomeEmpty) {
                callOutcomeEmpty.style.display =
                    "none";
            }

            if (callOutcomeCanvas) {

                if (campaignCallOutcomeChart) {
                    campaignCallOutcomeChart.destroy();
                }

                campaignCallOutcomeChart =
                    new Chart(
                        callOutcomeCanvas,
                        {
                            type: "doughnut",

                            data: {
                                labels:
                                    Object.keys(
                                        callOutcomeCounts
                                    ),

                                datasets: [{
                                    data:
                                        Object.values(
                                            callOutcomeCounts
                                        )
                                }]
                            },

                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                plugins: {
                                    legend: {
                                        position: "bottom"
                                    }
                                }
                            }
                        }
                    );
            }
        }

    } catch (error) {

        console.error(
            "Error loading campaign analytics:",
            error
        );
    }
}


// ==============================
// Initial Load
// ==============================

loadCampaign();
loadCampaignAnalytics();