/* =========================================================
   HIPSTER — MEGA MENU
   Handles:
   - New In mega menu
   - Hover behavior
   - Keyboard accessibility
   - Escape key
========================================================= */


/* =========================================================
   WAIT FOR PAGE TO LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMegaMenus();

});


/* =========================================================
   CATEGORY MEGA MENUS
========================================================= */

function initializeMegaMenus() {

    const navItems =
        document.querySelectorAll(
            ".nav-item.has-mega"
        );

    let closeTimer = null;


    /* =====================================================
       INITIALIZE EACH MEGA MENU
    ===================================================== */

    navItems.forEach(function (item) {

        const panel =
            item.querySelector(".mega-panel");


        if (!panel) {

            return;

        }


        /* =====================================================
           OPEN MEGA MENU ON HOVER
        ===================================================== */

        item.addEventListener(
            "mouseenter",
            function () {

                clearTimeout(closeTimer);

                closeAllMegaMenus();

                item.classList.add(
                    "mega-open"
                );

                panel.classList.add(
                    "mega-visible"
                );

            }
        );


        /* =====================================================
           CLOSE MEGA MENU WHEN MOUSE LEAVES
        ===================================================== */

        item.addEventListener(
            "mouseleave",
            function () {

                closeTimer =
                    setTimeout(
                        function () {

                            item.classList.remove(
                                "mega-open"
                            );

                            panel.classList.remove(
                                "mega-visible"
                            );

                        },
                        150
                    );

            }
        );


        /* =====================================================
           KEEP MENU OPEN WHEN HOVERING PANEL
        ===================================================== */

        panel.addEventListener(
            "mouseenter",
            function () {

                clearTimeout(
                    closeTimer
                );

            }
        );


        /* =====================================================
           CLOSE WHEN LEAVING PANEL
        ===================================================== */

        panel.addEventListener(
            "mouseleave",
            function () {

                closeTimer =
                    setTimeout(
                        function () {

                            item.classList.remove(
                                "mega-open"
                            );

                            panel.classList.remove(
                                "mega-visible"
                            );

                        },
                        150
                    );

            }
        );


        /* =====================================================
           KEYBOARD / FOCUS ACCESSIBILITY
        ===================================================== */

        const trigger =
            item.querySelector(
                ".nav-link"
            );


        if (trigger) {

            trigger.addEventListener(
                "focus",
                function () {

                    clearTimeout(
                        closeTimer
                    );

                    closeAllMegaMenus();

                    item.classList.add(
                        "mega-open"
                    );

                    panel.classList.add(
                        "mega-visible"
                    );

                }
            );

        }

    });


    /* =====================================================
       CLOSE MENU WITH ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeAllMegaMenus();

            }

        }
    );

}


/* =========================================================
   CLOSE ALL MEGA MENUS
========================================================= */

function closeAllMegaMenus() {

    const openItems =
        document.querySelectorAll(
            ".nav-item.has-mega.mega-open"
        );


    openItems.forEach(
        function (item) {

            item.classList.remove(
                "mega-open"
            );


            const panel =
                item.querySelector(
                    ".mega-panel"
                );


            if (panel) {

                panel.classList.remove(
                    "mega-visible"
                );

            }

        }
    );

}