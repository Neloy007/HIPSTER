/* =========================================================
   HIPSTER
   Storefront Categories
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadStorefrontCategories();
});


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadStorefrontCategories() {

    try {

        console.log(
            "Loading categories from HIPSTER API..."
        );

        const categories =
            await getCategories();

        console.log(
            "Categories received:",
            categories
        );

        if (!categories.length) {

            console.log(
                "No active categories found."
            );

            return;
        }

        renderStorefrontCategories(
            categories
        );

    } catch (error) {

        console.error(
            "Failed to load storefront categories:",
            error
        );
    }
}


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderStorefrontCategories(
    categories
) {

    /*
     * Find the main storefront navigation.
     */

    const navigation =
        document.querySelector(
            ".main-navigation"
        );

    if (!navigation) {

        console.warn(
            "Main navigation container was not found."
        );

        return;
    }


    /*
     * Find existing category links.
     *
     * We keep the surrounding navigation
     * structure and only replace category
     * links that point to category sections.
     */

    const categoryLinks =
        navigation.querySelectorAll(
            'a[href^="#"]'
        );


    /*
     * Create a lookup of real MongoDB
     * categories.
     */

    const categoryMap =
        new Map();

    categories.forEach((category) => {

        if (
            category &&
            category.name
        ) {

            categoryMap.set(
                category.name
                    .trim()
                    .toLowerCase(),
                category
            );
        }

    });


    /*
     * Log the available categories.
     *
     * We will use these IDs/slugs in
     * the next step.
     */

    categories.forEach((category) => {

        console.log(
            "MongoDB category:",
            {
                id: category._id,
                name: category.name,
                slug: category.slug
            }
        );

    });


    /*
     * Do not modify the existing navigation
     * yet.
     *
     * This gives us a safe verification step
     * before connecting category filtering.
     */

    console.log(
        "Storefront category system is ready."
    );

}