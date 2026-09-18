/* =========================================================
   HIPSTER ADMIN DASHBOARD
   Admin JavaScript
========================================================= */

const AUTH_API_URL =
    "http://localhost:5000/api/auth/me";


/* =========================================================
   INITIALIZE DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
           Authentication must be checked first.

           If the admin is not authenticated,
           the user will be redirected to login.html.
        */

        const isAuthenticated =
            await verifyAdminAuthentication();


        if (!isAuthenticated) {
            return;
        }


        /*
           Initialize dashboard functionality
           only after authentication succeeds.
        */

        initializeMobileMenu();
        initializeLogout();
        initializeAdminSearch();
        initializeSalesPeriod();
        initializeProfileButton();
        initializeActiveNavigation();

    }
);


/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

async function verifyAdminAuthentication() {

    const token =
        localStorage.getItem(
            "hipsterAdminToken"
        );


    /*
       No token means the admin is not logged in.
    */

    if (!token) {

        redirectToLogin();

        return false;

    }


    try {

        const response =
            await fetch(
                AUTH_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        let data = null;


        try {

            data = await response.json();

        } catch (error) {

            data = null;

        }


        /*
           Token is invalid or expired.
        */

        if (!response.ok) {

            clearAdminSession();

            redirectToLogin();

            return false;

        }


        const user =
            data?.data?.user;


        /*
           Make sure the backend returned
           a valid user.
        */

        if (!user) {

            clearAdminSession();

            redirectToLogin();

            return false;

        }


        /*
           Only ADMIN accounts can access
           the admin dashboard.
        */

        if (user.role !== "ADMIN") {

            clearAdminSession();

            alert(
                "You do not have permission to access the admin panel."
            );

            redirectToLogin();

            return false;

        }


        /*
           Save the latest user information.

           This keeps the admin information in
           localStorage synchronized with MongoDB.
        */

        localStorage.setItem(
            "hipsterAdminUser",
            JSON.stringify(user)
        );


        /*
           Display admin information if the
           corresponding elements exist.
        */

        displayAdminInformation(user);


        return true;


    } catch (error) {

        console.error(
            "Authentication verification failed:",
            error
        );


        /*
           If the backend cannot be reached,
           do not automatically delete the token.

           This prevents a temporary server/network
           problem from destroying the local session.
        */

        showAuthenticationError();

        return false;

    }

}


/* =========================================================
   DISPLAY ADMIN INFORMATION
========================================================= */

function displayAdminInformation(user) {

    if (!user) {
        return;
    }


    /*
       These elements are optional.

       If they exist on the page, they will
       automatically receive the admin information.
    */

    const adminNameElements =
        document.querySelectorAll(
            "[data-admin-name]"
        );


    adminNameElements.forEach(
        function (element) {

            element.textContent =
                user.name || "Admin";

        }
    );


    const adminEmailElements =
        document.querySelectorAll(
            "[data-admin-email]"
        );


    adminEmailElements.forEach(
        function (element) {

            element.textContent =
                user.email || "";

        }
    );


    /*
       Also update common profile elements
       if they already exist in the dashboard.
    */

    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            user.name || "Admin";

    }


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    if (profileEmail) {

        profileEmail.textContent =
            user.email || "";

    }

}


/* =========================================================
   CLEAR ADMIN SESSION
========================================================= */

function clearAdminSession() {

    localStorage.removeItem(
        "hipsterAdminToken"
    );

    localStorage.removeItem(
        "hipsterAdminUser"
    );

}


/* =========================================================
   REDIRECT TO LOGIN
========================================================= */

function redirectToLogin() {

    /*
       Prevent repeatedly redirecting if
       we are already on the login page.
    */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (currentPage === "login.html") {
        return;
    }


    window.location.href =
        "login.html";

}


/* =========================================================
   AUTHENTICATION ERROR
========================================================= */

