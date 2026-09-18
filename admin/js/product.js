/* =========================================================
   HIPSTER ADMIN - PRODUCTS
========================================================= */

const PRODUCTS_API_URL = "http://localhost:5000/api/products";
const CATEGORIES_API_URL = "http://localhost:5000/api/categories";

const PRODUCTS_PER_PAGE = 10;


/* =========================================================
   STATE
========================================================= */

let products = [];
let categories = [];

let filteredProducts = [];

let currentPage = 1;

let editingProductId = null;
let deletingProductId = null;

let toastTimeout = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productsTableBody =
    document.getElementById("productsTableBody");

const productsLoading =
    document.getElementById("productsLoading");

const productsError =
    document.getElementById("productsError");

const productsErrorMessage =
    document.getElementById("productsErrorMessage");

const productsEmpty =
    document.getElementById("productsEmpty");

const productsTableFooter =
    document.getElementById("productsTableFooter");

const productsResultsCount =
    document.getElementById("productsResultsCount");

const productsPagination =
    document.getElementById("productsPagination");

const totalProducts =
    document.getElementById("totalProducts");

const activeProducts =
    document.getElementById("activeProducts");

const outOfStockProducts =
    document.getElementById("outOfStockProducts");

const featuredProducts =
    document.getElementById("featuredProducts");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const stockFilter =
    document.getElementById("stockFilter");

const refreshProductsButton =
    document.getElementById("refreshProductsButton");

const retryProductsButton =
    document.getElementById("retryProductsButton");

const addProductButton =
    document.getElementById("addProductButton");

const emptyAddProductButton =
    document.getElementById("emptyAddProductButton");

const productModal =
    document.getElementById("productModal");

const productModalTitle =
    document.getElementById("productModalTitle");

const closeProductModalButton =
    document.getElementById("closeProductModalButton");

const cancelProductButton =
    document.getElementById("cancelProductButton");

const productForm =
    document.getElementById("productForm");

const productId =
    document.getElementById("productId");

const productName =
    document.getElementById("productName");

const productBrand =
    document.getElementById("productBrand");

const productCategory =
    document.getElementById("productCategory");

const productDescription =
    document.getElementById("productDescription");

const productPrice =
    document.getElementById("productPrice");

const productComparePrice =
    document.getElementById("productComparePrice");

const productStock =
    document.getElementById("productStock");

const productSku =
    document.getElementById("productSku");

const productSizes =
    document.getElementById("productSizes");

const productColorsEditor =
    document.getElementById("productColorsEditor");

const addColorButton =
    document.getElementById("addColorButton");

const productImages =
    document.getElementById("productImages");

const productFeatured =
    document.getElementById("productFeatured");

const productFormError =
    document.getElementById("productFormError");

const saveProductButton =
    document.getElementById("saveProductButton");

const deleteProductModal =
    document.getElementById("deleteProductModal");

const deleteProductName =
    document.getElementById("deleteProductName");

const cancelDeleteProductButton =
    document.getElementById("cancelDeleteProductButton");

const confirmDeleteProductButton =
    document.getElementById("confirmDeleteProductButton");

const adminToast =
    document.getElementById("adminToast");

const toastIcon =
    document.getElementById("toastIcon");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeProductsPage();
});


