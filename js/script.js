/* =========================================================
   HIPSTER
   Main JavaScript
========================================================= */


/* =========================================================
   WAIT FOR PAGE TO LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeSliders();
    initializeSearch();
    initializeHeaderButtons();
    initializeNewsletter();
    initializeNavigation();

});


/* =========================================================
   PRODUCT SLIDERS
========================================================= */

function initializeSliders() {

    const sliderButtons = document.querySelectorAll(".slider-arrow");

    sliderButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const sliderId = button.dataset.slider;
            const direction = button.dataset.direction;

            const slider = document.getElementById(sliderId);

            if (!slider) {
                return;
            }

            /*
             * Move approximately one product card at a time.
             */
            const card = slider.querySelector(".product-card");

            if (!card) {
                return;
            }

            const cardWidth = card.offsetWidth;

            if (direction === "next") {

                slider.scrollBy({
                    left: cardWidth,
                    behavior: "smooth"
                });

            } else {

                slider.scrollBy({
                    left: -cardWidth,
                    behavior: "smooth"
                });

            }

        });

    });


    /*
     * Update dots while scrolling.
     */

    initializeSliderDots(
        "latestProducts",
        "latestDots"
    );

    initializeSliderDots(
        "shirtProducts",
        "shirtDots"
    );

}


/* =========================================================
   SLIDER DOTS
========================================================= */

function initializeSliderDots(sliderId, dotsId) {

    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);

    if (!slider || !dotsContainer) {
        return;
    }

    const dots = dotsContainer.querySelectorAll(".slider-dot");

    slider.addEventListener("scroll", function () {

        const maxScroll =
            slider.scrollWidth - slider.clientWidth;

        if (maxScroll <= 0) {
            return;
        }

        const scrollPercentage =
            slider.scrollLeft / maxScroll;

        const activeIndex = Math.min(
            dots.length - 1,
            Math.floor(scrollPercentage * dots.length)
        );

        dots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === activeIndex
            );

        });

    });


    /*
     * Clicking dots.
     */

    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            const maxScroll =
                slider.scrollWidth - slider.clientWidth;

            const targetPosition =
                maxScroll * (index / (dots.length - 1));

            slider.scrollTo({
                left: targetPosition,
                behavior: "smooth"
            });

        });

    });

}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");

    if (!searchInput || !searchButton) {
        return;
    }


    /*
     * Search button.
     */

    searchButton.addEventListener("click", function () {

        performSearch(searchInput.value);

    });


    /*
     * Press Enter to search.
     */

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            performSearch(searchInput.value);

        }

    });

}


/* =========================================================
   PERFORM SEARCH
========================================================= */

function performSearch(query) {

    const searchTerm =
        query.trim().toLowerCase();

    if (searchTerm === "") {

        alert("Please enter a product or brand to search.");

        return;
    }


    const products =
        document.querySelectorAll(".product-card");

    let foundProducts = 0;


    products.forEach(function (product) {

        const productName =
            product
                .querySelector("h3")
                ?.textContent
                .toLowerCase() || "";

        if (productName.includes(searchTerm)) {

            product.style.display = "";

            foundProducts++;

        } else {

            product.style.display = "none";

        }

    });


    /*
     * If no product is found, restore the products
     * and show a message.
     */

    if (foundProducts === 0) {

        products.forEach(function (product) {

            product.style.display = "";

        });

        alert(
            `No products found for "${query}".`
        );

    }

}


/* =========================================================
   HEADER BUTTONS
========================================================= */

function initializeHeaderButtons() {

    const accountButton =
        document.getElementById("accountButton");

    const wishlistButton =
        document.getElementById("wishlistButton");

    const bagButton =
        document.getElementById("bagButton");


    /*
     * Account
     */

    if (accountButton) {

        accountButton.addEventListener(
            "click",
            function () {

                alert(
                    "Account feature coming soon."
                );

            }
        );

    }


    /*
     * Wishlist
     */

    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            function () {

                alert(
                    "Your wishlist is currently empty."
                );

            }
        );

    }


    /*
     * Shopping Bag
     */

    if (bagButton) {

        bagButton.addEventListener(
            "click",
            function () {

                alert(
                    "Your shopping bag is empty."
                );

            }
        );

    }

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initializeNewsletter() {

    const newsletterForm =
        document.getElementById("newsletterForm");

    const emailInput =
        document.getElementById("emailInput");


    if (!newsletterForm || !emailInput) {
        return;
    }


    newsletterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value.trim();


            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            /*
             * Basic email validation.
             */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /*
             * Demo subscription.
             */

            alert(
                "Thanks for subscribing to HIPSTER!"
            );


            emailInput.value = "";

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            ".category-menu a, .gender-link"
        );


    navigationLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                /*
                 * Gender navigation
                 */

                if (
                    link.classList.contains(
                        "gender-link"
                    )
                ) {

                    document
                        .querySelectorAll(
                            ".gender-link"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "active"
                            );

                        });


                    link.classList.add("active");

                }

            }
        );

    });


    /*
     * Smooth scrolling for internal links.
     */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });

}