function showAuthenticationError() {

    const existingMessage =
        document.querySelector(
            ".authentication-error"
        );


    if (existingMessage) {
        return;
    }


    const message =
        document.createElement("div");


    message.className =
        "authentication-error";


    message.textContent =
        "Unable to verify your session. Please make sure the backend server is running.";


    message.style.position =
        "fixed";

    message.style.top =
        "20px";

    message.style.right =
        "20px";

    message.style.zIndex =
        "99999";

    message.style.padding =
        "14px 18px";

    message.style.background =
        "#fff7ed";

    message.style.border =
        "1px solid #fed7aa";

    message.style.color =
        "#9a3412";

    message.style.borderRadius =
        "8px";

    message.style.fontSize =
        "13px";

    message.style.fontWeight =
        "600";


    document.body.appendChild(
        message
    );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    /*
       Close sidebar when clicking outside it
       on smaller screens.
    */

    document.addEventListener(
        "click",
        function (event) {

            const clickedElement =
                event.target;


            if (
                window.innerWidth <= 950 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(clickedElement) &&
                !menuButton.contains(clickedElement)
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            /*
               JWTs are stateless.

               Removing the token from localStorage
               logs the admin out of this browser.
            */

            clearAdminSession();


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   ADMIN SEARCH
========================================================= */

function initializeAdminSearch() {

    const searchInput =
        document.getElementById(
            "adminSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                clearSearchHighlight();

                return;

            }


            /*
               Dashboard search will later be connected
               to products, customers and orders.

               For now, this simply searches visible
               dashboard text.
            */

            searchDashboardContent(
                searchValue
            );

        }
    );

}


/* =========================================================
   SEARCH DASHBOARD CONTENT
========================================================= */

function searchDashboardContent(
    searchValue
) {

    const searchableElements =
        document.querySelectorAll(
            ".dashboard-content h2, " +
            ".dashboard-content h3, " +
            ".dashboard-content strong, " +
            ".dashboard-content td"
        );


    searchableElements.forEach(
        function (element) {

            const text =
                element.textContent
                    ? element.textContent.toLowerCase()
                    : "";


            if (
                text.includes(
                    searchValue
                )
            ) {

                element.style.transition =
                    "background 0.2s ease";

                element.style.background =
                    "#eeeeee";

            } else {

                element.style.background =
                    "";

            }

        }
    );

}


/* =========================================================
   CLEAR SEARCH HIGHLIGHT
========================================================= */

function clearSearchHighlight() {

    const searchableElements =
        document.querySelectorAll(
            ".dashboard-content h2, " +
            ".dashboard-content h3, " +
            ".dashboard-content strong, " +
            ".dashboard-content td"
        );


    searchableElements.forEach(
        function (element) {

            element.style.background =
                "";

        }
    );

}


/* =========================================================
   SALES PERIOD
========================================================= */

function initializeSalesPeriod() {

    const salesPeriod =
        document.getElementById(
            "salesPeriod"
        );


    if (!salesPeriod) {
        return;
    }


    salesPeriod.addEventListener(
        "change",
        function () {

            const selectedPeriod =
                salesPeriod.value;


            updateSalesChart(
                selectedPeriod
            );

        }
    );

}


/* =========================================================
   UPDATE SALES CHART
========================================================= */

function updateSalesChart(
    period
) {

    const chartBars =
        document.querySelectorAll(
            ".chart-bar"
        );


    /*
       Temporary demo data.

       Later these values will come from
       the backend analytics API.
    */

    const chartData = {

        "7": [
            40,
            55,
            48,
            68,
            61,
            82,
            74
        ],

        "30": [
            45,
            62,
            51,
            74,
            68,
            86,
            78
        ],

        "90": [
            52,
            67,
            58,
            81,
            72,
            91,
            84
        ],

        "365": [
            48,
            70,
            63,
            76,
            82,
            94,
            88
        ]

    };


    const selectedData =
        chartData[period] ||
        chartData["30"];


    chartBars.forEach(
        function (bar, index) {

            if (
                selectedData[index] !==
                undefined
            ) {

                bar.style.height =
                    selectedData[index] +
                    "%";

            }

        }
    );

}


/* =========================================================
   ADMIN PROFILE
========================================================= */

function initializeProfileButton() {

    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (!profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        function () {

            const storedUser =
                localStorage.getItem(
                    "hipsterAdminUser"
                );


            if (!storedUser) {

                console.log(
                    "No admin profile information found."
                );

                return;

            }


            try {

                const user =
                    JSON.parse(
                        storedUser
                    );


                console.log(
                    "HIPSTER Admin profile:",
                    {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                );


            } catch (error) {

                console.error(
                    "Unable to read admin profile:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   SIDEBAR ACTIVE LINK
========================================================= */

function initializeActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    navLinks.forEach(
        function (link) {

            const linkPage =
                link.getAttribute(
                    "href"
                );


            if (
                linkPage &&
                linkPage === currentPage
            ) {

                navLinks.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {

        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        if (!sidebar) {
            return;
        }


        /*
           Automatically close mobile sidebar
           when returning to desktop size.
        */

        if (
            window.innerWidth > 950
        ) {

            sidebar.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   ADMIN DASHBOARD READY
========================================================= */

console.log(
    "HIPSTER Admin Dashboard initialized successfully."
);