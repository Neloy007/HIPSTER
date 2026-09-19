/* =========================================================
   HIPSTER ADMIN - PRODUCTS PAGE
========================================================= */


/* =========================================================
   API CONFIGURATION
========================================================= */

const PRODUCTS_API_URL =
    "http://localhost:5000/api/products";

const CATEGORIES_API_URL =
    "http://localhost:5000/api/categories";

const UPLOAD_API_URL =
    "http://localhost:5000/api/upload/product-images";

const PRODUCTS_PER_PAGE = 10;

const MAX_PRODUCT_IMAGES = 5;

const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;


/* =========================================================
   STATE
========================================================= */

let products = [];

let categories = [];

let filteredProducts = [];

let currentPage = 1;

let editingProductId = null;

let deletingProductId = null;

let toastTimer = null;


/*
    Product images currently inside
    the Add/Edit Product form.

    Existing / uploaded image:

    {
        url: "https://...",
        isExisting: true
    }


    New image waiting for Cloudinary upload:

    {
        url: "blob:...",
        isExisting: false,
        file: File
    }
*/

let productImages = [];


/* =========================================================
   DOM ELEMENTS
========================================================= */


/* =========================================================
   PRODUCT LIST
========================================================= */

const productsTableBody =
    document.getElementById(
        "productsTableBody"
    );

const productsLoading =
    document.getElementById(
        "productsLoading"
    );

const productsError =
    document.getElementById(
        "productsError"
    );

const productsErrorMessage =
    document.getElementById(
        "productsErrorMessage"
    );

const productsEmpty =
    document.getElementById(
        "productsEmpty"
    );

const productsTableWrapper =
    document.getElementById(
        "productsTableWrapper"
    );

const productsTableFooter =
    document.getElementById(
        "productsTableFooter"
    );


/* =========================================================
   SUMMARY
========================================================= */

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const activeProducts =
    document.getElementById(
        "activeProducts"
    );

const outOfStockProducts =
    document.getElementById(
        "outOfStockProducts"
    );

const featuredProducts =
    document.getElementById(
        "featuredProducts"
    );


/* =========================================================
   SEARCH / FILTERS
========================================================= */

const productSearch =
    document.getElementById(
        "productSearch"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const stockFilter =
    document.getElementById(
        "stockFilter"
    );

const refreshProductsButton =
    document.getElementById(
        "refreshProductsButton"
    );


/* =========================================================
   PAGINATION
========================================================= */

const productsResultsInfo =
    document.getElementById(
        "productsResultsInfo"
    );

const productsPagination =
    document.getElementById(
        "productsPagination"
    );


/* =========================================================
   ADD PRODUCT
========================================================= */

const addProductButton =
    document.getElementById(
        "addProductButton"
    );

const emptyAddProductButton =
    document.getElementById(
        "emptyAddProductButton"
    );


/* =========================================================
   PRODUCT MODAL
========================================================= */

const productModal =
    document.getElementById(
        "productModal"
    );

const productModalTitle =
    document.getElementById(
        "productModalTitle"
    );

const productModalDescription =
    document.getElementById(
        "productModalDescription"
    );

const productForm =
    document.getElementById(
        "productForm"
    );

const closeProductModalButton =
    document.getElementById(
        "closeProductModal"
    );

const cancelProductButton =
    document.getElementById(
        "cancelProductButton"
    );

const saveProductButton =
    document.getElementById(
        "saveProductButton"
    );


/* =========================================================
   PRODUCT FORM
========================================================= */

const productName =
    document.getElementById(
        "productName"
    );

const productBrand =
    document.getElementById(
        "productBrand"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const productCompareAtPrice =
    document.getElementById(
        "productCompareAtPrice"
    );

const productSku =
    document.getElementById(
        "productSku"
    );

const productStock =
    document.getElementById(
        "productStock"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const productFeatured =
    document.getElementById(
        "productFeatured"
    );

const productActive =
    document.getElementById(
        "productActive"
    );


/* =========================================================
   SIZES
========================================================= */

const sizeCheckboxes =
    document.querySelectorAll(
        'input[name="sizes"]'
    );


/* =========================================================
   COLORS
========================================================= */

const colorsList =
    document.getElementById(
        "colorsList"
    );

const addColorButton =
    document.getElementById(
        "addColorButton"
    );


/* =========================================================
   IMAGES
========================================================= */

const productImageFiles =
    document.getElementById(
        "productImageFiles"
    );

const imageUploadBox =
    document.getElementById(
        "imageUploadBox"
    );

const imageUploadStatus =
    document.getElementById(
        "imageUploadStatus"
    );

const imageUploadStatusIcon =
    document.getElementById(
        "imageUploadStatusIcon"
    );

const imageUploadStatusText =
    document.getElementById(
        "imageUploadStatusText"
    );

const productImagePreview =
    document.getElementById(
        "productImagePreview"
    );

const productImagesInput =
    document.getElementById(
        "productImages"
    );


/* =========================================================
   FORM ERROR
========================================================= */

const productFormError =
    document.getElementById(
        "productFormError"
    );


/* =========================================================
   DELETE MODAL
========================================================= */

const deleteModal =
    document.getElementById(
        "deleteModal"
    );

const deleteProductName =
    document.getElementById(
        "deleteModalMessage"
    );

const cancelDeleteProductButton =
    document.getElementById(
        "cancelDeleteButton"
    );

const confirmDeleteProductButton =
    document.getElementById(
        "confirmDeleteButton"
    );


/* =========================================================
   TOAST
========================================================= */

const adminToast =
    document.getElementById(
        "toast"
    );


/* =========================================================
   AUTHENTICATION
========================================================= */

function getAdminToken() {

    return localStorage.getItem(
        "hipsterAdminToken"
    );
}


function getAuthHeaders() {

    const token =
        getAdminToken();


    if (!token) {

        throw new Error(
            "Admin session not found. Please log in again."
        );
    }


    return {
        Authorization:
            `Bearer ${token}`,
    };
}


function getJsonAuthHeaders() {

    return {

        ...getAuthHeaders(),

        "Content-Type":
            "application/json",
    };
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProductsPage();

    }
);


async function initializeProductsPage() {

    setupEventListeners();


    /*
        Make sure the color editor
        has at least one row.
    */

    if (
        colorsList &&
        colorsList.children.length === 0
    ) {
        addColorRow();
    }


    await loadCategories();

    await loadProducts();
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /* Add product */

    if (addProductButton) {

        addProductButton.addEventListener(
            "click",
            openAddProductModal
        );
    }


    /* Empty state Add Product */

    if (emptyAddProductButton) {

        emptyAddProductButton.addEventListener(
            "click",
            openAddProductModal
        );
    }


    /* Close product modal */

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


    /* Product form */

    if (productForm) {

        productForm.addEventListener(
            "submit",
            handleProductSubmit
        );
    }


    /* Search */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            handleFilters
        );
    }


    /* Category filter */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            handleFilters
        );
    }


    /* Status filter */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            handleFilters
        );
    }


    /* Stock filter */

    if (stockFilter) {

        stockFilter.addEventListener(
            "change",
            handleFilters
        );
    }


    /* Refresh */

    if (refreshProductsButton) {

        refreshProductsButton.addEventListener(
            "click",
            () => loadProducts()
        );
    }


    /* Add color */

    if (addColorButton) {

        addColorButton.addEventListener(
            "click",
            () => addColorRow()
        );
    }


    /* Image selection */

    if (productImageFiles) {

        productImageFiles.addEventListener(
            "change",
            handleImageSelection
        );
    }


    /* Delete */

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


    /* Product modal overlay */

    if (productModal) {

        productModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    productModal
                ) {

                    closeProductModal();
                }

            }
        );
    }


    /* Delete modal overlay */

    if (deleteModal) {

        deleteModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    deleteModal
                ) {

                    closeDeleteModal();
                }

            }
        );
    }


    /* Escape */

    document.addEventListener(
        "keydown",
        handleEscapeKey
    );
}