/* =========================================================
   ADD TO CART SYSTEM
   Basic foundation for future product pages
========================================================= */

let cartCount = 0;


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addToCart() {

    cartCount++;

    updateCartCount();

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cartCounter =
        document.getElementById("cartCount");


    if (cartCounter) {

        cartCounter.textContent =
            cartCount;

    }

}


/* =========================================================
   RESET PRODUCT FILTER
========================================================= */

function resetProductFilter() {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(function (product) {

        product.style.display = "";

    });

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {

        /*
         * Currently no special resize logic is needed.
         *
         * CSS handles responsive layout.
         */

    }
);

/* =========================================================
   HIPSTER — MEGA MENU (shared behavior)
   Include this AFTER js/script.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMegaMenus();
    initializeAccountDropdown();

});


/* =========================================================
   CATEGORY MEGA MENUS
   Works for any element structured as:
   <div class="nav-item has-mega">
       <a class="nav-link">...</a>
       <div class="mega-panel">...</div>
   </div>
========================================================= */

function initializeMegaMenus() {

    const navItems =
        document.querySelectorAll(".nav-item.has-mega");

    let closeTimer = null;


    navItems.forEach(function (item) {

        const panel =
            item.querySelector(".mega-panel");

        if (!panel) {
            return;
        }


        /*
         * Open on hover, with a tiny delay so the panel
         * doesn't flicker when moving across the nav bar.
         */

        item.addEventListener("mouseenter", function () {

            clearTimeout(closeTimer);

            closeAllMegaMenus();

            item.classList.add("mega-open");
            panel.classList.add("mega-visible");

        });


        /*
         * Close on leave, with a short delay so the user can
         * move the cursor diagonally down into the panel
         * without it closing.
         */

        item.addEventListener("mouseleave", function () {

            closeTimer = setTimeout(function () {

                item.classList.remove("mega-open");
                panel.classList.remove("mega-visible");

            }, 150);

        });


        /*
         * Keep it open while hovering the panel itself.
         */

        panel.addEventListener("mouseenter", function () {

            clearTimeout(closeTimer);

        });

        panel.addEventListener("mouseleave", function () {

            closeTimer = setTimeout(function () {

                item.classList.remove("mega-open");
                panel.classList.remove("mega-visible");

            }, 150);

        });


        /*
         * Keyboard / focus accessibility.
         */

        const trigger =
            item.querySelector(".nav-link");

        if (trigger) {

            trigger.addEventListener("focus", function () {

                closeAllMegaMenus();

                item.classList.add("mega-open");
                panel.classList.add("mega-visible");

            });

        }

    });


    /*
     * Close everything if focus/hover leaves the nav bar
     * entirely (e.g. Escape key).
     */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeAllMegaMenus();

        }

    });

}


function closeAllMegaMenus() {

    document
        .querySelectorAll(".nav-item.has-mega.mega-open")
        .forEach(function (item) {

            item.classList.remove("mega-open");

            const panel =
                item.querySelector(".mega-panel");

            if (panel) {

                panel.classList.remove("mega-visible");

            }

        });

}


/* =========================================================
   ACCOUNT DROPDOWN
   Works for:
   <button id="accountButton">...</button>
   <div class="account-dropdown" id="accountDropdown">...</div>
========================================================= */

function initializeAccountDropdown() {

    const accountButton =
        document.getElementById("accountButton");

    const accountDropdown =
        document.getElementById("accountDropdown");

    if (!accountButton || !accountDropdown) {
        return;
    }


    let hoverTimer = null;


    function openDropdown() {

        clearTimeout(hoverTimer);

        accountDropdown.classList.add("mega-visible");

    }

    function scheduleClose() {

        hoverTimer = setTimeout(function () {

            accountDropdown.classList.remove("mega-visible");

        }, 150);

    }


    accountButton.addEventListener("mouseenter", openDropdown);
    accountButton.addEventListener("mouseleave", scheduleClose);

    accountDropdown.addEventListener("mouseenter", function () {

        clearTimeout(hoverTimer);

    });

    accountDropdown.addEventListener("mouseleave", scheduleClose);


    /*
     * Also support click/tap, for touch devices and keyboard use.
     */

    accountButton.addEventListener("click", function (event) {

        event.preventDefault();

        accountDropdown.classList.toggle("mega-visible");

    });


    document.addEventListener("click", function (event) {

        const clickedInside =
            accountButton.contains(event.target) ||
            accountDropdown.contains(event.target);

        if (!clickedInside) {

            accountDropdown.classList.remove("mega-visible");

        }

    });

}