async function initializeProductsPage() {
    setupEventListeners();

    addColorRow();

    await loadCategories();

    await loadProducts();
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {

    /* Product search */

    if (productSearch) {
        productSearch.addEventListener(
            "input",
            handleFiltersChanged
        );
    }


    /* Category filter */

    if (categoryFilter) {
        categoryFilter.addEventListener(
            "change",
            handleFiltersChanged
        );
    }


    /* Status filter */

    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            handleFiltersChanged
        );
    }


    /* Stock filter */

    if (stockFilter) {
        stockFilter.addEventListener(
            "change",
            handleFiltersChanged
        );
    }


    /* Refresh */

    if (refreshProductsButton) {
        refreshProductsButton.addEventListener(
            "click",
            async () => {
                await refreshProducts();
            }
        );
    }


    /* Retry */

    if (retryProductsButton) {
        retryProductsButton.addEventListener(
            "click",
            async () => {
                await loadProducts();
            }
        );
    }


    /* Add product */

    if (addProductButton) {
        addProductButton.addEventListener(
            "click",
            () => {
                openAddProductModal();
            }
        );
    }


    if (emptyAddProductButton) {
        emptyAddProductButton.addEventListener(
            "click",
            () => {
                openAddProductModal();
            }
        );
    }


    /* Product modal */

    if (closeProductModalButton) {
        closeProductModalButton.addEventListener(
            "click",
            closeProductModal
        );
    }


    if (cancelProductButton) {
        cancelProductButton.addEventListener(
            "click",
            closeProductModal
        );
    }


    /* Modal overlay */

    document.addEventListener(
        "click",
        (event) => {

            const target = event.target;

            if (
                target instanceof HTMLElement &&
                target.hasAttribute(
                    "data-close-product-modal"
                )
            ) {
                closeProductModal();
            }

            if (
                target instanceof HTMLElement &&
                target.hasAttribute(
                    "data-close-delete-modal"
                )
            ) {
                closeDeleteModal();
            }
        }
    );


    /* Product form */

    if (productForm) {
        productForm.addEventListener(
            "submit",
            handleProductSubmit
        );
    }


    /* Add color */

    if (addColorButton) {
        addColorButton.addEventListener(
            "click",
            () => {
                addColorRow();
            }
        );
    }


    /* Delete modal */

    if (cancelDeleteProductButton) {
        cancelDeleteProductButton.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    if (confirmDeleteProductButton) {
        confirmDeleteProductButton.addEventListener(
            "click",
            confirmDeleteProduct
        );
    }


    /* Table actions */

    if (productsTableBody) {
        productsTableBody.addEventListener(
            "click",
            handleProductTableClick
        );
    }


    /* Escape key */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                productModal &&
                !productModal.hidden
            ) {
                closeProductModal();
            }

            if (
                deleteProductModal &&
                !deleteProductModal.hidden
            ) {
                closeDeleteModal();
            }
        }
    );
}


/* =========================================================
   AUTHENTICATION
========================================================= */

function getAdminToken() {
    return localStorage.getItem(
        "hipsterAdminToken"
    );
}


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    url,
    options = {}
) {
    const token = getAdminToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        url,
        {
            ...options,
            headers,
        }
    );

    let responseData = null;

    try {
        responseData = await response.json();
    } catch {
        responseData = null;
    }

    if (!response.ok) {

        const errorMessage =
            responseData?.message ||
            "Something went wrong";

        throw new Error(errorMessage);
    }

    return responseData;
}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories() {

    try {

        const response =
            await apiRequest(
                CATEGORIES_API_URL,
                {
                    method: "GET",
                }
            );

        categories =
            response?.data?.categories || [];

        populateCategoryFilters();

    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );

        showToast(
            error.message ||
            "Failed to load categories",
            "error"
        );
    }
}


/* =========================================================
   POPULATE CATEGORY FILTERS
========================================================= */

function populateCategoryFilters() {

    if (categoryFilter) {

        categoryFilter.innerHTML = `
            <option value="">
                All Categories
            </option>
        `;

        categories.forEach((category) => {

            const option =
                document.createElement("option");

            option.value = category._id;

            option.textContent = category.name;

            categoryFilter.appendChild(option);
        });
    }


    if (productCategory) {

        productCategory.innerHTML = `
            <option value="">
                Select category
            </option>
        `;

        categories.forEach((category) => {

            const option =
                document.createElement("option");

            option.value = category._id;

            option.textContent = category.name;

            productCategory.appendChild(option);
        });
    }
}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    showLoadingState();

    try {

        const response =
            await apiRequest(
                PRODUCTS_API_URL,
                {
                    method: "GET",
                }
            );

        products =
            response?.data?.products || [];

        updateSummary();

        applyFilters();

    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showProductsError(
            error.message ||
            "Failed to load products"
        );
    }
}


/* =========================================================
   REFRESH
========================================================= */

async function refreshProducts() {

    if (refreshProductsButton) {
        refreshProductsButton.disabled = true;
    }

    try {

        await loadCategories();

        await loadProducts();

        showToast(
            "Products refreshed successfully",
            "success"
        );

    } finally {

        if (refreshProductsButton) {
            refreshProductsButton.disabled = false;
        }
    }
}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const total =
        products.length;

    const active =
        products.filter(
            (product) =>
                product.isActive === true
        ).length;

    const outOfStock =
        products.filter(
            (product) =>
                Number(product.stock) === 0
        ).length;

    const featured =
        products.filter(
            (product) =>
                product.isFeatured === true
        ).length;


    if (totalProducts) {
        totalProducts.textContent = total;
    }

    if (activeProducts) {
        activeProducts.textContent = active;
    }

    if (outOfStockProducts) {
        outOfStockProducts.textContent =
            outOfStock;
    }

    if (featuredProducts) {
        featuredProducts.textContent =
            featured;
    }
}


