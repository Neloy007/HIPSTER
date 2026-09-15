/* =========================================================
   HIPSTER — MEGA MENU
   Handles:
   - New In mega menu
   - Hover behavior
   - Keyboard accessibility
   - Escape key
   - Account dropdown
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMegaMenus();

    initializeAccountDropdown();

});


/* =========================================================
   CATEGORY MEGA MENUS
========================================================= */

function initializeMegaMenus() {

    const navItems = document.querySelectorAll(
        ".nav-item.has-mega"
    );

    let closeTimer = null;


    navItems.forEach(function (item) {

        const panel = item.querySelector(".mega-panel");


        if (!panel) {
            return;
        }


        /* =====================================================
           OPEN MEGA MENU ON HOVER
        ===================================================== */

        item.addEventListener("mouseenter", function () {

            clearTimeout(closeTimer);

            closeAllMegaMenus();

            item.classList.add("mega-open");

            panel.classList.add("mega-visible");

        });


        /* =====================================================
           CLOSE MEGA MENU WHEN MOUSE LEAVES
        ===================================================== */

        item.addEventListener("mouseleave", function () {

            closeTimer = setTimeout(function () {

                item.classList.remove("mega-open");

                panel.classList.remove("mega-visible");

            }, 150);

        });


        /* =====================================================
           KEEP MENU OPEN WHEN HOVERING PANEL
        ===================================================== */

        panel.addEventListener("mouseenter", function () {

            clearTimeout(closeTimer);

        });


        panel.addEventListener("mouseleave", function () {

            closeTimer = setTimeout(function () {

                item.classList.remove("mega-open");

                panel.classList.remove("mega-visible");

            }, 150);

        });


        /* =====================================================
           KEYBOARD ACCESSIBILITY
        ===================================================== */

        const trigger = item.querySelector(".nav-link");


        if (trigger) {

            trigger.addEventListener("focus", function () {

                clearTimeout(closeTimer);

                closeAllMegaMenus();

                item.classList.add("mega-open");

                panel.classList.add("mega-visible");

            });

        }

    });


    /* =====================================================
       CLOSE MENU WITH ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeAllMegaMenus();

        }

    });

}


/* =========================================================
   CLOSE ALL MEGA MENUS
========================================================= */

function closeAllMegaMenus() {

    const openItems = document.querySelectorAll(
        ".nav-item.has-mega.mega-open"
    );


    openItems.forEach(function (item) {

        item.classList.remove("mega-open");


        const panel = item.querySelector(".mega-panel");


        if (panel) {

            panel.classList.remove("mega-visible");

        }

    });

}


/* =========================================================
   ACCOUNT DROPDOWN
=========================================================

   This works if your HTML contains:

   <button id="accountButton">
       ...
   </button>

   <div
       class="account-dropdown"
       id="accountDropdown"
   >
       ...
   </div>

========================================================= */

function initializeAccountDropdown() {

    const accountButton =
        document.getElementById("accountButton");

    const accountDropdown =
        document.getElementById("accountDropdown");


    /* =====================================================
       STOP IF ACCOUNT DROPDOWN DOES NOT EXIST
    ===================================================== */

    if (!accountButton || !accountDropdown) {

        return;

    }


    let hoverTimer = null;


    /* =====================================================
       OPEN DROPDOWN
    ===================================================== */

    function openDropdown() {

        clearTimeout(hoverTimer);

        accountDropdown.classList.add("mega-visible");

    }


    /* =====================================================
       CLOSE DROPDOWN
    ===================================================== */

    function scheduleClose() {

        hoverTimer = setTimeout(function () {

            accountDropdown.classList.remove(
                "mega-visible"
            );

        }, 150);

    }


    /* =====================================================
       MOUSE EVENTS
    ===================================================== */

    accountButton.addEventListener(
        "mouseenter",
        openDropdown
    );


    accountButton.addEventListener(
        "mouseleave",
        scheduleClose
    );


    accountDropdown.addEventListener(
        "mouseenter",
        function () {

            clearTimeout(hoverTimer);

        }
    );


    accountDropdown.addEventListener(
        "mouseleave",
        scheduleClose
    );


    /* =====================================================
       CLICK / TOUCH
    ===================================================== */

    accountButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            accountDropdown.classList.toggle(
                "mega-visible"
            );

        }
    );


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const clickedInside =
                accountButton.contains(event.target) ||
                accountDropdown.contains(event.target);


            if (!clickedInside) {

                accountDropdown.classList.remove(
                    "mega-visible"
                );

            }

        }
    );


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    accountButton.addEventListener(
        "focus",
        function () {

            openDropdown();

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                accountDropdown.classList.remove(
                    "mega-visible"
                );

            }

        }
    );

}