/* =========================================================
   ESCAPE KEY
========================================================= */

function handleEscapeKey(event) {

    if (
        event.key !==
        "Escape"
    ) {
        return;
    }


    if (
        productModal &&
        !productModal.hidden
    ) {

        closeProductModal();

        return;
    }


    if (
        deleteModal &&
        !deleteModal.hidden
    ) {

        closeDeleteModal();
    }
}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories() {

    try {

        const response =
            await fetch(
                CATEGORIES_API_URL
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to load categories."
            );
        }


        categories =
            result.data?.categories ||
            [];


        populateCategorySelects();


    } catch (error) {

        console.error(
            "Load categories error:",
            error
        );


        showToast(
            error.message ||
            "Failed to load categories."
        );
    }
}


/* =========================================================
   POPULATE CATEGORY SELECTS
========================================================= */

function populateCategorySelects() {


    /* Filter */

    if (categoryFilter) {

        categoryFilter.innerHTML = `
            <option value="">
                All Categories
            </option>
        `;


        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category._id;


                option.textContent =
                    category.name;


                categoryFilter.appendChild(
                    option
                );
            }
        );
    }


    /* Product form */

    if (productCategory) {

        productCategory.innerHTML = `
            <option value="">
                Select category
            </option>
        `;


        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category._id;


                option.textContent =
                    category.name;


                productCategory.appendChild(
                    option
                );
            }
        );
    }
}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    showProductsLoading();


    try {

        if (!getAdminToken()) {

            handleUnauthorized();

            return;
        }


        const response =
            await fetch(
                `${PRODUCTS_API_URL}/admin/all`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders(),
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

            return;
        }


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to load products."
            );
        }


        products =
            result.data?.products ||
            [];


        updateSummary();

        applyFilters();


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        showProductsError(
            error.message ||
            "Failed to load products."
        );
    }
}


/* =========================================================
   FILTERS
========================================================= */

function handleFilters() {

    currentPage = 1;

    applyFilters();
}


function applyFilters() {

    const search =
        productSearch
            ? productSearch.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    const stock =
        stockFilter
            ? stockFilter.value
            : "";


    filteredProducts =
        products.filter(
            (product) => {


                /* Search */

                if (search) {

                    const searchableText = [

                        product.name,

                        product.brand,

                        product.sku,

                        getCategoryName(
                            product.category
                        ),

                    ]
                        .join(" ")
                        .toLowerCase();


                    if (
                        !searchableText.includes(
                            search
                        )
                    ) {

                        return false;
                    }
                }


                /* Category */

                if (
                    category &&
                    getCategoryId(
                        product.category
                    ) !== category
                ) {

                    return false;
                }


                /* Status */

                if (
                    status === "active" &&
                    product.isActive !== true
                ) {

                    return false;
                }


                if (
                    status === "inactive" &&
                    product.isActive !== false
                ) {

                    return false;
                }


                /* Stock */

                const stockValue =
                    Number(
                        product.stock || 0
                    );


                if (
                    stock === "in-stock" &&
                    stockValue <= 5
                ) {

                    return false;
                }


                if (
                    stock === "low-stock" &&
                    (
                        stockValue < 1 ||
                        stockValue > 5
                    )
                ) {

                    return false;
                }


                if (
                    stock === "out-of-stock" &&
                    stockValue !== 0
                ) {

                    return false;
                }


                return true;
            }
        );


    currentPage =
        Math.min(
            currentPage,
            Math.max(
                1,
                Math.ceil(
                    filteredProducts.length /
                    PRODUCTS_PER_PAGE
                )
            )
        );


    renderProducts();
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    hideProductsLoading();

    hideProductsError();


    /*
        No products after filtering.
    */

    if (
        filteredProducts.length === 0
    ) {

        showProductsEmpty();

        updateResultsCount();

        renderPagination();

        return;
    }


    hideProductsEmpty();


    if (!productsTableWrapper) {
        return;
    }


    productsTableWrapper.hidden =
        false;


    if (productsTableFooter) {

        productsTableFooter.hidden =
            false;
    }


    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;
    }


    const startIndex =
        (
            currentPage - 1
        ) *
        PRODUCTS_PER_PAGE;


    const endIndex =
        startIndex +
        PRODUCTS_PER_PAGE;


    const pageProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    if (productsTableBody) {

        productsTableBody.innerHTML =
            pageProducts
                .map(
                    (product) =>
                        createProductRow(
                            product
                        )
                )
                .join("");


        attachProductRowListeners();
    }


    updateResultsCount();

    renderPagination();
}