/* =========================================================
   FILTER HANDLING
========================================================= */

function handleFiltersChanged() {

    currentPage = 1;

    applyFilters();
}


function applyFilters() {

    const searchTerm =
        productSearch?.value
            .trim()
            .toLowerCase() || "";

    const selectedCategory =
        categoryFilter?.value || "";

    const selectedStatus =
        statusFilter?.value || "";

    const selectedStock =
        stockFilter?.value || "";


    filteredProducts =
        products.filter((product) => {

            /* ---------------------------------------------
               SEARCH
            --------------------------------------------- */

            if (searchTerm) {

                const productName =
                    String(
                        product.name || ""
                    ).toLowerCase();

                const brand =
                    String(
                        product.brand || ""
                    ).toLowerCase();

                const sku =
                    String(
                        product.sku || ""
                    ).toLowerCase();

                const slug =
                    String(
                        product.slug || ""
                    ).toLowerCase();

                const matchesSearch =
                    productName.includes(searchTerm) ||
                    brand.includes(searchTerm) ||
                    sku.includes(searchTerm) ||
                    slug.includes(searchTerm);

                if (!matchesSearch) {
                    return false;
                }
            }


            /* ---------------------------------------------
               CATEGORY
            --------------------------------------------- */

            if (selectedCategory) {

                const productCategoryId =
                    getCategoryId(
                        product.category
                    );

                if (
                    productCategoryId !==
                    selectedCategory
                ) {
                    return false;
                }
            }


            /* ---------------------------------------------
               STATUS
            --------------------------------------------- */

            if (selectedStatus === "active") {

                if (product.isActive !== true) {
                    return false;
                }
            }

            if (selectedStatus === "inactive") {

                if (product.isActive !== false) {
                    return false;
                }
            }


            /* ---------------------------------------------
               STOCK
            --------------------------------------------- */

            const stock =
                Number(product.stock) || 0;

            if (
                selectedStock === "in-stock" &&
                stock <= 0
            ) {
                return false;
            }

            if (
                selectedStock === "low-stock" &&
                (
                    stock <= 0 ||
                    stock > 10
                )
            ) {
                return false;
            }

            if (
                selectedStock === "out-of-stock" &&
                stock !== 0
            ) {
                return false;
            }


            return true;
        });


    renderProducts();
}


/* =========================================================
   GET CATEGORY ID
========================================================= */

function getCategoryId(category) {

    if (!category) {
        return "";
    }

    if (
        typeof category === "string"
    ) {
        return category;
    }

    return String(
        category._id || ""
    );
}


/* =========================================================
   GET CATEGORY NAME
========================================================= */

function getCategoryName(category) {

    if (!category) {
        return "—";
    }

    if (
        typeof category === "string"
    ) {

        const foundCategory =
            categories.find(
                (item) =>
                    String(item._id) ===
                    String(category)
            );

        return (
            foundCategory?.name ||
            "—"
        );
    }

    return category.name || "—";
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    hideLoadingState();

    if (!productsTableBody) {
        return;
    }


    if (
        filteredProducts.length === 0
    ) {

        productsTableBody.innerHTML = "";

        showEmptyState();

        return;
    }


    hideEmptyState();


    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );


    if (
        currentPage > totalPages
    ) {
        currentPage = totalPages;
    }


    const startIndex =
        (currentPage - 1) *
        PRODUCTS_PER_PAGE;

    const endIndex =
        startIndex +
        PRODUCTS_PER_PAGE;


    const pageProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    productsTableBody.innerHTML =
        pageProducts
            .map(renderProductRow)
            .join("");


    updateResultsCount(
        startIndex,
        pageProducts.length,
        filteredProducts.length
    );

    renderPagination(totalPages);
}


/* =========================================================
   PRODUCT ROW
========================================================= */

