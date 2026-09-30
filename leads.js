const token = localStorage.getItem("jwtToken");

let allLeads = [];


// ==================================================
// PAGINATION
// ==================================================

let currentPage = 1;
let pageSize = 25;

let currentViewLeads = [];


// ==================================================
// EXCEL IMPORT STORAGE
// ==================================================

window.excelImportRows = [];
window.excelColumnMapping = {};
window.validExcelRows = [];
window.invalidExcelRows = [];
window.excelHasHeader = false;


// ==================================================
// GET PAGINATED LEADS
// ==================================================

function getPaginatedLeads(leads) {

    const totalLeads = leads.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(totalLeads / pageSize)
        );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex =
        (currentPage - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    const paginatedLeads =
        leads.slice(
            startIndex,
            endIndex
        );

    updatePagination(
        totalLeads,
        startIndex,
        paginatedLeads.length,
        totalPages
    );

    return paginatedLeads;
}


// ==================================================
// UPDATE PAGINATION
// ==================================================

function updatePagination(
    totalLeads,
    startIndex,
    visibleCount,
    totalPages
) {

    const startElement =
        document.getElementById(
            "paginationStart"
        );

    const endElement =
        document.getElementById(
            "paginationEnd"
        );

    const totalElement =
        document.getElementById(
            "paginationTotal"
        );

    const pageElement =
        document.getElementById(
            "paginationPage"
        );

    const previousButton =
        document.getElementById(
            "previousPage"
        );

    const nextButton =
        document.getElementById(
            "nextPage"
        );


    if (startElement) {

        startElement.textContent =
            totalLeads === 0
                ? 0
                : startIndex + 1;

    }


    if (endElement) {

        endElement.textContent =
            startIndex + visibleCount;

    }


    if (totalElement) {

        totalElement.textContent =
            totalLeads;

    }


    if (pageElement) {

        pageElement.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }


    if (previousButton) {

        previousButton.disabled =
            currentPage <= 1;

    }


    if (nextButton) {

        nextButton.disabled =
            currentPage >= totalPages;

    }

}


// ==================================================
// SORTING
// ==================================================

let currentSortField = "";
let currentSortDirection = "asc";


function sortLeads(field) {

    if (currentSortField === field) {

        currentSortDirection =
            currentSortDirection === "asc"
                ? "desc"
                : "asc";

    } else {

        currentSortField = field;

        currentSortDirection = "asc";

    }


    const sortedLeads =
        [...allLeads].sort(
            function (a, b) {

                let valueA = a[field];

                let valueB = b[field];


                // ID

                if (field === "id") {

                    valueA =
                        Number(valueA);

                    valueB =
                        Number(valueB);

                }


                // PRIORITY

                if (field === "priority") {

                    const priorityOrder = {

                        HIGH: 1,
                        MEDIUM: 2,
                        LOW: 3

                    };


                    valueA =
                        priorityOrder[valueA] ||
                        999;


                    valueB =
                        priorityOrder[valueB] ||
                        999;

                }


                // TEXT

                if (
                    field === "status" ||
                    field === "fullName"
                ) {

                    valueA =
                        String(
                            valueA || ""
                        )
                            .toLowerCase();


                    valueB =
                        String(
                            valueB || ""
                        )
                            .toLowerCase();

                }


                if (valueA < valueB) {

                    return currentSortDirection === "asc"
                        ? -1
                        : 1;

                }


                if (valueA > valueB) {

                    return currentSortDirection === "asc"
                        ? 1
                        : -1;

                }


                return 0;

            }
        );


    renderLeads(
        sortedLeads
    );

}


// ==================================================
// SORTABLE HEADERS
// ==================================================

document.querySelectorAll(".sortable")
    .forEach(
        function (header) {

            header.addEventListener(
                "click",
                function () {

                    const field =
                        this.dataset.sort;

                    sortLeads(
                        field
                    );

                }
            );

        }
    );


// ==================================================
// LOGIN CHECK
// ==================================================

if (!token) {

    window.location.href =
        "index.html";

}


// ==================================================
// SHOW LOGGED-IN USER
// ==================================================

const userName =
    localStorage.getItem(
        "userName"
    );


if (userName) {

    const userNameElement =
        document.getElementById(
            "userName"
        );


    if (userNameElement) {

        userNameElement.textContent =
            userName;

    }

}


// ==================================================
// LOGOUT
// ==================================================

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


// ==================================================
// RENDER LEADS
// ==================================================

function renderLeads(leads) {

    currentViewLeads =
        leads;


    const tableBody =
        document.getElementById(
            "leadsTableBody"
        );


    if (!tableBody) {

        console.error(
            "leadsTableBody not found"
        );

        return;

    }


    tableBody.innerHTML =
        "";


    const paginatedLeads =
        getPaginatedLeads(
            leads
        );


    if (
        paginatedLeads.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="
                        text-align: center;
                        padding: 30px;
                    "
                >

                    <strong>
                        No leads found
                    </strong>

                    <br>

                    <span>
                        Try changing your search or filters.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    paginatedLeads.forEach(
        function (lead) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${lead.id ?? ""}
                </td>

                <td>
                    ${lead.fullName ?? ""}
                </td>

                <td>
                    ${lead.email ?? ""}
                </td>

                <td>
                    ${lead.phone ?? ""}
                </td>

                <td>
                    ${lead.courseInterested ?? ""}
                </td>

                <td>
                    ${lead.leadSource ?? ""}
                </td>

                <td>

                    <span
                        class="lead-status-badge status-${(
                            lead.status || ""
                        )
                            .toLowerCase()
                            .replace(
                                /_/g,
                                "-"
                            )}"
                    >

                        ${lead.status || ""}

                    </span>

                </td>

                <td>

                    <span
                        class="lead-priority-badge priority-${(
                            lead.priority || ""
                        ).toLowerCase()}"
                    >

                        ${lead.priority || ""}

                    </span>

                </td>

                <td>
                    ${lead.city ?? ""}
                </td>

                <td class="lead-actions">

                    <button
                        type="button"
                        class="action-view"
                        title="View Lead"
                        onclick="viewLead(${lead.id})"
                    >
                        👁
                    </button>

                    <button
                        type="button"
                        class="action-edit"
                        title="Edit Lead"
                        onclick="editLead(${lead.id})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        class="action-assign"
                        title="Assign Lead"
                        onclick="assignLead(${lead.id})"
                    >
                        👤
                    </button>

                    <button
                        type="button"
                        class="action-delete"
                        title="Delete Lead"
                        onclick="deleteLead(${lead.id})"
                    >
                        🗑
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ==================================================
// POPULATE COURSE FILTER
// ==================================================