/* =========================================================
   CREATE PRODUCT ROW
========================================================= */

function createProductRow(
    product
) {

    const image =
        Array.isArray(
            product.images
        ) &&
        product.images.length > 0
            ? product.images[0]
            : null;


    const categoryName =
        getCategoryName(
            product.category
        );


    const stock =
        Number(
            product.stock || 0
        );


    const stockClass =
        getStockClass(
            stock
        );


    let stockText;


    if (stock === 0) {

        stockText =
            "Out";

    } else {

        stockText =
            String(stock);
    }


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
                    src="${escapeHtml(
                        image
                    )}"
                    alt="${escapeHtml(
                        product.name
                    )}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
                >

                <div
                    class="product-table-image-placeholder"
                    hidden
                >
                    □
                </div>
            `
            : `
                <div class="product-table-image-placeholder">
                    □
                </div>
            `;


    return `
        <tr
            data-product-id="${escapeHtml(
                product._id
            )}"
        >


            <!-- PRODUCT -->

            <td class="product-image-column">

                <div class="product-table-product">


                    <div class="product-table-image">

                        ${imageHtml}

                    </div>


                    <div class="product-table-details">

                        <span class="product-table-name">
                            ${escapeHtml(
                                product.name
                            )}
                        </span>


                        <span class="product-table-brand">
                            ${escapeHtml(
                                product.brand ||
                                "—"
                            )}
                        </span>

                    </div>


                </div>

            </td>



            <!-- SKU -->

            <td>

                <span class="product-sku">
                    ${escapeHtml(
                        product.sku ||
                        "—"
                    )}
                </span>

            </td>



            <!-- CATEGORY -->

            <td>

                <span class="product-category-name">
                    ${escapeHtml(
                        categoryName
                    )}
                </span>

            </td>



            <!-- PRICE -->

            <td>

                <span class="product-price">
                    ${formatPrice(
                        product.price
                    )}
                </span>


                ${
                    product.compareAtPrice
                        ? `
                            <span class="product-compare-price">
                                ${formatPrice(
                                    product.compareAtPrice
                                )}
                            </span>
                        `
                        : ""
                }

            </td>



            <!-- STOCK -->

            <td>

                <span
                    class="product-stock ${stockClass}"
                >
                    ${escapeHtml(
                        stockText
                    )}
                </span>

            </td>



            <!-- STATUS -->

            <td>

                <span
                    class="product-status-badge ${statusClass}"
                >
                    ${statusText}
                </span>

            </td>



            <!-- FEATURED -->

            <td>

                ${featuredHtml}

            </td>



            <!-- ACTIONS -->

            <td>

                <div class="product-actions">


                    <!-- Edit -->

                    <button
                        type="button"
                        class="product-action-button edit"
                        data-action="edit"
                        data-product-id="${escapeHtml(
                            product._id
                        )}"
                        aria-label="Edit product"
                        title="Edit product"
                    >
                        ✎
                    </button>


                    <!-- Status -->

                    <button
                        type="button"
                        class="product-action-button status"
                        data-action="status"
                        data-product-id="${escapeHtml(
                            product._id
                        )}"
                        aria-label="${
                            product.isActive
                                ? "Deactivate product"
                                : "Activate product"
                        }"
                        title="${
                            product.isActive
                                ? "Deactivate"
                                : "Activate"
                        }"
                    >
                        ${
                            product.isActive
                                ? "○"
                                : "●"
                        }
                    </button>


                    <!-- Delete -->

                    <button
                        type="button"
                        class="product-action-button delete"
                        data-action="delete"
                        data-product-id="${escapeHtml(
                            product._id
                        )}"
                        aria-label="Delete product"
                        title="Delete product"
                    >
                        ×
                    </button>


                </div>

            </td>


        </tr>
    `;
}


/* =========================================================
   PRODUCT ROW EVENTS
========================================================= */

function attachProductRowListeners() {

    if (!productsTableBody) {
        return;
    }


    const actionButtons =
        productsTableBody.querySelectorAll(
            ".product-action-button"
        );


    actionButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleProductAction
            );
        }
    );
}


function handleProductAction(
    event
) {

    const button =
        event.currentTarget;


    const productId =
        button.dataset.productId;


    const action =
        button.dataset.action;


    if (
        !productId ||
        !action
    ) {
        return;
    }


    if (
        action ===
        "edit"
    ) {

        openEditProductModal(
            productId
        );

        return;
    }


    if (
        action ===
        "status"
    ) {

        toggleProductStatus(
            productId
        );

        return;
    }


    if (
        action ===
        "delete"
    ) {

        openDeleteModal(
            productId
        );
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
                Number(
                    product.stock || 0
                ) === 0
        ).length;


    const featured =
        products.filter(
            (product) =>
                product.isFeatured === true
        ).length;


    if (totalProducts) {

        totalProducts.textContent =
            String(total);
    }


    if (activeProducts) {

        activeProducts.textContent =
            String(active);
    }


    if (outOfStockProducts) {

        outOfStockProducts.textContent =
            String(outOfStock);
    }


    if (featuredProducts) {

        featuredProducts.textContent =
            String(featured);
    }
}


/* =========================================================
   OPEN ADD PRODUCT MODAL
========================================================= */

function openAddProductModal() {

    editingProductId =
        null;


    resetProductForm();


    if (productModalTitle) {

        productModalTitle.textContent =
            "Add Product";
    }


    if (productModalDescription) {

        productModalDescription.textContent =
            "Create a new product for your HIPSTER store.";
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
    productId
) {

    const product =
        products.find(
            (item) =>
                item._id ===
                productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    editingProductId =
        productId;


    resetProductForm();


    if (productModalTitle) {

        productModalTitle.textContent =
            "Edit Product";
    }


    if (productModalDescription) {

        productModalDescription.textContent =
            "Update your HIPSTER product information.";
    }


    /* Name */

    if (productName) {

        productName.value =
            product.name ||
            "";
    }


    /* Brand */

    if (productBrand) {

        productBrand.value =
            product.brand ||
            "";
    }


    /* Category */

    if (productCategory) {

        productCategory.value =
            getCategoryId(
                product.category
            );
    }


    /* Price */

    if (productPrice) {

        productPrice.value =
            product.price ??
            "";
    }


    /* Compare price */

    if (productCompareAtPrice) {

        productCompareAtPrice.value =
            product.compareAtPrice ??
            "";
    }


    /* SKU */

    if (productSku) {

        productSku.value =
            product.sku ||
            "";
    }


    /* Stock */

    if (productStock) {

        productStock.value =
            product.stock ??
            0;
    }


    /* Description */

    if (productDescription) {

        productDescription.value =
            product.description ||
            "";
    }


    /* Featured */

    if (productFeatured) {

        productFeatured.checked =
            Boolean(
                product.isFeatured
            );
    }


    /* Active */

    if (productActive) {

        productActive.checked =
            product.isActive !== false;
    }


    /* Sizes */

    const selectedSizes =
        Array.isArray(
            product.sizes
        )
            ? product.sizes
            : [];


    sizeCheckboxes.forEach(
        (checkbox) => {

            checkbox.checked =
                selectedSizes.includes(
                    checkbox.value
                );
        }
    );


    /* Colors */

    if (colorsList) {

        colorsList.innerHTML =
            "";


        if (
            Array.isArray(
                product.colors
            ) &&
            product.colors.length > 0
        ) {

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
    }


    /* Existing images */

    productImages =
        Array.isArray(
            product.images
        )
            ? product.images
                .filter(
                    (url) =>
                        typeof url ===
                        "string" &&
                        url.trim()
                )
                .map(
                    (url) => ({

                        url:
                            url.trim(),

                        isExisting:
                            true,
                    })
                )
            : [];


    updateImageInput();

    renderImagePreviews();


    if (
        productImages.length
    ) {

        updateImageStatus(
            `${productImages.length} existing image${
                productImages.length === 1
                    ? ""
                    : "s"
            } loaded.`,
            false
        );

    } else {

        updateImageStatus(
            "",
            false
        );
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


    productModal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    /*
        Focus the first input.
    */

    if (productName) {

        setTimeout(
            () => {

                productName.focus();

            },
            50
        );
    }
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    if (!productModal) {
        return;
    }


    productModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   RESET PRODUCT FORM
========================================================= */

function resetProductForm() {

    /*
        Revoke temporary browser
        object URLs.
    */

    revokePendingImageUrls();


    if (productForm) {

        productForm.reset();
    }


    if (productFormError) {

        productFormError.hidden =
            true;

        productFormError.textContent =
            "";
    }


    editingProductId =
        null;


    productImages =
        [];


    if (productImagesInput) {

        productImagesInput.value =
            "";
    }


    if (productImageFiles) {

        productImageFiles.value =
            "";
    }


    if (productImagePreview) {

        productImagePreview.innerHTML =
            "";
    }


    updateImageStatus(
        "",
        false
    );


    /* Colors */

    if (colorsList) {

        colorsList.innerHTML =
            "";

        addColorRow();
    }


    /* Sizes */

    sizeCheckboxes.forEach(
        (checkbox) => {

            checkbox.checked =
                false;
        }
    );


    /* Active */

    if (productActive) {

        productActive.checked =
            true;
    }


    /* Featured */

    if (productFeatured) {

        productFeatured.checked =
            false;
    }
}


/* =========================================================
   PRODUCT FORM SUBMIT
========================================================= */

async function handleProductSubmit(
    event
) {

    event.preventDefault();


    clearProductFormError();


    const formData =
        collectProductFormData();


    const validationError =
        validateProductForm(
            formData
        );


    if (validationError) {

        showProductFormError(
            validationError
        );

        return;
    }


    setSaveButtonLoading(
        true
    );


    try {


        /*
            Upload new local images
            to Cloudinary first.
        */

        await uploadSelectedImages();


        /*
            Only Cloudinary URLs
            are sent to MongoDB.
        */

        formData.images =
            productImages
                .filter(
                    (image) =>
                        image.isExisting &&
                        image.url
                )
                .map(
                    (image) =>
                        image.url
                );


        /*
            Create or update product.
        */

        if (editingProductId) {

            await updateProduct(
                editingProductId,
                formData
            );

        } else {

            await createProduct(
                formData
            );
        }


    } catch (error) {

        console.error(
            "Save product error:",
            error
        );


        showProductFormError(
            error.message ||
            "Failed to save product."
        );

    } finally {

        setSaveButtonLoading(
            false
        );
    }
}


/* =========================================================
   COLLECT PRODUCT FORM DATA
========================================================= */

function collectProductFormData() {

    const sizes =
        Array.from(
            document.querySelectorAll(
                'input[name="sizes"]:checked'
            )
        ).map(
            (checkbox) =>
                checkbox.value
        );


    const colors =
        collectColors();


    const compareAtPriceValue =
        productCompareAtPrice
            ? productCompareAtPrice.value.trim()
            : "";


    return {

        name:
            productName
                ? productName.value.trim()
                : "",


        description:
            productDescription
                ? productDescription.value.trim()
                : "",


        brand:
            productBrand
                ? productBrand.value.trim()
                : "",


        category:
            productCategory
                ? productCategory.value
                : "",


        price:
            productPrice &&
            productPrice.value !== ""
                ? Number(
                    productPrice.value
                )
                : NaN,


        compareAtPrice:
            compareAtPriceValue !== ""
                ? Number(
                    compareAtPriceValue
                )
                : undefined,


        sku:
            productSku
                ? productSku.value.trim()
                : "",


        stock:
            productStock &&
            productStock.value !== ""
                ? Number(
                    productStock.value
                )
                : NaN,


        sizes,

        colors,

        images: [],


        isFeatured:
            productFeatured
                ? productFeatured.checked
                : false,


        isActive:
            productActive
                ? productActive.checked
                : true,
    };
}


/* =========================================================
   VALIDATE PRODUCT FORM
========================================================= */

function validateProductForm(
    data
) {

    if (!data.name) {

        return "Product name is required.";
    }


    if (
        data.name.length <
        2
    ) {

        return "Product name must be at least 2 characters long.";
    }


    if (!data.description) {

        return "Product description is required.";
    }


    if (!data.brand) {

        return "Product brand is required.";
    }


    if (!data.category) {

        return "Please select a category.";
    }


    if (
        !Number.isFinite(
            data.price
        ) ||
        data.price < 0
    ) {

        return "Please enter a valid product price.";
    }


    if (
        data.compareAtPrice !==
        undefined
    ) {

        if (
            !Number.isFinite(
                data.compareAtPrice
            ) ||
            data.compareAtPrice < 0
        ) {

            return "Please enter a valid compare-at price.";
        }


        if (
            data.compareAtPrice <=
            data.price
        ) {

            return "Compare-at price must be greater than the current price.";
        }
    }


    if (!data.sku) {

        return "Product SKU is required.";
    }


    if (
        !Number.isFinite(
            data.stock
        ) ||
        data.stock < 0
    ) {

        return "Product stock cannot be negative.";
    }


    if (
        !Number.isInteger(
            data.stock
        )
    ) {

        return "Product stock must be a whole number.";
    }


    if (
        data.colors.length >
        0
    ) {

        for (
            const color of data.colors
        ) {

            if (!color.name) {

                return "Every color must have a name.";
            }


            if (
                !isValidHex(
                    color.hex
                )
            ) {

                return `Invalid hex color: ${color.hex}`;
            }
        }
    }


    return null;
}


/* =========================================================
   CREATE PRODUCT
========================================================= */

async function createProduct(
    data
) {

    const response =
        await fetch(
            PRODUCTS_API_URL,
            {
                method: "POST",

                headers:
                    getJsonAuthHeaders(),

                body:
                    JSON.stringify(
                        data
                    ),
            }
        );


    const result =
        await parseJsonResponse(
            response
        );


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        handleUnauthorized();

        return;
    }


    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Failed to create product."
        );
    }


    showToast(
        "Product created successfully."
    );


    closeProductModal();


    await loadProducts();
}


/* =========================================================
   UPDATE PRODUCT
========================================================= */

async function updateProduct(
    productId,
    data
) {

    const response =
        await fetch(
            `${PRODUCTS_API_URL}/${productId}`,
            {
                method: "PUT",

                headers:
                    getJsonAuthHeaders(),

                body:
                    JSON.stringify(
                        data
                    ),
            }
        );


    const result =
        await parseJsonResponse(
            response
        );


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        handleUnauthorized();

        return;
    }


    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Failed to update product."
        );
    }


    /*
        If active status changed,
        update it separately because
        the current backend UpdateProductData
        does not contain isActive.
    */

    const originalProduct =
        products.find(
            (product) =>
                product._id ===
                productId
        );


    if (
        originalProduct &&
        productActive &&
        originalProduct.isActive !==
        productActive.checked
    ) {

        await updateProductStatus(
            productId,
            productActive.checked,
            false
        );
    }


    showToast(
        "Product updated successfully."
    );


    closeProductModal();


    await loadProducts();
}


/* =========================================================
   IMAGE SELECTION
========================================================= */

function handleImageSelection() {

    if (
        !productImageFiles ||
        !productImageFiles.files.length
    ) {

        return;
    }


    const selectedFiles =
        Array.from(
            productImageFiles.files
        );


    const remainingSlots =
        MAX_PRODUCT_IMAGES -
        productImages.length;


    if (
        selectedFiles.length >
        remainingSlots
    ) {

        showProductFormError(
            `You can select only ${remainingSlots} more image${
                remainingSlots === 1
                    ? ""
                    : "s"
            }. Maximum ${MAX_PRODUCT_IMAGES} images are allowed.`
        );


        productImageFiles.value =
            "";


        return;
    }


    /*
        Validate file type
        and file size.
    */

    for (
        const file of selectedFiles
    ) {

        if (
            ![
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(
                file.type
            )
        ) {

            showProductFormError(
                `${file.name} is not a supported image type. Use JPEG, PNG, or WEBP.`
            );


            productImageFiles.value =
                "";


            return;
        }


        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {

            showProductFormError(
                `${file.name} is larger than 5 MB.`
            );


            productImageFiles.value =
                "";


            return;
        }
    }


    clearProductFormError();


    /*
        Add local preview objects.
        They will be replaced with
        Cloudinary URLs when saved.
    */

    selectedFiles.forEach(
        (file) => {

            const previewUrl =
                URL.createObjectURL(
                    file
                );


            productImages.push({

                url:
                    previewUrl,

                isExisting:
                    false,

                file,

            });
        }
    );


    renderImagePreviews();


    updateImageInput();


    updateImageStatus(
        `${selectedFiles.length} image${
            selectedFiles.length === 1
                ? ""
                : "s"
        } selected. They will be uploaded when you save.`,
        false
    );


    /*
        Clear input so the same
        file can be selected again.
    */

    productImageFiles.value =
        "";
}


/* =========================================================
   UPLOAD SELECTED IMAGES
========================================================= */

async function uploadSelectedImages() {

    const newImages =
        productImages.filter(
            (image) =>
                !image.isExisting &&
                image.file
        );


    if (
        newImages.length === 0
    ) {

        return;
    }


    const formData =
        new FormData();


    newImages.forEach(
        (image) => {

            formData.append(
                "images",
                image.file
            );
        }
    );


    updateImageStatus(
        `Uploading ${newImages.length} image${
            newImages.length === 1
                ? ""
                : "s"
        } to Cloudinary...`,
        true
    );


    setImageUploadLoading(
        true
    );


    try {

        const response =
            await fetch(
                UPLOAD_API_URL,
                {
                    method: "POST",

                    /*
                        IMPORTANT:
                        Do NOT set Content-Type here.
                        Browser sets multipart/form-data
                        boundary automatically.
                    */

                    headers:
                        getAuthHeaders(),

                    body:
                        formData,
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

            throw new Error(
                "Admin session expired."
            );
        }


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to upload product images."
            );
        }


        const uploadedUrls =
            result.data?.images ||
            [];


        if (
            uploadedUrls.length !==
            newImages.length
        ) {

            throw new Error(
                "Cloudinary returned an unexpected number of image URLs."
            );
        }


        /*
            Replace temporary browser
            URLs with Cloudinary URLs.
        */

        let uploadIndex =
            0;


        productImages =
            productImages.map(
                (image) => {

                    if (
                        image.isExisting
                    ) {

                        return image;
                    }


                    const uploadedUrl =
                        uploadedUrls[
                            uploadIndex
                        ];


                    uploadIndex++;


                    /*
                        Release temporary
                        object URL.
                    */

                    if (
                        image.url.startsWith(
                            "blob:"
                        )
                    ) {

                        URL.revokeObjectURL(
                            image.url
                        );
                    }


                    return {

                        url:
                            uploadedUrl,

                        isExisting:
                            true,
                    };
                }
            );


        updateImageInput();


        renderImagePreviews();


        updateImageStatus(
            `${uploadedUrls.length} image${
                uploadedUrls.length === 1
                    ? ""
                    : "s"
            } uploaded successfully.`,
            false
        );


    } finally {

        setImageUploadLoading(
            false
        );
    }
}


/* =========================================================
   UPDATE HIDDEN IMAGE INPUT
========================================================= */

function updateImageInput() {

    if (!productImagesInput) {
        return;
    }


    const urls =
        productImages
            .filter(
                (image) =>
                    image.isExisting &&
                    image.url
            )
            .map(
                (image) =>
                    image.url
            );


    productImagesInput.value =
        urls.join("\n");
}


/* =========================================================
   RENDER IMAGE PREVIEWS
========================================================= */

function renderImagePreviews() {

    if (!productImagePreview) {
        return;
    }


    productImagePreview.innerHTML =
        "";


    productImages.forEach(
        (image, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "product-image-preview-item";


            if (
                !image.isExisting
            ) {

                item.classList.add(
                    "pending"
                );
            }


            const imageElement =
                document.createElement(
                    "img"
                );


            imageElement.className =
                "product-image-preview-image";


            imageElement.src =
                image.url;


            imageElement.alt =
                `Product image ${index + 1}`;


            imageElement.loading =
                "lazy";


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "product-image-preview-remove";


            removeButton.textContent =
                "×";


            removeButton.setAttribute(
                "aria-label",
                `Remove image ${index + 1}`
            );


            removeButton.title =
                "Remove image";


            removeButton.addEventListener(
                "click",
                () => {

                    removeProductImage(
                        index
                    );
                }
            );


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "product-image-preview-label";


            if (
                index === 0
            ) {

                label.textContent =
                    "Main image";

            } else {

                label.textContent =
                    `Image ${index + 1}`;
            }


            if (
                !image.isExisting
            ) {

                label.textContent +=
                    " · Pending";
            }


            item.appendChild(
                imageElement
            );


            item.appendChild(
                removeButton
            );


            item.appendChild(
                label
            );


            productImagePreview.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   REMOVE PRODUCT IMAGE
========================================================= */

function removeProductImage(
    index
) {

    const image =
        productImages[index];


    if (!image) {
        return;
    }


    /*
        Revoke temporary local
        browser preview.
    */

    if (
        !image.isExisting &&
        image.url.startsWith(
            "blob:"
        )
    ) {

        URL.revokeObjectURL(
            image.url
        );
    }


    productImages.splice(
        index,
        1
    );


    updateImageInput();

    renderImagePreviews();


    if (
        productImages.length === 0
    ) {

        updateImageStatus(
            "",
            false
        );

    } else {

        updateImageStatus(
            `${productImages.length} image${
                productImages.length === 1
                    ? ""
                    : "s"
            } selected.`,
            false
        );
    }
}


/* =========================================================
   REVOKE PENDING IMAGE URLS
========================================================= */

function revokePendingImageUrls() {

    productImages.forEach(
        (image) => {

            if (
                !image.isExisting &&
                image.url &&
                image.url.startsWith(
                    "blob:"
                )
            ) {

                URL.revokeObjectURL(
                    image.url
                );
            }
        }
    );
}


/* =========================================================
   IMAGE STATUS
========================================================= */

function updateImageStatus(
    message,
    loading
) {

    if (
        !imageUploadStatus ||
        !imageUploadStatusText
    ) {

        return;
    }


    if (!message) {

        imageUploadStatus.hidden =
            true;

        return;
    }


    imageUploadStatus.hidden =
        false;


    imageUploadStatusText.textContent =
        message;


    if (
        imageUploadStatusIcon
    ) {

        imageUploadStatusIcon.textContent =
            loading
                ? "..."
                : "✓";
    }
}


/* =========================================================
   IMAGE UPLOAD LOADING
========================================================= */

function setImageUploadLoading(
    loading
) {

    if (!imageUploadBox) {
        return;
    }


    if (loading) {

        imageUploadBox.style.pointerEvents =
            "none";

        imageUploadBox.style.opacity =
            "0.6";

    } else {

        imageUploadBox.style.pointerEvents =
            "";

        imageUploadBox.style.opacity =
            "";
    }
}


/* =========================================================
   COLOR EDITOR
========================================================= */

function addColorRow(
    name = "",
    hex = "#000000"
) {

    if (!colorsList) {
        return;
    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "color-editor-row";


    const nameInput =
        document.createElement(
            "input"
        );


    nameInput.type =
        "text";


    nameInput.className =
        "color-name-input";


    nameInput.placeholder =
        "Color name";


    nameInput.maxLength =
        30;


    nameInput.value =
        name;


    const hexInput =
        document.createElement(
            "input"
        );


    hexInput.type =
        "color";


    hexInput.className =
        "color-hex-input";


    hexInput.value =
        isValidHex(hex)
            ? hex.toUpperCase()
            : "#000000";


    hexInput.title =
        "Choose color";


    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";


    removeButton.className =
        "remove-color-button";


    removeButton.textContent =
        "×";


    removeButton.setAttribute(
        "aria-label",
        "Remove color"
    );


    removeButton.title =
        "Remove color";


    removeButton.addEventListener(
        "click",
        () => {

            row.remove();


            if (
                colorsList.children
                    .length === 0
            ) {

                addColorRow();
            }
        }
    );


    row.appendChild(
        nameInput
    );


    row.appendChild(
        hexInput
    );


    row.appendChild(
        removeButton
    );


    colorsList.appendChild(
        row
    );
}


/* =========================================================
   COLLECT COLORS
========================================================= */

function collectColors() {

    if (!colorsList) {
        return [];
    }


    const rows =
        colorsList.querySelectorAll(
            ".color-editor-row"
        );


    return Array.from(
        rows
    )
        .map(
            (row) => {

                const nameInput =
                    row.querySelector(
                        ".color-name-input"
                    );


                const hexInput =
                    row.querySelector(
                        ".color-hex-input"
                    );


                return {

                    name:
                        nameInput
                            ? nameInput.value
                                .trim()
                            : "",


                    hex:
                        hexInput
                            ? hexInput.value
                                .toUpperCase()
                            : "#000000",
                };
            }
        )
        .filter(
            (color) =>
                color.name
        );
}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(
    productId
) {

    const product =
        products.find(
            (item) =>
                item._id ===
                productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    deletingProductId =
        productId;


    if (deleteProductName) {

        deleteProductName.innerHTML =
            `Are you sure you want to delete <strong>${escapeHtml(
                product.name
            )}</strong>?`;
    }


    if (deleteModal) {

        deleteModal.hidden =
            false;


        document.body.classList.add(
            "modal-open"
        );
    }
}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    if (deleteModal) {

        deleteModal.hidden =
            true;
    }


    deletingProductId =
        null;


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


    setDeleteButtonLoading(
        true
    );


    try {

        const response =
            await fetch(
                `${PRODUCTS_API_URL}/${deletingProductId}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders(),
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

            return;
        }


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Failed to delete product."
            );
        }


        showToast(
            "Product deleted successfully."
        );


        closeDeleteModal();


        await loadProducts();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showToast(
            error.message ||
            "Failed to delete product."
        );


    } finally {

        setDeleteButtonLoading(
            false
        );
    }
}


