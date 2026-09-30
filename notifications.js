// ============================================================
// DERIVION CRM - NOTIFICATION SYSTEM
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const token =
        localStorage.getItem("jwtToken");


    if (!token) {
        return;
    }


    // ========================================================
    // CREATE NOTIFICATION UI
    // ========================================================

    function createNotificationUI() {

        if (
            document.getElementById(
                "crmNotificationBell"
            )
        ) {
            return;
        }


        const container =
            document.createElement("div");


        container.id =
            "crmNotificationContainer";


        container.style.cssText = `
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        `;


        container.innerHTML = `

            <!-- =========================================
                 NOTIFICATION BELL
                 ========================================= -->

            <div
                id="crmNotificationBell"
                title="Notifications"
                style="
                    position:relative;
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                    width:42px;
                    height:42px;
                    cursor:pointer;
                    font-size:24px;
                    border-radius:10px;
                    transition:background 0.2s ease;
                "
            >

                🔔


                <!-- UNREAD COUNT -->

                <span
                    id="crmNotificationCount"
                    style="
                        position:absolute;
                        top:-5px;
                        right:-5px;
                        min-width:19px;
                        height:19px;
                        padding:0 5px;
                        border-radius:20px;
                        background:#ef4444;
                        color:#ffffff;
                        font-size:11px;
                        font-weight:700;
                        display:none;
                        align-items:center;
                        justify-content:center;
                        line-height:19px;
                        border:2px solid #172554;
                        box-sizing:border-box;
                    "
                >
                    0
                </span>

            </div>



            <!-- =========================================
                 NOTIFICATION PANEL
                 ========================================= -->

            <div
                id="crmNotificationPanel"
                style="
                    display:none;
                    position:fixed;
                    top:85px;
                    right:25px;
                    width:400px;
                    max-width:calc(100vw - 30px);
                    max-height:520px;
                    overflow:hidden;
                    background:#ffffff;
                    border:1px solid #dbe3ef;
                    border-radius:12px;
                    box-shadow:0 15px 40px rgba(15,23,42,0.22);
                    z-index:999999;
                "
            >


                <!-- PANEL HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:15px 16px;
                        border-bottom:1px solid #e5e7eb;
                        background:#ffffff;
                    "
                >

                    <div
                        style="
                            font-size:16px;
                            font-weight:700;
                            color:#111827;
                        "
                    >
                        Notifications
                    </div>


                    <button
                        id="crmMarkAllRead"
                        type="button"
                        style="
                            border:none;
                            background:none;
                            cursor:pointer;
                            color:#2563eb;
                            font-size:12px;
                            font-weight:600;
                            padding:4px 0;
                        "
                    >
                        Mark all as read
                    </button>

                </div>



                <!-- NOTIFICATION LIST -->

                <div
                    id="crmNotificationList"
                    style="
                        max-height:450px;
                        overflow-y:auto;
                        background:#ffffff;
                    "
                >
                </div>


            </div>
        `;



        // ====================================================
        // ADD TO HEADER
        // ====================================================

        const header =
            document.querySelector(
                ".dashboard-header"
            );


        if (header) {

            const userInfo =
                header.querySelector(
                    ".user-info"
                );


            if (userInfo) {

                userInfo.prepend(
                    container
                );

            } else {

                header.appendChild(
                    container
                );

            }

        } else {

            document.body.appendChild(
                container
            );

        }



        // ====================================================
        // BELL CLICK
        // ====================================================

        document
            .getElementById(
                "crmNotificationBell"
            )
            .addEventListener(
                "click",
                async function (event) {

                    event.stopPropagation();


                    const panel =
                        document.getElementById(
                            "crmNotificationPanel"
                        );


                    if (
                        panel.style.display ===
                        "none"
                    ) {

                        panel.style.display =
                            "block";


                        await loadNotifications();

                    } else {

                        panel.style.display =
                            "none";

                    }

                }
            );



        // ====================================================
        // MARK ALL AS READ
        // ====================================================

        document
            .getElementById(
                "crmMarkAllRead"
            )
            .addEventListener(
                "click",
                async function (event) {

                    event.stopPropagation();


                    await markAllNotificationsRead();


                    // Refresh notification panel

                    await loadNotifications();

                }
            );



        // ====================================================
        // CLOSE PANEL WHEN CLICKING OUTSIDE
        // ====================================================

        document.addEventListener(
            "click",
            function (event) {

                const panel =
                    document.getElementById(
                        "crmNotificationPanel"
                    );


                const bell =
                    document.getElementById(
                        "crmNotificationBell"
                    );


                if (!panel || !bell) {
                    return;
                }


                if (
                    !panel.contains(
                        event.target
                    ) &&
                    !bell.contains(
                        event.target
                    )
                ) {

                    panel.style.display =
                        "none";

                }

            }
        );

    }



    // ========================================================
    // LOAD UNREAD NOTIFICATION COUNT
    // ========================================================

    async function loadUnreadCount() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/notifications/unread/count`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {
                return;
            }


            const count =
                await response.json();


            const badge =
                document.getElementById(
                    "crmNotificationCount"
                );


            if (!badge) {
                return;
            }


            if (count > 0) {

                badge.textContent =
                    count > 99
                        ? "99+"
                        : count;


                badge.style.display =
                    "flex";

            } else {

                badge.style.display =
                    "none";

            }

        } catch (error) {

            console.error(
                "Notification count error:",
                error
            );

        }

    }



    // ========================================================
    // LOAD UNREAD NOTIFICATIONS ONLY
    // ========================================================

    async function loadNotifications() {

        const list =
            document.getElementById(
                "crmNotificationList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = `

            <div
                style="
                    padding:30px;
                    text-align:center;
                    color:#6b7280;
                    font-size:13px;
                "
            >
                Loading notifications...
            </div>

        `;


        try {

            /*
             * IMPORTANT:
             *
             * We intentionally load ONLY unread
             * notifications.
             *
             * Read notifications remain in the
             * database but disappear from the
             * notification bar.
             */

            const response =
                await fetch(
                    `${API_BASE_URL}/api/notifications/unread`,
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
                    "Failed to load notifications"
                );

            }


            const notifications =
                await response.json();


            renderNotifications(
                notifications
            );


            await loadUnreadCount();

        } catch (error) {

            console.error(
                "Notification loading error:",
                error
            );


            list.innerHTML = `

                <div
                    style="
                        padding:30px;
                        text-align:center;
                        color:#dc2626;
                        font-size:13px;
                    "
                >
                    Unable to load notifications.
                </div>

            `;

        }

    }



    // ========================================================
    // RENDER NOTIFICATIONS
    // ========================================================

    function renderNotifications(
        notifications
    ) {

        const list =
            document.getElementById(
                "crmNotificationList"
            );


        if (!list) {
            return;
        }



        // ====================================================
        // NO UNREAD NOTIFICATIONS
        // ====================================================

        if (
            !notifications ||
            notifications.length === 0
        ) {

            list.innerHTML = `

                <div
                    style="
                        padding:40px 20px;
                        text-align:center;
                        color:#6b7280;
                        background:#ffffff;
                    "
                >

                    <div
                        style="
                            font-size:30px;
                            margin-bottom:10px;
                        "
                    >
                        🔕
                    </div>

                    <div
                        style="
                            font-size:14px;
                            font-weight:600;
                            color:#374151;
                        "
                    >
                        No new notifications
                    </div>

                    <div
                        style="
                            margin-top:5px;
                            font-size:12px;
                            color:#9ca3af;
                        "
                    >
                        You're all caught up.
                    </div>

                </div>

            `;


            return;

        }



        // ====================================================
        // CLEAR OLD CONTENT
        // ====================================================

        list.innerHTML = "";



        // ====================================================
        // CREATE EACH NOTIFICATION
        // ====================================================

        notifications.forEach(
            function (notification) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.style.cssText = `

                    padding:16px 15px;

                    border-bottom:
                        1px solid #e5e7eb;

                    cursor:pointer;

                    background:#eef2ff;

                    transition:
                        background 0.2s ease;

                `;



                // =================================================
                // ICON
                // =================================================

                let icon = "🔔";


                if (
                    notification.type ===
                    "FOLLOW_UP_REMINDER"
                ) {

                    icon = "⏰";

                } else if (
                    notification.type ===
                    "FOLLOW_UP_OVERDUE"
                ) {

                    icon = "🔴";

                }



                // =================================================
                // NOTIFICATION CONTENT
                // =================================================

                item.innerHTML = `

                    <div
                        style="
                            display:flex;
                            gap:12px;
                            align-items:flex-start;
                        "
                    >


                        <!-- ICON -->

                        <div
                            style="
                                font-size:21px;
                                width:30px;
                                min-width:30px;
                                text-align:center;
                            "
                        >
                            ${icon}
                        </div>



                        <!-- CONTENT -->

                        <div
                            style="
                                flex:1;
                                min-width:0;
                            "
                        >


                            <!-- TITLE -->

                            <div
                                style="
                                    font-size:14px;
                                    font-weight:700;
                                    color:#111827;
                                    margin-bottom:6px;
                                    line-height:1.35;
                                "
                            >
                                ${escapeHtml(
                                    notification.title
                                )}
                            </div>



                            <!-- MESSAGE -->

                            <div
                                style="
                                    font-size:13px;
                                    font-weight:500;
                                    color:#374151;
                                    line-height:1.5;
                                "
                            >
                                ${escapeHtml(
                                    notification.message
                                )}
                            </div>



                            <!-- DATE -->

                            <div
                                style="
                                    margin-top:8px;
                                    font-size:11px;
                                    font-weight:500;
                                    color:#6b7280;
                                "
                            >
                                ${formatNotificationDate(
                                    notification.createdAt
                                )}
                            </div>


                        </div>


                    </div>

                `;



                // =================================================
                // HOVER EFFECT
                // =================================================

                item.addEventListener(
                    "mouseenter",
                    function () {

                        item.style.background =
                            "#e0e7ff";

                    }
                );


                item.addEventListener(
                    "mouseleave",
                    function () {

                        item.style.background =
                            "#eef2ff";

                    }
                );



                // =================================================
                // CLICK NOTIFICATION
                // =================================================

                item.addEventListener(
                    "click",
                    async function (event) {

                        event.stopPropagation();


                        /*
                         * Mark notification as read.
                         *
                         * IMPORTANT:
                         * The backend does NOT delete it.
                         * It simply changes is_read = true.
                         */


                        await markNotificationRead(
                            notification.id
                        );


                        /*
                         * Reload unread notifications.
                         *
                         * Because this endpoint returns
                         * only unread notifications,
                         * the clicked notification will
                         * disappear from the bell.
                         */

                        await loadNotifications();

                    }
                );


                list.appendChild(
                    item
                );

            }
        );

    }



    // ========================================================
    // MARK ONE NOTIFICATION AS READ
    // ========================================================

    async function markNotificationRead(
        notificationId
    ) {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/notifications/${notificationId}/read`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {

                console.error(
                    "Failed to mark notification as read"
                );


                return false;

            }


            return true;

        } catch (error) {

            console.error(
                "Mark notification read error:",
                error
            );


            return false;

        }

    }



    // ========================================================
    // MARK ALL NOTIFICATIONS AS READ
    // ========================================================

    async function markAllNotificationsRead() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/notifications/read-all`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {

                console.error(
                    "Failed to mark all notifications as read"
                );


                return false;

            }


            return true;

        } catch (error) {

            console.error(
                "Mark all notifications read error:",
                error
            );


            return false;

        }

    }



    // ========================================================
    // ESCAPE HTML
    // ========================================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }



    // ========================================================
    // FORMAT DATE
    // ========================================================

    function formatNotificationDate(
        date
    ) {

        if (!date) {
            return "";
        }


        try {

            return new Date(
                date
            ).toLocaleString(
                "en-IN",
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            );

        } catch (error) {

            return date;

        }

    }



    // ========================================================
    // INITIALIZE
    // ========================================================

    function initializeNotifications() {

        createNotificationUI();


        // Load unread count immediately

        loadUnreadCount();


        /*
         * Check for new notifications
         * every 30 seconds.
         */

        setInterval(
            loadUnreadCount,
            30000
        );

    }



    // ========================================================
    // START
    // ========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeNotifications
        );

    } else {

        initializeNotifications();

    }


})();