function populateCourseFilter() {

    const courseFilter =
        document.getElementById(
            "filterCourse"
        );


    if (!courseFilter) {
        return;
    }


    const courses = [
        ...new Set(

            allLeads
                .map(
                    function (lead) {

                        return lead.courseInterested;

                    }
                )
                .filter(
                    function (course) {

                        return (
                            course &&
                            course.trim() !== ""
                        );

                    }
                )

        )
    ].sort();


    courseFilter.innerHTML =
        '<option value="">All Courses</option>';


    courses.forEach(
        function (course) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                course;


            option.textContent =
                course;


            courseFilter.appendChild(
                option
            );

        }
    );

}


// ==================================================
// APPLY LEAD FILTERS
// ==================================================

function applyLeadFilters() {

    const searchElement =
        document.getElementById(
            "searchLead"
        );


    const statusElement =
        document.getElementById(
            "filterStatus"
        );


    const priorityElement =
        document.getElementById(
            "filterPriority"
        );


    const sourceElement =
        document.getElementById(
            "filterSource"
        );


    const courseElement =
        document.getElementById(
            "filterCourse"
        );


    const searchText =
        searchElement
            ? searchElement.value
                .toLowerCase()
                .trim()
            : "";


    const statusFilter =
        statusElement
            ? statusElement.value
            : "";


    const priorityFilter =
        priorityElement
            ? priorityElement.value
            : "";


    const sourceFilter =
        sourceElement
            ? sourceElement.value
            : "";


    const courseFilter =
        courseElement
            ? courseElement.value
            : "";


    const filteredLeads =
        allLeads.filter(
            function (lead) {

                const matchesSearch =

                    String(
                        lead.id
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.fullName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.phone ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.courseInterested ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.leadSource ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.status ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.priority ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    (
                        lead.city ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesStatus =
                    !statusFilter ||
                    lead.status ===
                    statusFilter;


                const matchesPriority =
                    !priorityFilter ||
                    lead.priority ===
                    priorityFilter;


                const matchesSource =
                    !sourceFilter ||
                    lead.leadSource ===
                    sourceFilter;


                const matchesCourse =
                    !courseFilter ||
                    lead.courseInterested ===
                    courseFilter;


                return (

                    matchesSearch &&

                    matchesStatus &&

                    matchesPriority &&

                    matchesSource &&

                    matchesCourse

                );

            }
        );


    currentPage =
        1;


    renderLeads(
        filteredLeads
    );

}


// ==================================================
// LOAD LEADS
// ==================================================

async function loadLeads() {

    try {

        const userRole =
            localStorage.getItem(
                "userRole"
            );


        const userId =
            localStorage.getItem(
                "userId"
            );


        // ==========================================
        // AGENT
        // ==========================================

        if (
            userRole === "AGENT"
        ) {

            if (!userId) {

                throw new Error(
                    "Agent user ID is missing"
                );

            }


            const assignmentResponse =
                await fetch(
                    `${API_BASE_URL}/api/agent/leads/${userId}`,
                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                token

                        }

                    }
                );


            if (
                !assignmentResponse.ok
            ) {

                throw new Error(
                    "Failed to load assigned leads"
                );

            }


            const assignments =
                await assignmentResponse.json();


            if (
                !assignments.length
            ) {

                allLeads =
                    [];

                populateCourseFilter();

                currentPage =
                    1;

                renderLeads(
                    allLeads
                );

                return;

            }


            const leadRequests =
                assignments.map(
                    function (assignment) {

                        return fetch(
                            `${API_BASE_URL}/api/leads/${assignment.leadId}`,
                            {

                                method: "GET",

                                headers: {

                                    "Authorization":
                                        "Bearer " +
                                        token

                                }

                            }
                        )
                        .then(
                            function (response) {

                                if (
                                    !response.ok
                                ) {

                                    throw new Error(
                                        "Failed to load lead " +
                                        assignment.leadId
                                    );

                                }


                                return response.json();

                            }
                        );

                    }
                );


            const leads =
                await Promise.all(
                    leadRequests
                );


            allLeads =
                leads;

        }


        // ==========================================
        // ADMIN / MANAGER
        // ==========================================

        else {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/leads`,
                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                "Bearer " +
                                token

                        }

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Failed to load leads"
                );

            }


            const leads =
                await response.json();


            allLeads =
                leads;

        }


        populateCourseFilter();

        currentPage =
            1;

        renderLeads(
            allLeads
        );


    } catch (error) {

        console.error(
            "Error loading leads:",
            error
        );

    }

}


// ==================================================
// LOAD LEADS WHEN PAGE OPENS
// ==================================================

loadLeads();


// ==================================================
// SEARCH
// ==================================================

const searchLead =
    document.getElementById(
        "searchLead"
    );


if (searchLead) {

    searchLead.addEventListener(
        "input",
        applyLeadFilters
    );

}


// ==================================================
// STATUS FILTER
// ==================================================

const filterStatus =
    document.getElementById(
        "filterStatus"
    );


if (filterStatus) {

    filterStatus.addEventListener(
        "change",
        applyLeadFilters
    );

}


// ==================================================
// PRIORITY FILTER
// ==================================================

const filterPriority =
    document.getElementById(
        "filterPriority"
    );


if (filterPriority) {

    filterPriority.addEventListener(
        "change",
        applyLeadFilters
    );

}


// ==================================================
// SOURCE FILTER
// ==================================================

const filterSource =
    document.getElementById(
        "filterSource"
    );


if (filterSource) {

    filterSource.addEventListener(
        "change",
        applyLeadFilters
    );

}


// ==================================================
// COURSE FILTER
// ==================================================

const filterCourse =
    document.getElementById(
        "filterCourse"
    );


if (filterCourse) {

    filterCourse.addEventListener(
        "change",
        applyLeadFilters
    );

}


// ==================================================
// VIEW LEAD
// ==================================================

function viewLead(leadId) {

    window.location.href =
        "lead-details.html?id=" +
        leadId;

}


// ==================================================
// EDIT LEAD
// ==================================================

function editLead(leadId) {

    window.location.href =
        "lead-edit.html?id=" +
        leadId;

}


// ==================================================
// ASSIGN LEAD
// ==================================================

function assignLead(leadId) {

    window.location.href =
        "lead-assignment-details.html?leadId=" +
        leadId;

}


// ==================================================
// DELETE LEAD
// ==================================================

async function deleteLead(
    leadId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this lead?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/leads/${leadId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        if (!response.ok) {

            let errorMessage =
                "Failed to delete lead.";


            try {

                const errorData =
                    await response.json();


                errorMessage =
                    errorData.error ||
                    errorData.message ||
                    errorMessage;


            } catch (error) {

                // No JSON error response

            }


            alert(
                errorMessage
            );

            return;

        }


        alert(
            "Lead deleted successfully."
        );


        await loadLeads();


    } catch (error) {

        console.error(
            "Error deleting lead:",
            error
        );


        alert(
            "Unable to connect to CRM server."
        );

    }

}


// ==================================================
// EXCEL IMPORT
// ==================================================


// ==================================================
// OPEN EXCEL IMPORT
// ==================================================

function openExcelImport() {

    const section =
        document.getElementById(
            "excelImportSection"
        );


    if (section) {

        section.style.display =
            "block";

    }

}


// ==================================================
// CLOSE EXCEL IMPORT
// ==================================================

function closeExcelImport() {

    const section =
        document.getElementById(
            "excelImportSection"
        );


    if (section) {

        section.style.display =
            "none";

    }


    const fileInput =
        document.getElementById(
            "excelFile"
        );


    if (fileInput) {

        fileInput.value =
            "";

    }


    const fileName =
        document.getElementById(
            "excelFileName"
        );


    if (fileName) {

        fileName.textContent =
            "";

    }


    const previewSection =
        document.getElementById(
            "excelPreviewSection"
        );


    if (previewSection) {

        previewSection.style.display =
            "none";

    }


    const mappingSection =
        document.getElementById(
            "excelMappingSection"
        );


    if (mappingSection) {

        mappingSection.style.display =
            "none";

    }


    const message =
        document.getElementById(
            "excelImportMessage"
        );


    if (message) {

        message.innerHTML =
            "";

    }


    window.excelImportRows =
        [];

    window.excelColumnMapping =
        {};

    window.validExcelRows =
        [];

    window.invalidExcelRows =
        [];

    window.excelHasHeader =
        false;

}


// ==================================================
// SHOW SELECTED FILE NAME
// ==================================================

const excelFileInput =
    document.getElementById(
        "excelFile"
    );


if (excelFileInput) {

    excelFileInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            const fileName =
                document.getElementById(
                    "excelFileName"
                );


            if (!file) {

                if (fileName) {

                    fileName.textContent =
                        "";

                }

                return;

            }


            if (fileName) {

                fileName.textContent =
                    "Selected file: " +
                    file.name;

            }

        }
    );

}


// ==================================================
// EXCEL COLUMN LETTER
// ==================================================

function getExcelColumnLetter(
    index
) {

    let letter =
        "";

    let number =
        index + 1;


    while (
        number > 0
    ) {

        const remainder =
            (number - 1) % 26;


        letter =
            String.fromCharCode(
                65 + remainder
            ) +
            letter;


        number =
            Math.floor(
                (number - 1) / 26
            );

    }


    return letter;

}


// ==================================================
// CHECK WHETHER FIRST ROW IS HEADER
// ==================================================

function looksLikeHeaderRow(
    row
) {

    if (
        !row ||
        !Array.isArray(row)
    ) {

        return false;

    }


    const knownHeaders = [

        "name",
        "lead name",
        "leadname",
        "full name",
        "fullname",

        "phone",
        "mobile",
        "mobile number",
        "phone number",
        "contact",
        "contact number",

        "email",
        "email id",
        "emailid",

        "course",
        "course interested",
        "courseinterested",

        "source",
        "lead source",
        "leadsource",

        "status",
        "lead status",
        "leadstatus",

        "priority",
        "lead priority",
        "leadpriority",

        "city",
        "location",

        "campaign",
        "campaign id",
        "campaignid"

    ];


    let matchedCount =
        0;


    row.forEach(
        function (value) {

            const text =
                String(
                    value ?? ""
                )
                    .trim()
                    .toLowerCase();


            if (
                knownHeaders.includes(
                    text
                )
            ) {

                matchedCount++;

            }

        }
    );


    return matchedCount >= 1;

}


// ==================================================
// PREVIEW EXCEL FILE
// ==================================================

function previewExcelFile() {

    const fileInput =
        document.getElementById(
            "excelFile"
        );


    if (
        !fileInput ||
        !fileInput.files.length
    ) {

        alert(
            "Please select an Excel file first."
        );

        return;

    }


    const file =
        fileInput.files[0];


    const fileName =
        file.name.toLowerCase();


    if (
        !fileName.endsWith(
            ".xlsx"
        )
    ) {

        alert(
            "Please select a valid .xlsx Excel file."
        );

        return;

    }


    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        alert(
            "Excel file must be smaller than 10 MB."
        );

        return;

    }


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel reader is not loaded. Please refresh the page."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            try {

                const data =
                    new Uint8Array(
                        event.target.result
                    );


                const workbook =
                    XLSX.read(
                        data,
                        {
                            type: "array"
                        }
                    );


                if (
                    !workbook.SheetNames.length
                ) {

                    alert(
                        "The Excel file does not contain any sheet."
                    );

                    return;

                }


                const firstSheetName =
                    workbook.SheetNames[0];


                const worksheet =
                    workbook.Sheets[
                        firstSheetName
                    ];


                // ==========================================
                // READ AS ARRAY
                // ==========================================

                const rawRows =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {

                            header: 1,

                            defval: "",

                            raw: false

                        }
                    );


                if (
                    !rawRows.length
                ) {

                    alert(
                        "The selected Excel sheet is empty."
                    );

                    return;

                }


                // ==========================================
                // REMOVE EMPTY ROWS
                // ==========================================

                const cleanedRows =
                    rawRows.filter(
                        function (row) {

                            return row.some(
                                function (value) {

                                    return String(
                                        value ?? ""
                                    ).trim() !== "";

                                }
                            );

                        }
                    );


                if (
                    !cleanedRows.length
                ) {

                    alert(
                        "The selected Excel sheet is empty."
                    );

                    return;

                }


                const firstRow =
                    cleanedRows[0];


                const hasHeader =
                    looksLikeHeaderRow(
                        firstRow
                    );


                let columns =
                    [];

                let rows =
                    [];


                // ==========================================
                // HEADER FILE
                // ==========================================

                if (
                    hasHeader
                ) {

                    columns =
                        firstRow.map(
                            function (
                                value,
                                index
                            ) {

                                const text =
                                    String(
                                        value ??
                                        ""
                                    ).trim();


                                return (
                                    text ||
                                    `Column ${getExcelColumnLetter(index)}`
                                );

                            }
                        );


                    rows =
                        cleanedRows
                            .slice(1)
                            .map(
                                function (row) {

                                    const object =
                                        {};


                                    columns.forEach(
                                        function (
                                            column,
                                            index
                                        ) {

                                            object[
                                                column
                                            ] =
                                                row[
                                                    index
                                                ] ??
                                                "";

                                        }
                                    );


                                    return object;

                                }
                            );

                }


                // ==========================================
                // NO HEADER FILE
                // ==========================================

                else {

                    const maxColumns =
                        Math.max.apply(
                            null,
                            cleanedRows.map(
                                function (row) {

                                    return row.length;

                                }
                            )
                        );


                    columns =
                        Array.from(
                            {
                                length:
                                    maxColumns
                            },
                            function (
                                value,
                                index
                            ) {

                                return (
                                    "Column " +
                                    getExcelColumnLetter(
                                        index
                                    )
                                );

                            }
                        );


                    rows =
                        cleanedRows.map(
                            function (row) {

                                const object =
                                    {};


                                columns.forEach(
                                    function (
                                        column,
                                        index
                                    ) {

                                        object[
                                            column
                                        ] =
                                            row[
                                                index
                                            ] ??
                                            "";

                                    }
                                );


                                return object;

                            }
                        );

                }


                if (
                    !rows.length
                ) {

                    alert(
                        "No data rows were found in the Excel file."
                    );

                    return;

                }


                window.excelHasHeader =
                    hasHeader;


                displayExcelPreview(
                    rows
                );


            } catch (error) {

                console.error(
                    "Excel preview error:",
                    error
                );


                alert(
                    "Unable to read the Excel file."
                );

            }

        };


    reader.readAsArrayBuffer(
        file
    );

}


// ==================================================
// DISPLAY EXCEL PREVIEW
// ==================================================

function displayExcelPreview(
    rows
) {

    const head =
        document.getElementById(
            "excelPreviewHead"
        );


    const body =
        document.getElementById(
            "excelPreviewBody"
        );


    const previewSection =
        document.getElementById(
            "excelPreviewSection"
        );


    const previewInfo =
        document.getElementById(
            "excelPreviewInfo"
        );


    if (
        !head ||
        !body ||
        !previewSection
    ) {

        console.error(
            "Excel preview elements not found."
        );

        return;

    }


    head.innerHTML =
        "";

    body.innerHTML =
        "";


    const columns =
        Object.keys(
            rows[0]
        );


    // ==========================================
    // HEADER
    // ==========================================

    const headerRow =
        document.createElement(
            "tr"
        );


    columns.forEach(
        function (column) {

            const th =
                document.createElement(
                    "th"
                );


            th.textContent =
                column;


            headerRow.appendChild(
                th
            );

        }
    );


    head.appendChild(
        headerRow
    );


    // ==========================================
    // FIRST 10 ROWS
    // ==========================================

    const previewRows =
        rows.slice(
            0,
            10
        );


    previewRows.forEach(
        function (row) {

            const tr =
                document.createElement(
                    "tr"
                );


            columns.forEach(
                function (column) {

                    const td =
                        document.createElement(
                            "td"
                        );


                    td.textContent =
                        row[
                            column
                        ] ?? "";


                    tr.appendChild(
                        td
                    );

                }
            );


            body.appendChild(
                tr
            );

        }
    );


    // ==========================================
    // INFO
    // ==========================================

    if (previewInfo) {

        const headerText =
            window.excelHasHeader
                ? "Headers detected"
                : "No headers detected - columns created automatically";


        previewInfo.textContent =
            `${headerText}. Showing ${previewRows.length} of ${rows.length} data rows`;

    }


    previewSection.style.display =
        "block";


    // ==========================================
    // GENERATE MAPPING
    // ==========================================

    generateColumnMapping(
        columns
    );


    // ==========================================
    // STORE ROWS
    // ==========================================

    window.excelImportRows =
        rows;

}


// ==================================================
// CRM COLUMN DEFINITIONS
// ==================================================

const crmLeadFields = [

    {
        value: "",
        label: "Ignore this column"
    },

    {
        value: "name",
        label: "Lead Name"
    },

    {
        value: "phone",
        label: "Phone"
    },

    {
        value: "email",
        label: "Email"
    },

    {
        value: "courseInterested",
        label: "Course Interested"
    },

    {
        value: "leadSource",
        label: "Lead Source"
    },

    {
        value: "status",
        label: "Status"
    },

    {
        value: "priority",
        label: "Priority"
    },

    {
        value: "city",
        label: "City"
    },

    {
        value: "campaignId",
        label: "Campaign ID"
    }

];


// ==================================================
// NORMALIZE COLUMN NAME
// ==================================================

function normalizeColumnName(
    column
) {

    return String(
        column
    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        );

}


// ==================================================
// AUTOMATIC COLUMN MATCHING
// ==================================================

function detectCRMField(
    column
) {

    const normalized =
        normalizeColumnName(
            column
        );


    // SERIAL / ID

    if (

        normalized === "sno" ||
        normalized === "srno" ||
        normalized === "serialno" ||
        normalized === "serialnumber" ||
        normalized === "id"

    ) {

        return "";

    }


    // NAME

    if (

        normalized === "name" ||
        normalized === "leadname" ||
        normalized === "customername" ||
        normalized === "clientname" ||
        normalized === "fullname"

    ) {

        return "name";

    }


    // PHONE

    if (

        normalized === "number" ||
        normalized === "phone" ||
        normalized === "phonenumber" ||
        normalized === "mobile" ||
        normalized === "mobilenumber" ||
        normalized === "contactnumber" ||
        normalized === "contact"

    ) {

        return "phone";

    }


    // EMAIL

    if (

        normalized === "email" ||
        normalized === "emailid" ||
        normalized === "mail" ||
        normalized === "mailid"

    ) {

        return "email";

    }


    // COURSE

    if (

        normalized === "course" ||
        normalized === "courseinterested" ||
        normalized === "interestedcourse" ||
        normalized === "program" ||
        normalized === "programinterested"

    ) {

        return "courseInterested";

    }


    // SOURCE

    if (

        normalized === "source" ||
        normalized === "leadsource"

    ) {

        return "leadSource";

    }


    // STATUS

    if (

        normalized === "stage" ||
        normalized === "status" ||
        normalized === "leadstatus" ||
        normalized === "leadstage"

    ) {

        return "status";

    }


    // PRIORITY

    if (

        normalized === "priority" ||
        normalized === "leadpriority"

    ) {

        return "priority";

    }


    // CITY

    if (

        normalized === "city" ||
        normalized === "location" ||
        normalized === "town"

    ) {

        return "city";

    }


    // CAMPAIGN

    if (

        normalized === "campaignid" ||
        normalized === "campaign" ||
        normalized === "campaignno" ||
        normalized === "campaignnumber"

    ) {

        return "campaignId";

    }


    return "";

}


// ==================================================
// GENERATE COLUMN MAPPING
// ==================================================

function generateColumnMapping(
    columns
) {

    const mappingSection =
        document.getElementById(
            "excelMappingSection"
        );


    const mappingContainer =
        document.getElementById(
            "excelMappingContainer"
        );


    if (
        !mappingSection ||
        !mappingContainer
    ) {

        console.error(
            "Excel mapping section or container not found."
        );

        return;

    }


    mappingContainer.innerHTML =
        "";


    columns.forEach(
        function (column) {

            const detectedField =
                detectCRMField(
                    column
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "excel-mapping-row";


            // COLUMN NAME

            const columnName =
                document.createElement(
                    "div"
                );


            columnName.className =
                "excel-column-name";


            columnName.textContent =
                column;


            // ARROW

            const arrow =
                document.createElement(
                    "div"
                );


            arrow.className =
                "excel-mapping-arrow";


            arrow.textContent =
                "→";


            // SELECT

            const select =
                document.createElement(
                    "select"
                );


            select.className =
                "excel-column-select";


            select.dataset.excelColumn =
                column;


            crmLeadFields.forEach(
                function (field) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        field.value;


                    option.textContent =
                        field.label;


                    if (
                        field.value ===
                        detectedField
                    ) {

                        option.selected =
                            true;

                    }


                    select.appendChild(
                        option
                    );

                }
            );


            row.appendChild(
                columnName
            );


            row.appendChild(
                arrow
            );


            row.appendChild(
                select
            );


            mappingContainer.appendChild(
                row
            );

        }
    );


    mappingSection.style.display =
        "block";


    window.excelColumnMapping =
        {};


    const selects =
        mappingContainer.querySelectorAll(
            ".excel-column-select"
        );


    selects.forEach(
        function (select) {

            window.excelColumnMapping[
                select.dataset.excelColumn
            ] =
                select.value;


            select.addEventListener(
                "change",
                function () {

                    window.excelColumnMapping[
                        select.dataset.excelColumn
                    ] =
                        select.value;

                }
            );

        }
    );


    console.log(
        "Excel column mapping generated:",
        window.excelColumnMapping
    );

}


// ==================================================
// VALIDATE EXCEL LEADS
// ==================================================

function validateExcelLeads() {

    const rows =
        window.excelImportRows;


    const mapping =
        window.excelColumnMapping;


    if (
        !rows ||
        !rows.length
    ) {

        alert(
            "Please preview an Excel file first."
        );

        return;

    }


    if (
        !mapping ||
        !Object.keys(
            mapping
        ).length
    ) {

        alert(
            "Please generate the column mapping first."
        );

        return;

    }


    // ==========================================
    // FIND MAPPED COLUMNS
    // ==========================================

    let nameColumn =
        null;

    let phoneColumn =
        null;

    let emailColumn =
        null;


    Object.keys(
        mapping
    )
        .forEach(
            function (excelColumn) {

                const crmField =
                    mapping[
                        excelColumn
                    ];


                if (
                    crmField ===
                    "name"
                ) {

                    nameColumn =
                        excelColumn;

                }


                if (
                    crmField ===
                    "phone"
                ) {

                    phoneColumn =
                        excelColumn;

                }


                if (
                    crmField ===
                    "email"
                ) {

                    emailColumn =
                        excelColumn;

                }

            }
        );


    // ==========================================
    // NAME REQUIRED
    // ==========================================

    if (!nameColumn) {

        alert(
            "Please map one Excel column to Lead Name before validating."
        );

        return;

    }


    // ==========================================
    // STATUS / PRIORITY
    // ==========================================

    const statusColumn =
        Object.keys(
            mapping
        )
            .find(
                function (column) {

                    return (
                        mapping[
                            column
                        ] ===
                        "status"
                    );

                }
            );


    const priorityColumn =
        Object.keys(
            mapping
        )
            .find(
                function (column) {

                    return (
                        mapping[
                            column
                        ] ===
                        "priority"
                    );

                }
            );


    const validStatuses = [

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


    const validPriorities = [

        "LOW",
        "MEDIUM",
        "HIGH"

    ];


    const validRows =
        [];

    const invalidRows =
        [];


    const seenPhones =
        new Set();


    // ==========================================
    // VALIDATE EVERY ROW
    // ==========================================

    rows.forEach(
        function (row, index) {

            const name =
                String(
                    row[
                        nameColumn
                    ] ??
                    ""
                ).trim();


            const phone =
                phoneColumn
                    ? String(
                        row[
                            phoneColumn
                        ] ??
                        ""
                    )
                        .replace(
                            /\D/g,
                            ""
                        )
                    : "";


            const email =
                emailColumn
                    ? String(
                        row[
                            emailColumn
                        ] ??
                        ""
                    ).trim()
                    : "";


            const errors =
                [];


            // NAME

            if (!name) {

                errors.push(
                    "Name is missing"
                );

            }


            // PHONE

            if (
                phoneColumn &&
                phone
            ) {

                if (
                    phone.length < 10 ||
                    phone.length > 15
                ) {

                    errors.push(
                        "Invalid phone number"
                    );

                }

            }


            // EMAIL

            if (email) {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    errors.push(
                        "Invalid email"
                    );

                }

            }


            // STATUS

            if (
                statusColumn
            ) {

                const status =
                    String(
                        row[
                            statusColumn
                        ] ??
                        ""
                    )
                        .trim()
                        .toUpperCase();


                if (
                    status &&
                    !validStatuses.includes(
                        status
                    )
                ) {

                    errors.push(
                        "Invalid status"
                    );

                }

            }


            // PRIORITY

            if (
                priorityColumn
            ) {

                const priority =
                    String(
                        row[
                            priorityColumn
                        ] ??
                        ""
                    )
                        .trim()
                        .toUpperCase();


                if (
                    priority &&
                    !validPriorities.includes(
                        priority
                    )
                ) {

                    errors.push(
                        "Invalid priority"
                    );

                }

            }


            // DUPLICATE PHONE

            if (phone) {

                if (
                    seenPhones.has(
                        phone
                    )
                ) {

                    errors.push(
                        "Duplicate phone in Excel"
                    );

                }


                seenPhones.add(
                    phone
                );

            }


            // SAVE RESULT

            if (
                errors.length
            ) {

                invalidRows.push({

                    rowNumber:
                        window.excelHasHeader
                            ? index + 2
                            : index + 1,

                    name:
                        name,

                    phone:
                        phone,

                    email:
                        email,

                    errors:
                        errors

                });

            } else {

                validRows.push(
                    row
                );

            }

        }
    );


    window.validExcelRows =
        validRows;


    window.invalidExcelRows =
        invalidRows;


    // ==========================================
    // DISPLAY VALIDATION
    // ==========================================

    const message =
        document.getElementById(
            "excelImportMessage"
        );


    if (!message) {
        return;
    }


    message.innerHTML =
        "";


    const summary =
        document.createElement(
            "div"
        );


    summary.className =
        "excel-validation-summary";


    summary.innerHTML = `

        <strong>
            Validation Complete
        </strong>

        <div class="excel-validation-stats">

            <span class="validation-valid">
                ✓ Valid Rows: ${validRows.length}
            </span>

            <span class="validation-invalid">
                ⚠ Invalid Rows: ${invalidRows.length}
            </span>

        </div>

    `;


    message.appendChild(
        summary
    );


    // ==========================================
    // SHOW INVALID ROWS
    // ==========================================

    if (
        invalidRows.length > 0
    ) {

        const errorTitle =
            document.createElement(
                "h4"
            );


        errorTitle.textContent =
            "Rows requiring attention:";


        message.appendChild(
            errorTitle
        );


        const errorList =
            document.createElement(
                "ul"
            );


        invalidRows
            .slice(
                0,
                20
            )
            .forEach(
                function (item) {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        `Row ${item.rowNumber}: ` +
                        item.errors.join(
                            ", "
                        );


                    errorList.appendChild(
                        li
                    );

                }
            );


        message.appendChild(
            errorList
        );


        if (
            invalidRows.length > 20
        ) {

            const more =
                document.createElement(
                    "p"
                );


            more.textContent =
                `Showing first 20 errors of ${invalidRows.length}.`;


            message.appendChild(
                more
            );

        }

    }


    // ==========================================
    // IMPORT BUTTON
    // ==========================================

    const importButton =
        document.getElementById(
            "confirmExcelImport"
        );


    if (importButton) {

        importButton.disabled =
            validRows.length === 0;

    }

}


// ==================================================
// IMPORT EXCEL LEADS
// ==================================================

async function importExcelLeads() {

    const rows =
        window.validExcelRows;


    const mapping =
        window.excelColumnMapping;


    if (
        !rows ||
        !rows.length
    ) {

        alert(
            "Please validate the Excel file first."
        );

        return;

    }


    if (
        !mapping ||
        !Object.keys(
            mapping
        ).length
    ) {

        alert(
            "Column mapping is missing."
        );

        return;

    }


    const importButton =
        document.getElementById(
            "confirmExcelImport"
        );


    if (importButton) {

        importButton.disabled =
            true;

        importButton.textContent =
            "Importing...";

    }


    let successCount =
        0;

    let failedCount =
        0;


    // ==========================================
    // BACKEND FAILED ROWS
    // ==========================================

    const backendFailedRows =
        [];


    try {

        // ==========================================
        // IMPORT EACH VALID ROW
        // ==========================================

        for (
            let i = 0;
            i < rows.length;
            i++
        ) {

            const row =
                rows[i];


            const lead = {

                fullName:
                    "",

                phone:
                    "",

                email:
                    "",

                courseInterested:
                    "",

                leadSource:
                    "",

                status:
                    "NEW",

                priority:
                    "MEDIUM",

                city:
                    "",

                campaignId:
                    null

            };


            // ==========================================
            // MAP EXCEL DATA
            // ==========================================

            Object.keys(
                mapping
            )
                .forEach(
                    function (excelColumn) {

                        const crmField =
                            mapping[
                                excelColumn
                            ];


                        const value =
                            row[
                                excelColumn
                            ] ?? "";


                        if (!crmField) {
                            return;
                        }


                        if (
                            crmField ===
                            "name"
                        ) {

                            lead.fullName =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "phone"
                        ) {

                            lead.phone =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "email"
                        ) {

                            lead.email =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "courseInterested"
                        ) {

                            lead.courseInterested =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "leadSource"
                        ) {

                            lead.leadSource =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "status"
                        ) {

                            const status =
                                String(
                                    value
                                )
                                    .trim()
                                    .toUpperCase();


                            if (status) {

                                lead.status =
                                    status;

                            }

                        }


                        if (
                            crmField ===
                            "priority"
                        ) {

                            const priority =
                                String(
                                    value
                                )
                                    .trim()
                                    .toUpperCase();


                            if (priority) {

                                lead.priority =
                                    priority;

                            }

                        }


                        if (
                            crmField ===
                            "city"
                        ) {

                            lead.city =
                                String(
                                    value
                                ).trim();

                        }


                        if (
                            crmField ===
                            "campaignId"
                        ) {

                            const campaignValue =
                                String(
                                    value
                                ).trim();


                            if (
                                campaignValue
                            ) {

                                const campaignNumber =
                                    Number(
                                        campaignValue
                                    );


                                if (
                                    !isNaN(
                                        campaignNumber
                                    )
                                ) {

                                    lead.campaignId =
                                        campaignNumber;

                                }

                            }

                        }

                    }
                );


            // ==========================================
            // SEND TO BACKEND
            // ==========================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/leads`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " +
                                    token

                            },

                            body:
                                JSON.stringify(
                                    lead
                                )

                        }
                    );


                // ==========================================
                // SUCCESS
                // ==========================================

                if (
                    response.ok
                ) {

                    successCount++;

                }


                // ==========================================
                // BACKEND FAILURE
                // ==========================================

                else {

                    failedCount++;


                    let errorMessage =
                        "Unknown backend error";


                    try {

                        const errorData =
                            await response.json();


                        errorMessage =
                            errorData.message ||
                            errorData.error ||
                            errorData.detail ||
                            JSON.stringify(
                                errorData
                            );


                    } catch (
                        error
                    ) {

                        try {

                            errorMessage =
                                await response.text();

                        } catch (
                            textError
                        ) {

                            errorMessage =
                                "HTTP " +
                                response.status;

                        }

                    }


                    const failedRow = {

                        "Excel Row":
                            window.excelHasHeader
                                ? i + 2
                                : i + 1,

                        "Failure Type":
                            "Backend Import Failed",

                        "Failure Reason":
                            errorMessage,

                        "Lead Name":
                            lead.fullName,

                        "Phone":
                            lead.phone,

                        "Email":
                            lead.email,

                        "Course":
                            lead.courseInterested,

                        "Source":
                            lead.leadSource,

                        "Status":
                            lead.status,

                        "Priority":
                            lead.priority,

                        "City":
                            lead.city,

                        "Campaign ID":
                            lead.campaignId ??
                            ""

                    };


                    // Add original Excel columns

                    Object.keys(
                        row
                    )
                        .forEach(
                            function (column) {

                                if (
                                    failedRow[column] ===
                                    undefined
                                ) {

                                    failedRow[column] =
                                        row[column];

                                }

                            }
                        );


                    backendFailedRows.push(
                        failedRow
                    );


                    console.error(
                        "Backend import failed:",
                        failedRow
                    );

                }

            } catch (
                networkError
            ) {

                // ==========================================
                // NETWORK FAILURE
                // ==========================================

                failedCount++;


                const failedRow = {

                    "Excel Row":
                        window.excelHasHeader
                            ? i + 2
                            : i + 1,

                    "Failure Type":
                        "Connection / Network Error",

                    "Failure Reason":
                        networkError.message,

                    "Lead Name":
                        lead.fullName,

                    "Phone":
                        lead.phone,

                    "Email":
                        lead.email,

                    "Course":
                        lead.courseInterested,

                    "Source":
                        lead.leadSource,

                    "Status":
                        lead.status,

                    "Priority":
                        lead.priority,

                    "City":
                        lead.city,

                    "Campaign ID":
                        lead.campaignId ??
                        ""

                };


                Object.keys(
                    row
                )
                    .forEach(
                        function (column) {

                            if (
                                failedRow[column] ===
                                undefined
                            ) {

                                failedRow[column] =
                                    row[column];

                            }

                        }
                    );


                backendFailedRows.push(
                    failedRow
                );


                console.error(
                    "Network import error:",
                    networkError
                );

            }

        }


        // ==========================================
        // VALIDATION FAILED ROWS
        // ==========================================

        const validationFailedRows =
            (
                window.invalidExcelRows ||
                []
            )
                .map(
                    function (item) {

                        const originalIndex =
                            window.excelHasHeader
                                ? item.rowNumber - 2
                                : item.rowNumber - 1;


                        const originalRow =
                            (
                                window.excelImportRows[
                                    originalIndex
                                ] ||
                                {}
                            );


                        const failedRow = {

                            "Excel Row":
                                item.rowNumber,

                            "Failure Type":
                                "Validation Failed",

                            "Failure Reason":
                                item.errors.join(
                                    ", "
                                ),

                            "Lead Name":
                                item.name ||
                                "",

                            "Phone":
                                item.phone ||
                                "",

                            "Email":
                                item.email ||
                                ""

                        };


                        // Add original Excel columns

                        Object.keys(
                            originalRow
                        )
                            .forEach(
                                function (column) {

                                    if (
                                        failedRow[column] ===
                                        undefined
                                    ) {

                                        failedRow[column] =
                                            originalRow[
                                                column
                                            ];

                                    }

                                }
                            );


                        return failedRow;

                    }
                );


        // ==========================================
        // COMBINE FAILED ROWS
        // ==========================================

        const allFailedRows = [

            ...validationFailedRows,

            ...backendFailedRows

        ];


        // ==========================================
        // DOWNLOAD FAILED EXCEL
        // ==========================================

        if (
            allFailedRows.length > 0
        ) {

            downloadFailedLeadsExcel(
                allFailedRows
            );

        }


        // ==========================================
        // FINAL MESSAGE
        // ==========================================

        alert(

            `Excel import completed.\n\n` +

            `Successfully imported: ${successCount}\n` +

            `Backend failed: ${backendFailedRows.length}\n` +

            `Validation failed: ${validationFailedRows.length}\n\n` +

            `Total failed records: ${allFailedRows.length}\n\n` +

            `A separate Excel file containing the failed leads has been downloaded.`

        );


        // ==========================================
        // REFRESH CRM
        // ==========================================

        await loadLeads();


        // ==========================================
        // RESET IMPORT STORAGE
        // ==========================================

        window.validExcelRows =
            [];

        window.invalidExcelRows =
            [];

        window.excelImportRows =
            [];

        window.excelColumnMapping =
            {};


    } catch (error) {

        console.error(
            "Excel import error:",
            error
        );


        alert(
            "An error occurred during Excel import."
        );


    } finally {

        if (importButton) {

            importButton.disabled =
                false;

            importButton.textContent =
                "Import Leads";

        }

    }

}


