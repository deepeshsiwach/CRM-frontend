// ============================================================
// DERIVION CRM - GLOBAL ROLE ACCESS CONTROL
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // LOGIN
    // ========================================================

    const token =
        localStorage.getItem("jwtToken");

    const userRole =
        (
            localStorage.getItem("userRole") || ""
        )
        .trim()
        .toUpperCase();


    if (!token) {

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ========================================================
    // ROLE ACCESS
    // ========================================================

    const PAGE_ACCESS = {

        // -----------------------------
        // ALL USERS
        // -----------------------------

        "dashboard.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "leads.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "add-lead.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "lead-detail.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "lead-edit.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "closed-leads.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "call-logs.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "follow-ups.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "edit-follow-up.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "notes.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],

        "note-detail.html": [
            "ADMIN",
            "MANAGER",
            "AGENT"
        ],


        // -----------------------------
        // ADMIN + MANAGER
        // -----------------------------

        "lead-assignments.html": [
            "ADMIN",
            "MANAGER"
        ],

        "teams.html": [
            "ADMIN",
            "MANAGER"
        ],

        "courses.html": [
            "ADMIN",
            "MANAGER"
        ],

        "campaigns.html": [
            "ADMIN",
            "MANAGER"
        ],


        // -----------------------------
        // ADMIN ONLY
        // -----------------------------

        "users.html": [
            "ADMIN"
        ]

    };


    // ========================================================
    // RESTRICTED MENU PAGE NAMES
    // ========================================================

    const RESTRICTED_PAGES = {

        "lead-assignments.html": true,
        "users.html": true,
        "teams.html": true,
        "courses.html": true,
        "campaigns.html": true

    };


    // ========================================================
    // GET CURRENT PAGE
    // ========================================================

    function getCurrentPage() {

        let page =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        if (!page) {

            page =
                "dashboard.html";

        }


        return page;

    }


    // ========================================================
    // CHECK CURRENT PAGE
    // ========================================================

    function checkCurrentPageAccess() {

        const currentPage =
            getCurrentPage();


        if (
            !Object.prototype.hasOwnProperty.call(
                PAGE_ACCESS,
                currentPage
            )
        ) {

            return;

        }


        const allowedRoles =
            PAGE_ACCESS[
                currentPage
            ];


        if (
            !allowedRoles.includes(
                userRole
            )
        ) {

            window.location.replace(
                "dashboard.html"
            );

        }

    }


    // ========================================================
    // GET PAGE FROM LINK
    // ========================================================

    function getPageFromLink(link) {

        const href =
            link.getAttribute("href");


        if (!href) {

            return "";

        }


        if (
            href === "#" ||
            href.startsWith("#") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {

            return "";

        }


        return href
            .split("?")[0]
            .split("#")[0]
            .split("/")
            .pop()
            .trim()
            .toLowerCase();

    }


    // ========================================================
    // HIDE ELEMENT STRONGLY
    // ========================================================

    function hideElement(element) {

        element.style.setProperty(
            "display",
            "none",
            "important"
        );

        element.setAttribute(
            "aria-hidden",
            "true"
        );

        element.setAttribute(
            "hidden",
            "hidden"
        );

    }


    // ========================================================
    // SHOW ELEMENT
    // ========================================================

    function showElement(element) {

        element.style.removeProperty(
            "display"
        );

        element.removeAttribute(
            "aria-hidden"
        );

        element.removeAttribute(
            "hidden"
        );

    }


    // ========================================================
    // FILTER SIDEBAR
    // ========================================================

    function filterSidebar() {

        const links =
            document.querySelectorAll(
                ".sidebar a"
            );


        links.forEach(
            function (link) {

                const pageName =
                    getPageFromLink(link);


                const linkText =
                    (
                        link.textContent || ""
                    )
                    .trim()
                    .toLowerCase();


                // ==========================================
                // MANAGEMENT PAGE BY HREF
                // ==========================================

                if (
                    RESTRICTED_PAGES[
                        pageName
                    ]
                ) {

                    const allowedRoles =
                        PAGE_ACCESS[
                            pageName
                        ] || [];


                    if (
                        !allowedRoles.includes(
                            userRole
                        )
                    ) {

                        hideElement(
                            link
                        );

                    } else {

                        showElement(
                            link
                        );

                    }

                    return;

                }


                // ==========================================
                // MANAGEMENT PAGE BY TEXT
                // ==========================================

                if (
                    linkText ===
                        "lead assignments"
                    ||
                    linkText ===
                        "users"
                    ||
                    linkText ===
                        "teams"
                    ||
                    linkText ===
                        "courses"
                    ||
                    linkText ===
                        "campaigns"
                ) {

                    let allowed = false;


                    if (
                        linkText ===
                            "lead assignments"
                    ) {

                        allowed =
                            userRole === "ADMIN" ||
                            userRole === "MANAGER";

                    }


                    if (
                        linkText ===
                            "users"
                    ) {

                        allowed =
                            userRole === "ADMIN";

                    }


                    if (
                        linkText ===
                            "teams"
                    ) {

                        allowed =
                            userRole === "ADMIN" ||
                            userRole === "MANAGER";

                    }


                    if (
                        linkText ===
                            "courses"
                    ) {

                        allowed =
                            userRole === "ADMIN" ||
                            userRole === "MANAGER";

                    }


                    if (
                        linkText ===
                            "campaigns"
                    ) {

                        allowed =
                            userRole === "ADMIN" ||
                            userRole === "MANAGER";

                    }


                    if (!allowed) {

                        hideElement(
                            link
                        );

                    } else {

                        showElement(
                            link
                        );

                    }

                    return;

                }


                // ==========================================
                // DATA-ROLES SUPPORT
                // ==========================================

                const rolesAttribute =
                    link.getAttribute(
                        "data-roles"
                    );


                if (rolesAttribute) {

                    const allowedRoles =
                        rolesAttribute
                            .split(",")
                            .map(
                                function (role) {

                                    return role
                                        .trim()
                                        .toUpperCase();

                                }
                            );


                    if (
                        !allowedRoles.includes(
                            userRole
                        )
                    ) {

                        hideElement(
                            link
                        );

                    } else {

                        showElement(
                            link
                        );

                    }

                }

            }
        );

    }


    // ========================================================
    // PROTECT RESTRICTED CLICKS
    // ========================================================

    function protectClicks() {

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        ".sidebar a"
                    );


                if (!link) {

                    return;

                }


                const pageName =
                    getPageFromLink(link);


                if (!pageName) {

                    return;

                }


                if (
                    Object.prototype.hasOwnProperty.call(
                        PAGE_ACCESS,
                        pageName
                    )
                ) {

                    const allowedRoles =
                        PAGE_ACCESS[
                            pageName
                        ];


                    if (
                        !allowedRoles.includes(
                            userRole
                        )
                    ) {

                        event.preventDefault();

                        event.stopImmediatePropagation();


                        window.location.replace(
                            "dashboard.html"
                        );

                    }

                }

            },
            true
        );

    }


    // ========================================================
    // PROTECT DIRECT PAGE ACCESS
    // ========================================================

    function protectCurrentPage() {

        const currentPage =
            getCurrentPage();


        if (
            Object.prototype.hasOwnProperty.call(
                PAGE_ACCESS,
                currentPage
            )
        ) {

            const allowedRoles =
                PAGE_ACCESS[
                    currentPage
                ];


            if (
                !allowedRoles.includes(
                    userRole
                )
            ) {

                window.location.replace(
                    "dashboard.html"
                );

            }

        }

    }


    // ========================================================
    // OBSERVE SIDEBAR CHANGES
    // ========================================================

    function watchSidebar() {

        if (!document.body) {

            return;

        }


        const observer =
            new MutationObserver(
                function () {

                    filterSidebar();

                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    function initializeAccessControl() {

        protectCurrentPage();

        filterSidebar();

        protectClicks();

        watchSidebar();

    }


    // ========================================================
    // START
    // ========================================================

    initializeAccessControl();


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            filterSidebar();

        }
    );


    // Extra safety check
    // after page scripts have executed

    setTimeout(
        function () {

            filterSidebar();

        },
        100
    );


    setTimeout(
        function () {

            filterSidebar();

        },
        500
    );


    setTimeout(
        function () {

            filterSidebar();

        },
        1000
    );


})();