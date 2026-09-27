/* =========================================================
   HIPSTER
   Storefront Products
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadStorefrontProducts();
});


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadStorefrontProducts() {

    const productContainer =
        document.getElementById("latestProducts");

    if (!productContainer) {
        console.error(
            "latestProducts container was not found."
        );

        return;
    }

    try {

        console.log(
            "Loading products from HIPSTER API..."
        );

        const products =
            await getProducts();

        console.log(
            "Products received:",
            products
        );

        if (!products.length) {

            productContainer.innerHTML = `
                <div class="storefront-empty-message">
                    No products are available right now.
                </div>
            `;

            return;
        }

        renderStorefrontProducts(
            productContainer,
            products
        );

    } catch (error) {

        console.error(
            "Failed to load storefront products:",
            error
        );

        productContainer.innerHTML = `
            <div class="storefront-error-message">
                Unable to load products right now.
            </div>
        `;
    }
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderStorefrontProducts(
    container,
    products
) {

    container.innerHTML = "";

    products.forEach((product) => {

        const productCard =
            createProductCard(product);

        container.appendChild(
            productCard
        );

    });
}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const article =
        document.createElement("article");

    article.className =
        "product-card";


    /* -----------------------------------------------------
       PRODUCT IMAGE
    ----------------------------------------------------- */

    const imageLink =
        document.createElement("a");

    imageLink.href = "#";

    imageLink.className =
        "product-image-link";


    const image =
        document.createElement("img");


    const imageUrl =
        getProductImage(product);


    if (imageUrl) {

        image.src =
            imageUrl;

    } else {

        image.src =
            "images/product-1.jpeg";
    }


    image.alt =
        product.name ||
        "HIPSTER product";


    imageLink.appendChild(
        image
    );


    /* -----------------------------------------------------
       PRODUCT INFORMATION
    ----------------------------------------------------- */

    const productInfo =
        document.createElement("div");

    productInfo.className =
        "product-info";


    const productName =
        document.createElement("h3");

    productName.textContent =
        product.name ||
        "Unnamed product";


    const productPrice =
        document.createElement("p");

    productPrice.className =
        "product-price";


    const price =
        Number(product.price);


    if (Number.isFinite(price)) {

        productPrice.textContent =
            `$${price.toFixed(2)}`;

    } else {

        productPrice.textContent =
            "$0.00";
    }


    /* -----------------------------------------------------
       BUILD CARD
    ----------------------------------------------------- */

    productInfo.appendChild(
        productName
    );

    productInfo.appendChild(
        productPrice
    );


    article.appendChild(
        imageLink
    );

    article.appendChild(
        productInfo
    );


    return article;
}


/* =========================================================
   GET PRODUCT IMAGE
========================================================= */

function getProductImage(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        const firstImage =
            product.images[0];

        if (
            typeof firstImage === "string"
        ) {

            return firstImage;
        }

        if (
            firstImage &&
            typeof firstImage.url === "string"
        ) {

            return firstImage.url;
        }
    }


    if (
        typeof product.image === "string" &&
        product.image.trim() !== ""
    ) {

        return product.image;
    }


    if (
        typeof product.imageUrl === "string" &&
        product.imageUrl.trim() !== ""
    ) {

        return product.imageUrl;
    }


    return null;
}