/* =========================================================
   TOGGLE PRODUCT STATUS
========================================================= */

async function toggleProductStatus(
    productId,
    forcedStatus = null,
    showMessage = true
) {

    const product =
        products.find(
            (item) =>
                item._id ===
                productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    const newStatus =
        forcedStatus !== null
            ? forcedStatus
            : !product.isActive;


    try {

        await updateProductStatus(
            productId,
            newStatus,
            showMessage
        );


        if (showMessage) {

            await loadProducts();
        }


    } catch (error) {

        console.error(
            "Toggle product status error:",
            error
        );


        showToast(
            error.message ||
            "Failed to update product status."
        );
    }
}


/* =========================================================
   UPDATE PRODUCT STATUS
========================================================= */

async function updateProductStatus(
    productId,
    isActive,
    showMessage = true
) {

    const response =
        await fetch(
            `${PRODUCTS_API_URL}/${productId}/status`,
            {
                method: "PATCH",

                headers:
                    getJsonAuthHeaders(),

                body:
                    JSON.stringify({
                        isActive,
                    }),
            }
        );


    const result =
        await parseJsonResponse(
            response
        );


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        handleUnauthorized();

        throw new Error(
            "Admin session expired."
        );
    }


    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Failed to update product status."
        );
    }


    if (showMessage) {

        showToast(
            isActive
                ? "Product activated successfully."
                : "Product deactivated successfully."
        );
    }
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    if (!productsPagination) {
        return;
    }


    const totalPages =
        Math.ceil(
            filteredProducts.length /
            PRODUCTS_PER_PAGE
        );


    productsPagination.innerHTML =
        "";


    if (
        totalPages <= 1
    ) {

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


    const pages =
        getPaginationPages(
            currentPage,
            totalPages
        );


    pages.forEach(
        (page) => {

            if (
                page ===
                "..."
            ) {

                const ellipsis =
                    document.createElement(
                        "span"
                    );


                ellipsis.className =
                    "pagination-ellipsis";


                ellipsis.textContent =
                    "…";


                productsPagination.appendChild(
                    ellipsis
                );


                return;
            }


            const button =
                createPaginationButton(
                    String(page),
                    page,
                    false
                );


            if (
                page ===
                currentPage
            ) {

                button.classList.add(
                    "active"
                );
            }


            productsPagination.appendChild(
                button
            );
        }
    );


    const nextButton =
        createPaginationButton(
            "›",
            currentPage + 1,
            currentPage ===
                totalPages
        );


    productsPagination.appendChild(
        nextButton
    );
}