// ==================================================
// DOWNLOAD FAILED LEADS EXCEL
// ==================================================

function downloadFailedLeadsExcel(
    failedRows
) {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel download library is not available."
        );

        return;

    }


    if (
        !failedRows ||
        !failedRows.length
    ) {

        return;

    }


    // ==========================================
    // CREATE WORKSHEET
    // ==========================================

    const worksheet =
        XLSX.utils.json_to_sheet(
            failedRows
        );


    // ==========================================
    // CREATE WORKBOOK
    // ==========================================

    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Failed Leads"
    );


    // ==========================================
    // AUTO WIDTH
    // ==========================================

    const columns =
        Object.keys(
            failedRows[0]
        );


    worksheet["!cols"] =
        columns.map(
            function (column) {

                let maxLength =
                    column.length;


                failedRows.forEach(
                    function (row) {

                        const value =
                            String(
                                row[column] ??
                                ""
                            );


                        if (
                            value.length >
                            maxLength
                        ) {

                            maxLength =
                                value.length;

                        }

                    }
                );


                return {

                    wch:
                        Math.min(
                            Math.max(
                                maxLength + 2,
                                12
                            ),
                            50
                        )

                };

            }
        );


    // ==========================================
    // FILE NAME
    // ==========================================

    const now =
        new Date();


    const date =
        now.getFullYear() +
        "-" +
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const time =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );


    const fileName =
        `CRM_Failed_Leads_${date}_${time}.xlsx`;


    // ==========================================
    // DOWNLOAD
    // ==========================================

    XLSX.writeFile(
        workbook,
        fileName
    );

}


