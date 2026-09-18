/* =========================================================
   HIPSTER ADMIN DASHBOARD
   Admin JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeLogout();
    initializeAdminSearch();
    initializeSalesPeriod();
    initializeProfileButton();

});


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeMobileMenu() {

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.querySelector(".sidebar");

    if (!menuButton || !sidebar) {
        return;
    }

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });


    /*
       Close sidebar when clicking outside it
       on smaller screens.
    */

    document.addEventListener("click", function (event) {

        const clickedElement = event.target;

        if (
            window.innerWidth <= 950 &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(clickedElement) &&
            !menuButton.contains(clickedElement)
        ) {
            sidebar.classList.remove("open");
        }

    });

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", function () {

        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) {
            return;
        }


        /*
           We will later replace this with
           real JWT logout/session handling.
        */

        localStorage.removeItem("hipsterAdminToken");
        localStorage.removeItem("hipsterAdminUser");

        window.location.href = "login.html";

    });

}


/* =========================================================
   ADMIN SEARCH
========================================================= */

function initializeAdminSearch() {

    const searchInput = document.getElementById("adminSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value
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

        searchDashboardContent(searchValue);

    });

}


/* =========================================================
   SEARCH DASHBOARD CONTENT
========================================================= */

function searchDashboardContent(searchValue) {

    const searchableElements = document.querySelectorAll(
        ".dashboard-content h2, " +
        ".dashboard-content h3, " +
        ".dashboard-content strong, " +
        ".dashboard-content td"
    );


    searchableElements.forEach(function (element) {

        const text = element.textContent
            ? element.textContent.toLowerCase()
            : "";


        if (text.includes(searchValue)) {

            element.style.transition =
                "background 0.2s ease";

            element.style.background =
                "#eeeeee";

        } else {

            element.style.background =
                "";

        }

    });

}


/* =========================================================
   CLEAR SEARCH HIGHLIGHT
========================================================= */

function clearSearchHighlight() {

    const searchableElements = document.querySelectorAll(
        ".dashboard-content h2, " +
        ".dashboard-content h3, " +
        ".dashboard-content strong, " +
        ".dashboard-content td"
    );


    searchableElements.forEach(function (element) {

        element.style.background = "";

    });

}


/* =========================================================
   SALES PERIOD
========================================================= */

function initializeSalesPeriod() {

    const salesPeriod = document.getElementById("salesPeriod");

    if (!salesPeriod) {
        return;
    }

    salesPeriod.addEventListener("change", function () {

        const selectedPeriod = salesPeriod.value;

        updateSalesChart(selectedPeriod);

    });

}


/* =========================================================
   UPDATE SALES CHART
========================================================= */

function updateSalesChart(period) {

    const chartBars = document.querySelectorAll(
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
        chartData[period] || chartData["30"];


    chartBars.forEach(function (bar, index) {

        if (selectedData[index] !== undefined) {

            bar.style.height =
                selectedData[index] + "%";

        }

    });

}


/* =========================================================
   ADMIN PROFILE
========================================================= */

function initializeProfileButton() {

    const profileButton =
        document.getElementById("profileButton");

    if (!profileButton) {
        return;
    }

    profileButton.addEventListener("click", function () {

        /*
           Profile dropdown will be added later.

           For now we simply show the current
           admin account information.
        */

        console.log(
            "HIPSTER Admin profile clicked."
        );

    });

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
        document.querySelectorAll(".nav-link");


    navLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href");


        if (
            linkPage &&
            linkPage === currentPage
        ) {

            navLinks.forEach(function (item) {

                item.classList.remove("active");

            });

            link.classList.add("active");

        }

    });

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener("resize", function () {

    const sidebar =
        document.querySelector(".sidebar");


    if (!sidebar) {
        return;
    }


    /*
       Automatically close mobile sidebar
       when returning to desktop size.
    */

    if (window.innerWidth > 950) {

        sidebar.classList.remove("open");

    }

});


/* =========================================================
   ADMIN DASHBOARD READY
========================================================= */

console.log(
    "HIPSTER Admin Dashboard initialized successfully."
);