/* =========================================================
   PAGINATION PAGES
========================================================= */

function getPaginationPages(
    current,
    total
) {

    if (
        total <= 7
    ) {

        return Array.from(
            {
                length:
                    total,
            },
            (_, index) =>
                index + 1
        );
    }


    if (
        current <= 4
    ) {

        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            total,
        ];
    }


    if (
        current >=
        total - 3
    ) {

        return [
            1,
            "...",
            total - 4,
            total - 3,
            total - 2,
            total - 1,
            total,
        ];
    }


    return [
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total,
    ];
}


/* =========================================================
   CREATE PAGINATION BUTTON
========================================================= */

function createPaginationButton(
    text,
    page,
    disabled
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "pagination-button";


    button.textContent =
        text;


    button.disabled =
        disabled;


    button.addEventListener(
        "click",
        () => {

            currentPage =
                page;


            renderProducts();


            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    );


    return button;
}


/* =========================================================
   RESULTS COUNT
========================================================= */

function updateResultsCount() {

    if (!productsResultsInfo) {
        return;
    }


    const total =
        filteredProducts.length;


    if (
        total === 0
    ) {

        productsResultsInfo.textContent =
            "Showing 0 products";

        return;
    }


    const start =
        (
            currentPage - 1
        ) *
        PRODUCTS_PER_PAGE +
        1;


    const end =
        Math.min(
            currentPage *
                PRODUCTS_PER_PAGE,
            total
        );


    productsResultsInfo.textContent =
        `Showing ${start}–${end} of ${total} products`;
}


/* =========================================================
   PRODUCT FORM ERROR
========================================================= */

function showProductFormError(
    message
) {

    if (!productFormError) {

        showToast(
            message
        );

        return;
    }


    productFormError.textContent =
        message;


    productFormError.hidden =
        false;
}


function clearProductFormError() {

    if (!productFormError) {
        return;
    }


    productFormError.textContent =
        "";


    productFormError.hidden =
        true;
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

        saveProductButton.dataset
            .originalText =
            saveProductButton.textContent
                .trim();


        saveProductButton.textContent =
            editingProductId
                ? "Updating..."
                : "Creating...";

    } else {

        saveProductButton.textContent =
            saveProductButton.dataset
                .originalText ||
            "Save Product";
    }
}