function renderProductRow(product) {

    const image =
        Array.isArray(product.images) &&
        product.images.length > 0
            ? product.images[0]
            : "";


    const productName =
        escapeHtml(
            product.name || "Unnamed Product"
        );

    const brand =
        escapeHtml(
            product.brand || "—"
        );

    const sku =
        escapeHtml(
            product.sku || "—"
        );

    const categoryName =
        escapeHtml(
            getCategoryName(
                product.category
            )
        );


    const price =
        formatPrice(
            product.price
        );


    const compareAtPrice =
        product.compareAtPrice !== undefined &&
        product.compareAtPrice !== null
            ? formatPrice(
                product.compareAtPrice
            )
            : "";


    const stock =
        Number(product.stock) || 0;


    const stockClass =
        getStockClass(stock);


    const statusClass =
        product.isActive
            ? "active"
            : "inactive";


    const statusText =
        product.isActive
            ? "Active"
            : "Inactive";


    const featuredHtml =
        product.isFeatured
            ? `
                <span class="product-featured-badge">
                    ★ Featured
                </span>
              `
            : `
                <span class="product-not-featured">
                    —
                </span>
              `;


    const imageHtml =
        image
            ? `
                <img
                    src="${escapeHtml(image)}"
                    alt="${productName}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <span
                    class="product-table-image-placeholder"
                    style="display:none;"
                >
                    ◫
                </span>
              `
            : `
                <span
                    class="product-table-image-placeholder"
                >
                    ◫
                </span>
              `;


    return `
        <tr data-product-id="${escapeHtml(
            String(product._id)
        )}">

            <td>

                <div class="product-table-product">

                    <div class="product-table-image">
                        ${imageHtml}
                    </div>

                    <div class="product-table-details">

                        <div
                            class="product-table-name"
                            title="${productName}"
                        >
                            ${productName}
                        </div>

                        <div class="product-table-brand">
                            ${brand}
                        </div>

                    </div>

                </div>

            </td>


            <td>

                <span class="product-sku">
                    ${sku}
                </span>

            </td>


            <td>

                <span class="product-category-name">
                    ${categoryName}
                </span>

            </td>


            <td>

                <span class="product-price">
                    ${price}
                </span>

                ${
                    compareAtPrice
                        ? `
                            <span class="product-compare-price">
                                ${compareAtPrice}
                            </span>
                          `
                        : ""
                }

            </td>


            <td>

                <span
                    class="product-stock ${stockClass}"
                >
                    ${stock}
                </span>

            </td>


            <td>

                <span
                    class="product-status-badge ${statusClass}"
                >
                    ${statusText}
                </span>

            </td>


            <td>
                ${featuredHtml}
            </td>


            <td>

                <div class="product-actions">

                    <button
                        type="button"
                        class="product-action-button"
                        data-action="edit"
                        data-product-id="${escapeHtml(
                            String(product._id)
                        )}"
                        title="Edit product"
                        aria-label="Edit product"
                    >
                        ✎
                    </button>


                    <button
                        type="button"
                        class="product-action-button"
                        data-action="toggle"
                        data-product-id="${escapeHtml(
                            String(product._id)
                        )}"
                        title="${
                            product.isActive
                                ? "Deactivate product"
                                : "Activate product"
                        }"
                        aria-label="${
                            product.isActive
                                ? "Deactivate product"
                                : "Activate product"
                        }"
                    >
                        ${
                            product.isActive
                                ? "◉"
                                : "○"
                        }
                    </button>


                    <button
                        type="button"
                        class="product-action-button delete"
                        data-action="delete"
                        data-product-id="${escapeHtml(
                            String(product._id)
                        )}"
                        title="Delete product"
                        aria-label="Delete product"
                    >
                        ×
                    </button>

                </div>

            </td>

        </tr>
    `;
}


/* =========================================================
   STOCK CLASS
========================================================= */

function getStockClass(stock) {

    if (stock <= 0) {
        return "out-of-stock";
    }

    if (stock <= 10) {
        return "low-stock";
    }

    return "in-stock";
}


/* =========================================================
   RESULTS COUNT
========================================================= */