// ==================================================
// CLEAR LEAD FILTERS
// ==================================================

const clearLeadFilters =
    document.getElementById(
        "clearLeadFilters"
    );


if (clearLeadFilters) {

    clearLeadFilters.addEventListener(
        "click",
        function () {

            const searchElement =
                document.getElementById(
                    "searchLead"
                );


            const statusElement =
                document.getElementById(
                    "filterStatus"
                );


            const priorityElement =
                document.getElementById(
                    "filterPriority"
                );


            const sourceElement =
                document.getElementById(
                    "filterSource"
                );


            const courseElement =
                document.getElementById(
                    "filterCourse"
                );


            if (searchElement) {

                searchElement.value =
                    "";

            }


            if (statusElement) {

                statusElement.value =
                    "";

            }


            if (priorityElement) {

                priorityElement.value =
                    "";

            }


            if (sourceElement) {

                sourceElement.value =
                    "";

            }


            if (courseElement) {

                courseElement.value =
                    "";

            }


            currentSortField =
                "";

            currentSortDirection =
                "asc";

            currentPage =
                1;


            renderLeads(
                allLeads
            );

        }
    );

}


// ==================================================
// PREVIOUS PAGE
// ==================================================

const previousPage =
    document.getElementById(
        "previousPage"
    );


if (previousPage) {

    previousPage.addEventListener(
        "click",
        function () {

            if (
                currentPage > 1
            ) {

                currentPage--;

                renderLeads(
                    currentViewLeads
                );

            }

        }
    );

}


// ==================================================
// NEXT PAGE
// ==================================================

const nextPage =
    document.getElementById(
        "nextPage"
    );


if (nextPage) {

    nextPage.addEventListener(
        "click",
        function () {

            const totalPages =
                Math.max(
                    1,
                    Math.ceil(
                        currentViewLeads.length /
                        pageSize
                    )
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderLeads(
                    currentViewLeads
                );

            }

        }
    );

}


// ==================================================
// PAGE SIZE
// ==================================================

const pageSizeSelect =
    document.getElementById(
        "pageSize"
    );


if (pageSizeSelect) {

    pageSizeSelect.addEventListener(
        "change",
        function () {

            pageSize =
                Number(
                    this.value
                );


            currentPage =
                1;


            renderLeads(
                currentViewLeads
            );

        }
    );

}