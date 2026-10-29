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

    const sliderButtons =
        document.querySelectorAll(".slider-arrow");


    sliderButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const sliderId =
                    button.dataset.slider;

                const direction =
                    button.dataset.direction;


                const slider =
                    document.getElementById(
                        sliderId
                    );


                if (!slider) {

                    return;

                }


                /*
                 * Move approximately one product
                 * card at a time.
                 */

                const card =
                    slider.querySelector(
                        ".product-card"
                    );


                if (!card) {

                    return;

                }


                const cardWidth =
                    card.offsetWidth;


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

            }
        );

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

function initializeSliderDots(
    sliderId,
    dotsId
) {

    const slider =
        document.getElementById(
            sliderId
        );


    const dotsContainer =
        document.getElementById(
            dotsId
        );


    if (!slider || !dotsContainer) {

        return;

    }


    const dots =
        dotsContainer.querySelectorAll(
            ".slider-dot"
        );


    slider.addEventListener(
        "scroll",
        function () {

            const maxScroll =
                slider.scrollWidth -
                slider.clientWidth;


            if (maxScroll <= 0) {

                return;

            }


            const scrollPercentage =
                slider.scrollLeft /
                maxScroll;


            const activeIndex =
                Math.min(
                    dots.length - 1,
                    Math.floor(
                        scrollPercentage *
                        dots.length
                    )
                );


            dots.forEach(
                function (
                    dot,
                    index
                ) {

                    dot.classList.toggle(
                        "active",
                        index === activeIndex
                    );

                }
            );

        }
    );


    /*
     * Clicking dots.
     */

    dots.forEach(
        function (
            dot,
            index
        ) {

            dot.addEventListener(
                "click",
                function () {

                    const maxScroll =
                        slider.scrollWidth -
                        slider.clientWidth;


                    const targetPosition =
                        maxScroll *
                        (
                            index /
                            (dots.length - 1)
                        );


                    slider.scrollTo({

                        left:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (!searchInput || !searchButton) {

        return;

    }


    /*
     * Search button.
     */

    searchButton.addEventListener(
        "click",
        function () {

            performSearch(
                searchInput.value
            );

        }
    );


    /*
     * Press Enter to search.
     */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();


                performSearch(
                    searchInput.value
                );

            }

        }
    );

}


/* =========================================================
   PERFORM SEARCH
========================================================= */

function performSearch(query) {

    const searchTerm =
        query.trim().toLowerCase();


    if (searchTerm === "") {

        alert(
            "Please enter a product or brand to search."
        );

        return;

    }


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    let foundProducts = 0;


    products.forEach(
        function (product) {

            const productName =
                product
                    .querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";


            if (
                productName.includes(
                    searchTerm
                )
            ) {

                product.style.display =
                    "";

                foundProducts++;

            } else {

                product.style.display =
                    "none";

            }

        }
    );


    /*
     * If no product is found,
     * restore the products and show a message.
     */

    if (foundProducts === 0) {

        products.forEach(
            function (product) {

                product.style.display =
                    "";

            }
        );


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
        document.getElementById(
            "accountButton"
        );

    const wishlistButton =
        document.getElementById(
            "wishlistButton"
        );

    const cartButton =
        document.getElementById(
            "bagButton"
        );


    /* =====================================================
       ACCOUNT
    ===================================================== */

    if (accountButton) {

        updateAccountButton(
            accountButton
        );


        accountButton.addEventListener(
            "click",
            async function () {

                try {

                    const customer =
                        await getCurrentCustomer();


                    if (customer) {

                        window.location.href =
                            "account.html";

                    } else {

                        window.location.href =
                            "login.html";

                    }

                } catch (error) {

                    console.error(
                        "Account check failed:",
                        error
                    );

                    window.location.href =
                        "login.html";

                }

            }
        );

    }


    /* =====================================================
       WISHLIST
    ===================================================== */

    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            function () {

                alert(
                    "Wishlist feature coming soon."
                );

            }
        );

    }


    /* =====================================================
       CART
    ===================================================== */

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            function () {

                alert(
                    "Shopping cart feature coming soon."
                );

            }
        );

    }

}


/* =========================================================
   UPDATE ACCOUNT BUTTON
========================================================= */

async function updateAccountButton(
    accountButton
) {

    try {

        const customer =
            await getCurrentCustomer();


        if (customer) {

            const customerName =
                customer.name ||
                customer.email ||
                "Account";


            accountButton.setAttribute(
                "title",
                `Signed in as ${customerName}`
            );


            accountButton.setAttribute(
                "aria-label",
                `Account: ${customerName}`
            );

        } else {

            accountButton.setAttribute(
                "title",
                "Sign in"
            );


            accountButton.setAttribute(
                "aria-label",
                "Sign in"
            );

        }

    } catch (error) {

        console.error(
            "Unable to update account button:",
            error
        );

    }

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initializeNewsletter() {

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );


    const emailInput =
        document.getElementById(
            "emailInput"
        );


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


            if (
                !emailPattern.test(
                    email
                )
            ) {

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


    navigationLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    /*
                     * Gender navigation.
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
                            .forEach(
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
    );


    /*
     * Smooth scrolling for internal links.
     */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


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

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                }
            );

        }
    );

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
        document.getElementById(
            "cartCount"
        );


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


    products.forEach(
        function (product) {

            product.style.display =
                "";

        }
    );

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
   CATEGORY MEGA MENUS
   NOTE:
   The actual mega-menu initialization is handled
   by js/mega-menu.js.
   
   Do NOT duplicate initializeMegaMenus() here.
========================================================= */