function updateResultsCount(
    startIndex,
    visibleCount,
    totalCount
) {

    if (!productsResultsCount) {
        return;
    }

    if (totalCount === 0) {

        productsResultsCount.textContent =
            "Showing 0 products";

        return;
    }


    const first =
        startIndex + 1;

    const last =
        startIndex + visibleCount;


    productsResultsCount.textContent =
        `Showing ${first}-${last} of ${totalCount} products`;
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination(totalPages) {

    if (!productsPagination) {
        return;
    }

    productsPagination.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    const previousButton =
        createPaginationButton(
            "‹",
            currentPage - 1,
            currentPage === 1
        );

    productsPagination.appendChild(
        previousButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        if (
            totalPages > 7 &&
            !shouldShowPage(
                page,
                totalPages
            )
        ) {

            if (
                page === 2 ||
                page === totalPages - 1
            ) {

                const ellipsis =
                    document.createElement("span");

                ellipsis.className =
                    "pagination-ellipsis";

                ellipsis.textContent = "…";

                productsPagination.appendChild(
                    ellipsis
                );
            }

            continue;
        }


        const button =
            createPaginationButton(
                String(page),
                page,
                false
            );

        if (
            page === currentPage
        ) {
            button.classList.add("active");
        }

        productsPagination.appendChild(
            button
        );
    }


    const nextButton =
        createPaginationButton(
            "›",
            currentPage + 1,
            currentPage === totalPages
        );

    productsPagination.appendChild(
        nextButton
    );
}


function shouldShowPage(
    page,
    totalPages
) {

    return (
        page === 1 ||
        page === totalPages ||
        Math.abs(
            page - currentPage
        ) <= 1
    );
}


function createPaginationButton(
    text,
    page,
    disabled
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "pagination-button";

    button.textContent = text;

    button.disabled = disabled;

    button.addEventListener(
        "click",
        () => {

            if (disabled) {
                return;
            }

            currentPage = page;

            renderProducts();
        }
    );

    return button;
}


/* =========================================================
   OPEN ADD PRODUCT MODAL
========================================================= */

function openAddProductModal() {

    editingProductId = null;

    resetProductForm();

    if (productModalTitle) {
        productModalTitle.textContent =
            "Add Product";
    }

    if (saveProductButton) {
        saveProductButton.textContent =
            "Save Product";
    }

    showProductModal();
}


/* =========================================================
   OPEN EDIT PRODUCT MODAL
========================================================= */

function openEditProductModal(
    product
) {

    editingProductId =
        String(product._id);


    resetProductForm();


    if (productModalTitle) {
        productModalTitle.textContent =
            "Edit Product";
    }

    if (saveProductButton) {
        saveProductButton.textContent =
            "Update Product";
    }


    if (productId) {
        productId.value =
            String(product._id);
    }


    if (productName) {
        productName.value =
            product.name || "";
    }


    if (productBrand) {
        productBrand.value =
            product.brand || "";
    }


    if (productCategory) {
        productCategory.value =
            getCategoryId(
                product.category
            );
    }


    if (productDescription) {
        productDescription.value =
            product.description || "";
    }


    if (productPrice) {
        productPrice.value =
            product.price ?? "";
    }


    if (productComparePrice) {
        productComparePrice.value =
            product.compareAtPrice ?? "";
    }


    if (productStock) {
        productStock.value =
            product.stock ?? 0;
    }


    if (productSku) {
        productSku.value =
            product.sku || "";
    }


    if (productSizes) {
        productSizes.value =
            Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : "";
    }


    if (productImages) {
        productImages.value =
            Array.isArray(product.images)
                ? product.images.join("\n")
                : "";
    }


    if (productFeatured) {
        productFeatured.checked =
            product.isFeatured === true;
    }


    if (
        Array.isArray(product.colors) &&
        product.colors.length > 0
    ) {

        productColorsEditor.innerHTML = "";

        product.colors.forEach(
            (color) => {

                addColorRow(
                    color.name,
                    color.hex
                );
            }
        );

    } else {

        addColorRow();
    }


    showProductModal();
}


/* =========================================================
   SHOW PRODUCT MODAL
========================================================= */

function showProductModal() {

    if (!productModal) {
        return;
    }

    productModal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        if (productName) {
            productName.focus();
        }

    }, 50);
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    if (!productModal) {
        return;
    }

    productModal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );

    editingProductId = null;

    hideProductFormError();
}


/* =========================================================
   RESET PRODUCT FORM
========================================================= */