/* =========================================================
   DELETE BUTTON LOADING
========================================================= */

function setDeleteButtonLoading(
    loading
) {

    if (
        !confirmDeleteProductButton
    ) {

        return;
    }


    confirmDeleteProductButton.disabled =
        loading;


    if (loading) {

        confirmDeleteProductButton.dataset
            .originalText =
            confirmDeleteProductButton.textContent
                .trim();


        confirmDeleteProductButton.textContent =
            "Deleting...";

    } else {

        confirmDeleteProductButton.textContent =
            confirmDeleteProductButton.dataset
                .originalText ||
            "Delete Product";
    }
}


/* =========================================================
   PRODUCTS LOADING STATE
========================================================= */

function showProductsLoading() {

    if (productsLoading) {

        productsLoading.hidden =
            false;
    }


    if (productsTableWrapper) {

        productsTableWrapper.hidden =
            true;
    }


    if (productsTableFooter) {

        productsTableFooter.hidden =
            true;
    }


    hideProductsError();

    hideProductsEmpty();
}


function hideProductsLoading() {

    if (productsLoading) {

        productsLoading.hidden =
            true;
    }
}


/* =========================================================
   PRODUCTS ERROR STATE
========================================================= */

function showProductsError(
    message
) {

    if (productsLoading) {

        productsLoading.hidden =
            true;
    }


    if (productsTableWrapper) {

        productsTableWrapper.hidden =
            true;
    }


    if (productsTableFooter) {

        productsTableFooter.hidden =
            true;
    }


    hideProductsEmpty();


    if (productsError) {

        productsError.hidden =
            false;
    }


    if (productsErrorMessage) {

        productsErrorMessage.textContent =
            message;
    }
}


