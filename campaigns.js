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


let allCampaigns = [];


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


async function loadCampaigns() {

    try {

        showMessage(
            "Loading campaigns..."
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/campaigns`,
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
                "Failed to load campaigns. Status: " +
                response.status
            );
        }


        const campaigns =
            await response.json();


        allCampaigns =
            campaigns;


        displayCampaigns(
            allCampaigns
        );


        showMessage("");


    } catch (error) {

        console.error(
            "Error loading campaigns:",
            error
        );

        showMessage(
            "Unable to load campaigns.",
            true
        );
    }
}


function displayCampaigns(
    campaigns
) {

    const tableBody =
        document.getElementById(
            "campaignsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !campaigns ||
        campaigns.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    style="text-align:center;">
                    No campaigns found.
                </td>
            </tr>
        `;

        return;
    }


    campaigns.forEach(
        function (campaign) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${campaign.id ?? ""}
                </td>

                <td>
                    ${campaign.campaignName ?? ""}
                </td>

                <td>
                    ${campaign.description ?? ""}
                </td>

                <td>
                    ${campaign.source ?? ""}
                </td>

                <td>
                    ${campaign.courseId ?? ""}
                </td>

                <td>
                    ${campaign.startDate ?? ""}
                </td>

                <td>
                    ${campaign.endDate ?? ""}
                </td>

                <td>
                    ${campaign.status ?? ""}
                </td>

                <td>
                    ${campaign.createdAt ?? ""}
                </td>

                <td style="
    position: sticky;
    right: 0;
    background: #ffffff;
    z-index: 2;
    white-space: nowrap;
    min-width: 210px;
    text-align: center;
">

    <button
        type="button"
        onclick="viewCampaign(${campaign.id})">
        View
    </button>

    <button
        type="button"
        onclick="editCampaign(${campaign.id})">
        Edit
    </button>

    <button
        type="button"
        onclick="deleteCampaign(${campaign.id})">
        Delete
    </button>

</td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );
}


function viewCampaign(id) {

    window.location.href =
        `campaign-details.html?id=${id}`;
}


function editCampaign(id) {

    window.location.href =
        `edit-campaign.html?id=${id}`;
}


async function deleteCampaign(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this campaign?"
        );


    if (!confirmed) {
        return;
    }


    try {

        showMessage(
            "Deleting campaign..."
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/campaigns/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            let result = null;

            try {
                result =
                    await response.json();
            } catch (jsonError) {
                result = null;
            }


            throw new Error(
                result?.message ||
                "Unable to delete campaign."
            );
        }


        showMessage(
            "Campaign deleted successfully."
        );


        loadCampaigns();


    } catch (error) {

        console.error(
            "Error deleting campaign:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete campaign.",
            true
        );
    }
}


const searchCampaign =
    document.getElementById(
        "searchCampaign"
    );


if (searchCampaign) {

    searchCampaign.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                displayCampaigns(
                    allCampaigns
                );

                return;
            }


            const filteredCampaigns =
                allCampaigns.filter(
                    function (campaign) {

                        return (

                            String(
                                campaign.id ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                            ||

                            String(
                                campaign.campaignName ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                            ||

                            String(
                                campaign.description ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                            ||

                            String(
                                campaign.source ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                            ||

                            String(
                                campaign.courseId ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                            ||

                            String(
                                campaign.status ?? ""
                            )
                            .toLowerCase()
                            .includes(searchText)

                        );

                    }
                );


            displayCampaigns(
                filteredCampaigns
            );

        }
    );
}


const refreshCampaignsButton =
    document.getElementById(
        "refreshCampaigns"
    );


if (refreshCampaignsButton) {

    refreshCampaignsButton.addEventListener(
        "click",
        function () {

            loadCampaigns();

        }
    );
}


loadCampaigns();