function resetProductForm() {

    if (productForm) {
        productForm.reset();
    }


    if (productId) {
        productId.value = "";
    }


    if (productColorsEditor) {
        productColorsEditor.innerHTML = "";
    }


    addColorRow();

    hideProductFormError();
}


/* =========================================================
   ADD COLOR ROW
========================================================= */

function addColorRow(
    colorName = "",
    colorHex = "#000000"
) {

    if (!productColorsEditor) {
        return;
    }


    const row =
        document.createElement("div");

    row.className =
        "color-editor-row";


    row.innerHTML = `
        <input
            type="text"
            class="color-name-input"
            placeholder="Color name"
            value="${escapeHtml(colorName)}"
            maxlength="30"
        >

        <input
            type="color"
            class="color-hex-input"
            value="${isValidHex(colorHex)
                ? colorHex
                : "#000000"}"
            title="Choose color"
        >

        <button
            type="button"
            class="remove-color-button"
            aria-label="Remove color"
            title="Remove color"
        >
            ×
        </button>
    `;


    const removeButton =
        row.querySelector(
            ".remove-color-button"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            () => {

                row.remove();

                ensureColorRow();
            }
        );
    }


    productColorsEditor.appendChild(row);
}


/* =========================================================
   ENSURE COLOR ROW
========================================================= */

function ensureColorRow() {

    if (
        productColorsEditor &&
        productColorsEditor.children.length === 0
    ) {
        addColorRow();
    }
}


/* =========================================================
   GET COLORS FROM FORM
========================================================= */

function getColorsFromForm() {

    if (!productColorsEditor) {
        return [];
    }


    const rows =
        productColorsEditor.querySelectorAll(
            ".color-editor-row"
        );


    const colors = [];


    rows.forEach((row) => {

        const nameInput =
            row.querySelector(
                ".color-name-input"
            );

        const hexInput =
            row.querySelector(
                ".color-hex-input"
            );


        const name =
            nameInput?.value.trim() || "";

        const hex =
            hexInput?.value.trim().toUpperCase() ||
            "";


        /*
         * Completely empty color rows are ignored.
         */

        if (!name && !hex) {
            return;
        }


        if (!name) {
            throw new Error(
                "Every color must have a name"
            );
        }


        colors.push({
            name,
            hex,
        });
    });


    return colors;
}


/* =========================================================
   PRODUCT FORM SUBMIT
========================================================= */

async function handleProductSubmit(
    event
) {

    event.preventDefault();

    hideProductFormError();


    try {

        const productData =
            collectProductFormData();


        validateProductFormData(
            productData
        );


        setSaveButtonLoading(true);


        const isEditing =
            Boolean(editingProductId);


        const url =
            isEditing
                ? `${PRODUCTS_API_URL}/${editingProductId}`
                : PRODUCTS_API_URL;


        const method =
            isEditing
                ? "PUT"
                : "POST";


        const response =
            await apiRequest(
                url,
                {
                    method,
                    body: JSON.stringify(
                        productData
                    ),
                }
            );


        closeProductModal();


        await loadProducts();


        showToast(
            response?.message ||
            (
                isEditing
                    ? "Product updated successfully"
                    : "Product created successfully"
            ),
            "success"
        );

    } catch (error) {

        console.error(
            "Product save error:",
            error
        );

        showProductFormError(
            error.message ||
            "Failed to save product"
        );

    } finally {

        setSaveButtonLoading(false);
    }
}


/* =========================================================
   COLLECT PRODUCT FORM DATA
========================================================= */

function collectProductFormData() {

    const name =
        productName?.value.trim() || "";

    const description =
        productDescription?.value.trim() || "";

    const brand =
        productBrand?.value.trim() || "";

    const category =
        productCategory?.value || "";

    const priceValue =
        productPrice?.value.trim() || "";

    const comparePriceValue =
        productComparePrice?.value.trim() || "";

    const stockValue =
        productStock?.value.trim() || "";

    const sku =
        productSku?.value.trim() || "";

    const sizesValue =
        productSizes?.value.trim() || "";

    const imagesValue =
        productImages?.value.trim() || "";


    const price =
        priceValue === ""
            ? NaN
            : Number(priceValue);


    const stock =
        stockValue === ""
            ? NaN
            : Number(stockValue);


    const compareAtPrice =
        comparePriceValue === ""
            ? undefined
            : Number(comparePriceValue);


    const sizes =
        sizesValue
            ? sizesValue
                .split(",")
                .map(
                    (size) =>
                        size.trim()
                )
                .filter(Boolean)
            : [];


    const images =
        imagesValue
            ? imagesValue
                .split("\n")
                .map(
                    (image) =>
                        image.trim()
                )
                .filter(Boolean)
            : [];


    const colors =
        getColorsFromForm();


    return {
        name,
        description,
        brand,
        category,
        price,
        compareAtPrice,
        sku,
        stock,
        sizes,
        colors,
        images,
        isFeatured:
            productFeatured?.checked === true,
    };
}