function hideProductsError() {

    if (productsError) {

        productsError.hidden =
            true;
    }
}


/* =========================================================
   EMPTY STATE
========================================================= */

function showProductsEmpty() {

    if (productsEmpty) {

        productsEmpty.hidden =
            false;
    }


    if (productsTableWrapper) {

        productsTableWrapper.hidden =
            true;
    }


    if (productsTableFooter) {

        productsTableFooter.hidden =
            true;
    }
}


function hideProductsEmpty() {

    if (productsEmpty) {

        productsEmpty.hidden =
            true;
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    if (!adminToast) {
        return;
    }


    const messageElement =
        adminToast.querySelector(
            ".toast-message"
        );


    if (messageElement) {

        messageElement.textContent =
            message;
    }


    adminToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
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
   UNAUTHORIZED
========================================================= */

function handleUnauthorized() {

    localStorage.removeItem(
        "hipsterAdminToken"
    );


    localStorage.removeItem(
        "hipsterAdminUser"
    );


    window.location.href =
        "login.html";
}


/* =========================================================
   PARSE JSON RESPONSE
========================================================= */

async function parseJsonResponse(
    response
) {

    const text =
        await response.text();


    if (!text) {

        return {};
    }


    try {

        return JSON.parse(
            text
        );

    } catch (error) {

        console.error(
            "Invalid JSON response:",
            error
        );


        return {
            success: false,

            message:
                "Server returned an invalid response.",
        };
    }
}


/* =========================================================
   CATEGORY HELPERS
========================================================= */

function getCategoryId(
    category
) {

    if (!category) {

        return "";
    }


    if (
        typeof category ===
        "string"
    ) {

        return category;
    }


    return (
        category._id ||
        ""
    );
}


function getCategoryName(
    category
) {

    if (!category) {

        return "—";
    }


    if (
        typeof category ===
        "object"
    ) {

        return (
            category.name ||
            getCategoryNameById(
                category._id
            ) ||
            "—"
        );
    }


    return (
        getCategoryNameById(
            category
        ) ||
        "—"
    );
}


function getCategoryNameById(
    categoryId
) {

    if (!categoryId) {

        return "";
    }


    const category =
        categories.find(
            (item) =>
                item._id ===
                categoryId
        );


    return category
        ? category.name
        : "";
}


/* =========================================================
   STOCK HELPERS
========================================================= */

function getStockClass(
    stock
) {

    if (
        stock === 0
    ) {

        return "out-of-stock";
    }


    if (
        stock <= 5
    ) {

        return "low-stock";
    }


    return "in-stock";
}


/* =========================================================
   PRICE FORMATTER
========================================================= */

function formatPrice(
    price
) {

    const number =
        Number(price);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "$0.00";
    }


    return `$${number.toFixed(2)}`;
}


/* =========================================================
   HEX VALIDATION
========================================================= */

function isValidHex(
    value
) {

    return /^#[0-9A-Fa-f]{6}$/.test(
        value
    );
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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