/* =========================================================
   VALIDATE FORM DATA
========================================================= */

function validateProductFormData(
    data
) {

    if (!data.name) {
        throw new Error(
            "Product name is required"
        );
    }


    if (!data.description) {
        throw new Error(
            "Product description is required"
        );
    }


    if (!data.brand) {
        throw new Error(
            "Product brand is required"
        );
    }


    if (!data.category) {
        throw new Error(
            "Please select a category"
        );
    }


    if (
        !Number.isFinite(data.price)
    ) {
        throw new Error(
            "Please enter a valid price"
        );
    }


    if (data.price < 0) {
        throw new Error(
            "Price cannot be negative"
        );
    }


    if (
        data.compareAtPrice !== undefined
    ) {

        if (
            !Number.isFinite(
                data.compareAtPrice
            )
        ) {
            throw new Error(
                "Please enter a valid compare-at price"
            );
        }


        if (
            data.compareAtPrice <=
            data.price
        ) {
            throw new Error(
                "Compare-at price must be greater than the current price"
            );
        }
    }


    if (
        !Number.isFinite(data.stock)
    ) {
        throw new Error(
            "Please enter valid stock"
        );
    }


    if (data.stock < 0) {
        throw new Error(
            "Stock cannot be negative"
        );
    }


    if (!Number.isInteger(data.stock)) {
        throw new Error(
            "Stock must be a whole number"
        );
    }


    if (!data.sku) {
        throw new Error(
            "Product SKU is required"
        );
    }


    data.colors.forEach(
        (color) => {

            if (
                !isValidHex(color.hex)
            ) {
                throw new Error(
                    `Invalid color value for ${color.name}`
                );
            }
        }
    );
}


/* =========================================================
   SAVE BUTTON LOADING
========================================================= */

function setSaveButtonLoading(
    loading
) {

    if (!saveProductButton) {
        return;
    }


    saveProductButton.disabled =
        loading;


    if (loading) {

        saveProductButton.dataset.originalText =
            saveProductButton.textContent;

        saveProductButton.textContent =
            editingProductId
                ? "Updating..."
                : "Saving...";

    } else {

        saveProductButton.textContent =
            saveProductButton.dataset.originalText ||
            (
                editingProductId
                    ? "Update Product"
                    : "Save Product"
            );
    }
}


/* =========================================================
   TABLE ACTIONS
========================================================= */

async function handleProductTableClick(
    event
) {

    const target =
        event.target;


    if (!(target instanceof Element)) {
        return;
    }


    const button =
        target.closest(
            "[data-action]"
        );


    if (!button) {
        return;
    }


    const action =
        button.getAttribute(
            "data-action"
        );


    const id =
        button.getAttribute(
            "data-product-id"
        );


    if (!id) {
        return;
    }


    const product =
        products.find(
            (item) =>
                String(item._id) ===
                String(id)
        );


    if (!product) {
        showToast(
            "Product could not be found",
            "error"
        );

        return;
    }


    if (action === "edit") {

        openEditProductModal(
            product
        );

        return;
    }


    if (action === "toggle") {

        await toggleProductStatus(
            product
        );

        return;
    }


    if (action === "delete") {

        openDeleteModal(
            product
        );
    }
}


/* =========================================================
   TOGGLE PRODUCT STATUS
========================================================= */

async function toggleProductStatus(
    product
) {

    const newStatus =
        product.isActive !== true;


    try {

        await apiRequest(
            `${PRODUCTS_API_URL}/${product._id}/status`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    isActive: newStatus,
                }),
            }
        );


        await loadProducts();


        showToast(
            newStatus
                ? "Product activated successfully"
                : "Product deactivated successfully",
            "success"
        );

    } catch (error) {

        console.error(
            "Product status error:",
            error
        );

        showToast(
            error.message ||
            "Failed to update product status",
            "error"
        );
    }
}


/* =========================================================
   OPEN DELETE MODAL
========================================================= */

function openDeleteModal(
    product
) {

    deletingProductId =
        String(product._id);


    if (deleteProductName) {
        deleteProductName.textContent =
            product.name || "this product";
    }


    if (deleteProductModal) {
        deleteProductModal.hidden = false;
    }

    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    if (deleteProductModal) {
        deleteProductModal.hidden = true;
    }

    deletingProductId = null;

    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   CONFIRM DELETE
========================================================= */

async function confirmDeleteProduct() {

    if (!deletingProductId) {
        return;
    }


    const productIdToDelete =
        deletingProductId;


    if (confirmDeleteProductButton) {
        confirmDeleteProductButton.disabled =
            true;

        confirmDeleteProductButton.textContent =
            "Deleting...";
    }


    try {

        const response =
            await apiRequest(
                `${PRODUCTS_API_URL}/${productIdToDelete}`,
                {
                    method: "DELETE",
                }
            );


        closeDeleteModal();


        await loadProducts();


        showToast(
            response?.message ||
            "Product deleted successfully",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        showToast(
            error.message ||
            "Failed to delete product",
            "error"
        );

    } finally {

        if (confirmDeleteProductButton) {
            confirmDeleteProductButton.disabled =
                false;

            confirmDeleteProductButton.textContent =
                "Delete Product";
        }
    }
}


/* =========================================================
   LOADING STATE
========================================================= */

function showLoadingState() {

    if (productsLoading) {
        productsLoading.hidden = false;
    }

    if (productsError) {
        productsError.hidden = true;
    }

    if (productsEmpty) {
        productsEmpty.hidden = true;
    }

    if (productsTableFooter) {
        productsTableFooter.style.display =
            "none";
    }

    if (productsTableBody) {
        productsTableBody.innerHTML = "";
    }
}


function hideLoadingState() {

    if (productsLoading) {
        productsLoading.hidden = true;
    }

    if (productsTableFooter) {
        productsTableFooter.style.display =
            "";
    }
}


/* =========================================================
   ERROR STATE
========================================================= */

function showProductsError(
    message
) {

    if (productsLoading) {
        productsLoading.hidden = true;
    }

    if (productsEmpty) {
        productsEmpty.hidden = true;
    }

    if (productsTableFooter) {
        productsTableFooter.style.display =
            "none";
    }

    if (productsTableBody) {
        productsTableBody.innerHTML = "";
    }

    if (productsErrorMessage) {
        productsErrorMessage.textContent =
            message;
    }

    if (productsError) {
        productsError.hidden = false;
    }
}


/* =========================================================
   EMPTY STATE
========================================================= */

function showEmptyState() {

    if (productsEmpty) {
        productsEmpty.hidden = false;
    }

    if (productsTableFooter) {
        productsTableFooter.style.display =
            "none";
    }
}


function hideEmptyState() {

    if (productsEmpty) {
        productsEmpty.hidden = true;
    }

    if (productsTableFooter) {
        productsTableFooter.style.display =
            "";
    }
}


/* =========================================================
   FORM ERROR
========================================================= */

function showProductFormError(
    message
) {

    if (!productFormError) {
        return;
    }

    productFormError.textContent =
        message;

    productFormError.hidden =
        false;
}


function hideProductFormError() {

    if (!productFormError) {
        return;
    }

    productFormError.textContent = "";

    productFormError.hidden = true;
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    if (
        !adminToast ||
        !toastMessage ||
        !toastIcon
    ) {
        return;
    }


    clearTimeout(
        toastTimeout
    );


    toastMessage.textContent =
        message;


    if (type === "error") {

        toastIcon.textContent = "!";

    } else {

        toastIcon.textContent = "✓";
    }


    adminToast.classList.add(
        "show"
    );


    toastTimeout =
        setTimeout(
            () => {

                adminToast.classList.remove(
                    "show"
                );

            },
            3500
        );
}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(
    value
) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "—";
    }


    return `$${number.toFixed(2)}`;
}


/* =========================================================
   HEX VALIDATION
========================================================= */

function isValidHex(
    value
) {

    return /^#[0-9A-F]{6}$/i.test(
        String(value || "")
    );
}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(
    value
) {

    return String(value ?? "")
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