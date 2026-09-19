/* =========================================================
   HIPSTER ADMIN
   CATEGORY MANAGEMENT
========================================================= */

const API_BASE_URL =
    "http://localhost:5000/api/categories";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const categoriesTableBody =
    document.getElementById(
        "categoryTableBody"
    );

const categorySearchInput =
    document.getElementById(
        "categorySearch"
    );

const addCategoryButton =
    document.getElementById(
        "addCategoryButton"
    );

const emptyAddCategoryButton =
    document.getElementById(
        "emptyAddCategoryButton"
    );

const categoryModal =
    document.getElementById(
        "categoryModal"
    );

const categoryModalTitle =
    document.getElementById(
        "categoryModalTitle"
    );

const categoryModalDescription =
    document.getElementById(
        "categoryModalDescription"
    );

const closeCategoryModalButton =
    document.getElementById(
        "closeCategoryModal"
    );

const cancelCategoryButton =
    document.getElementById(
        "cancelCategoryButton"
    );

const categoryForm =
    document.getElementById(
        "categoryForm"
    );

const categoryIdInput =
    document.getElementById(
        "categoryId"
    );

const categoryNameInput =
    document.getElementById(
        "categoryName"
    );

const categoryDescriptionInput =
    document.getElementById(
        "categoryDescription"
    );

const categoryStatusGroup =
    document.getElementById(
        "categoryStatusGroup"
    );

const categoryStatusInput =
    document.getElementById(
        "categoryStatus"
    );

const categoryFormError =
    document.getElementById(
        "categoryFormError"
    );

const saveCategoryButton =
    document.getElementById(
        "saveCategoryButton"
    );

const saveCategoryButtonText =
    document.getElementById(
        "saveCategoryButtonText"
    );

const deleteModal =
    document.getElementById(
        "deleteModal"
    );

const cancelDeleteButton =
    document.getElementById(
        "cancelDeleteButton"
    );

const confirmDeleteButton =
    document.getElementById(
        "confirmDeleteButton"
    );

const totalCategoriesElement =
    document.getElementById(
        "totalCategories"
    );

const activeCategoriesElement =
    document.getElementById(
        "activeCategories"
    );

const inactiveCategoriesElement =
    document.getElementById(
        "inactiveCategories"
    );

const emptyState =
    document.getElementById(
        "emptyCategoryState"
    );

const tableWrapper =
    document.querySelector(
        ".category-table-wrapper"
    );


/* =========================================================
   STATE
========================================================= */

let categories = [];

let categoryToDelete = null;


/* =========================================================
   AUTHENTICATION
========================================================= */

const getAdminToken = () => {

    return localStorage.getItem(
        "hipsterAdminToken"
    );
};


/* =========================================================
   API HELPER
========================================================= */

const apiRequest = async (
    url,
    options = {}
) => {

    const token =
        getAdminToken();

    const headers = {
        "Content-Type":
            "application/json",

        ...(options.headers || {}),
    };


    /*
        Protected API requests require
        the admin JWT.
    */

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    const response =
        await fetch(
            url,
            {
                ...options,
                headers,
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch (error) {

        data = null;
    }


    if (!response.ok) {

        throw new Error(
            data?.message ||
            `Request failed with status ${response.status}`
        );
    }


    return data;
};


/* =========================================================
   LOAD CATEGORIES
========================================================= */

const loadCategories = async () => {

    try {

        showLoadingState();


        const response =
            await apiRequest(
                API_BASE_URL
            );


        categories =
            response?.data?.categories ||
            [];


        renderCategories(
            categories
        );


        updateCategorySummary(
            categories
        );

    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );


        showTableError(
            error.message ||
            "Failed to load categories."
        );
    }
};


/* =========================================================
   RENDER CATEGORIES
========================================================= */

const renderCategories = (
    categoryList
) => {

    if (!categoriesTableBody) {
        return;
    }


    categoriesTableBody.innerHTML = "";


    if (
        !categoryList ||
        categoryList.length === 0
    ) {

        showEmptyState();

        return;
    }


    hideEmptyState();


    categoryList.forEach(
        (category) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.className =
                "category-row";


            row.innerHTML = `
                <td>

                    <div class="category-name">

                        <span class="category-avatar">
                            ${escapeHtml(
                                getCategoryInitial(
                                    category.name
                                )
                            )}
                        </span>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    category.name
                                )}
                            </strong>

                            <small>
                                Store category
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <code>
                        ${escapeHtml(
                            category.slug
                        )}
                    </code>

                </td>


                <td>

                    <span class="category-description">

                        ${
                            category.description
                                ? escapeHtml(
                                    category.description
                                )
                                : "No description"
                        }

                    </span>

                </td>


                <td>

                    <span
                        class="status-badge ${
                            category.isActive
                                ? "active"
                                : "inactive"
                        }"
                    >
                        ${
                            category.isActive
                                ? "Active"
                                : "Inactive"
                        }
                    </span>

                </td>


                <td>

                    <span class="created-date">

                        ${formatDate(
                            category.createdAt
                        )}

                    </span>

                </td>


                <td>

                    <div class="category-actions">


                        <button
                            type="button"
                            class="table-action edit"
                            data-action="edit"
                            data-id="${category._id}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="table-action status"
                            data-action="status"
                            data-id="${category._id}"
                        >
                            ${
                                category.isActive
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>


                        <button
                            type="button"
                            class="table-action delete"
                            data-action="delete"
                            data-id="${category._id}"
                        >
                            Delete
                        </button>


                    </div>

                </td>
            `;


            categoriesTableBody.appendChild(
                row
            );
        }
    );
};


/* =========================================================
   SUMMARY
========================================================= */

const updateCategorySummary = (
    categoryList
) => {

    const total =
        categoryList.length;


    const active =
        categoryList.filter(
            (category) =>
                category.isActive
        ).length;


    const inactive =
        categoryList.filter(
            (category) =>
                !category.isActive
        ).length;


    if (totalCategoriesElement) {

        totalCategoriesElement.textContent =
            total;
    }


    if (activeCategoriesElement) {

        activeCategoriesElement.textContent =
            active;
    }


    if (inactiveCategoriesElement) {

        inactiveCategoriesElement.textContent =
            inactive;
    }
};


/* =========================================================
   SEARCH
========================================================= */

const searchCategories = () => {

    const searchTerm =
        categorySearchInput?.value
            .trim()
            .toLowerCase() || "";


    if (!searchTerm) {

        renderCategories(
            categories
        );

        return;
    }


    const filteredCategories =
        categories.filter(
            (category) => {

                return (

                    category.name
                        ?.toLowerCase()
                        .includes(
                            searchTerm
                        )

                    ||

                    category.slug
                        ?.toLowerCase()
                        .includes(
                            searchTerm
                        )

                    ||

                    category.description
                        ?.toLowerCase()
                        .includes(
                            searchTerm
                        )
                );
            }
        );


    renderCategories(
        filteredCategories
    );
};


/* =========================================================
   OPEN ADD CATEGORY MODAL
========================================================= */

const openAddCategoryModal = () => {

    if (!categoryModal) {
        return;
    }


    categoryModalTitle.textContent =
        "Add Category";


    if (categoryModalDescription) {

        categoryModalDescription.textContent =
            "Create a new store category.";
    }


    categoryIdInput.value = "";

    categoryNameInput.value = "";

    categoryDescriptionInput.value = "";


    if (categoryStatusGroup) {

        categoryStatusGroup.hidden =
            true;
    }


    if (categoryFormError) {

        categoryFormError.textContent =
            "";

        categoryFormError.hidden =
            true;
    }


    if (saveCategoryButtonText) {

        saveCategoryButtonText.textContent =
            "Create Category";
    }


    /*
        IMPORTANT:
        Remove hidden so the modal
        actually becomes visible.
    */

    categoryModal.hidden =
        false;


    categoryModal.classList.add(
        "is-open"
    );


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            categoryNameInput?.focus();

        },
        100
    );
};


/* =========================================================
   OPEN EDIT CATEGORY MODAL
========================================================= */

const openEditCategoryModal = (
    categoryId
) => {

    const category =
        categories.find(
            (item) =>
                item._id === categoryId
        );


    if (!category) {

        console.error(
            "Category not found:",
            categoryId
        );

        return;
    }


    categoryModalTitle.textContent =
        "Edit Category";


    if (categoryModalDescription) {

        categoryModalDescription.textContent =
            "Update your store category.";
    }


    categoryIdInput.value =
        category._id;


    categoryNameInput.value =
        category.name || "";


    categoryDescriptionInput.value =
        category.description || "";


    if (categoryStatusGroup) {

        categoryStatusGroup.hidden =
            false;
    }


    if (categoryStatusInput) {

        categoryStatusInput.value =
            category.isActive
                ? "true"
                : "false";
    }


    clearFormError();


    if (saveCategoryButtonText) {

        saveCategoryButtonText.textContent =
            "Save Changes";
    }


    categoryModal.hidden =
        false;


    categoryModal.classList.add(
        "is-open"
    );


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {

            categoryNameInput?.focus();

        },
        100
    );
};


/* =========================================================
   CLOSE CATEGORY MODAL
========================================================= */

const closeCategoryModal = () => {

    if (!categoryModal) {
        return;
    }


    categoryModal.classList.remove(
        "is-open"
    );


    categoryModal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );
};


/* =========================================================
   SAVE CATEGORY
========================================================= */

const saveCategory = async (
    event
) => {

    event.preventDefault();


    const name =
        categoryNameInput.value.trim();


    const description =
        categoryDescriptionInput.value.trim();


    const categoryId =
        categoryIdInput.value.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        showFormError(
            "Category name is required."
        );

        categoryNameInput.focus();

        return;
    }


    if (name.length < 2) {

        showFormError(
            "Category name must be at least 2 characters long."
        );

        categoryNameInput.focus();

        return;
    }


    if (name.length > 50) {

        showFormError(
            "Category name cannot exceed 50 characters."
        );

        categoryNameInput.focus();

        return;
    }


    if (description.length > 300) {

        showFormError(
            "Category description cannot exceed 300 characters."
        );

        categoryDescriptionInput.focus();

        return;
    }


    /* =====================================================
       AUTH CHECK
    ===================================================== */

    const token =
        getAdminToken();


    if (!token) {

        showFormError(
            "You are not logged in as an administrator. Please log in again."
        );

        return;
    }


    clearFormError();


    setSaveButtonLoading(
        true
    );


    try {

        /* =================================================
           CREATE
        ================================================= */

        if (!categoryId) {

            await apiRequest(
                API_BASE_URL,
                {
                    method: "POST",

                    body: JSON.stringify({
                        name,
                        description,
                    }),
                }
            );


            closeCategoryModal();


            await loadCategories();


            showSuccessMessage(
                "Category created successfully."
            );


            return;
        }


        /* =================================================
           UPDATE
        ================================================= */

        await apiRequest(
            `${API_BASE_URL}/${categoryId}`,
            {
                method: "PUT",

                body: JSON.stringify({
                    name,
                    description,
                }),
            }
        );


        /* =================================================
           UPDATE STATUS
        ================================================= */

        const originalCategory =
            categories.find(
                (category) =>
                    category._id ===
                    categoryId
            );


        const selectedStatus =
            categoryStatusInput?.value ===
            "true";


        if (
            originalCategory &&
            originalCategory.isActive !==
                selectedStatus
        ) {

            await apiRequest(
                `${API_BASE_URL}/${categoryId}/status`,
                {
                    method: "PATCH",

                    body: JSON.stringify({
                        isActive:
                            selectedStatus,
                    }),
                }
            );
        }


        closeCategoryModal();


        await loadCategories();


        showSuccessMessage(
            "Category updated successfully."
        );

    } catch (error) {

        console.error(
            "Failed to save category:",
            error
        );


        showFormError(
            error.message ||
            "Failed to save category."
        );

    } finally {

        setSaveButtonLoading(
            false
        );
    }
};


/* =========================================================
   CHANGE CATEGORY STATUS
========================================================= */

const changeCategoryStatus = async (
    categoryId
) => {

    const category =
        categories.find(
            (item) =>
                item._id === categoryId
        );


    if (!category) {
        return;
    }


    const newStatus =
        !category.isActive;


    const actionText =
        newStatus
            ? "activate"
            : "deactivate";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionText} "${category.name}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `${API_BASE_URL}/${categoryId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    isActive:
                        newStatus,
                }),
            }
        );


        await loadCategories();


        showSuccessMessage(
            `Category ${
                newStatus
                    ? "activated"
                    : "deactivated"
            } successfully.`
        );

    } catch (error) {

        console.error(
            "Failed to change category status:",
            error
        );


        showErrorMessage(
            error.message ||
            "Failed to update category status."
        );
    }
};


/* =========================================================
   OPEN DELETE MODAL
========================================================= */

const openDeleteModal = (
    categoryId
) => {

    const category =
        categories.find(
            (item) =>
                item._id === categoryId
        );


    if (!category) {
        return;
    }


    categoryToDelete =
        category;


    const deleteMessage =
        document.getElementById(
            "deleteModalMessage"
        );


    if (deleteMessage) {

        deleteMessage.textContent =
            `The category "${category.name}" will be deactivated. Products using it will not be deleted.`;
    }


    deleteModal?.classList.add(
        "is-open"
    );


    if (deleteModal) {

        deleteModal.hidden =
            false;
    }


    document.body.classList.add(
        "modal-open"
    );
};


/* =========================================================
   CONFIRM DELETE
========================================================= */

const deleteCategory = async () => {

    if (!categoryToDelete) {
        return;
    }


    const categoryId =
        categoryToDelete._id;


    try {

        setDeleteButtonLoading(
            true
        );


        await apiRequest(
            `${API_BASE_URL}/${categoryId}`,
            {
                method: "DELETE",
            }
        );


        closeDeleteModal();


        categoryToDelete =
            null;


        await loadCategories();


        showSuccessMessage(
            "Category deleted successfully."
        );

    } catch (error) {

        console.error(
            "Failed to delete category:",
            error
        );


        showErrorMessage(
            error.message ||
            "Failed to delete category."
        );

    } finally {

        setDeleteButtonLoading(
            false
        );
    }
};


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

const closeDeleteModal = () => {

    if (deleteModal) {

        deleteModal.classList.remove(
            "is-open"
        );

        deleteModal.hidden =
            true;
    }


    document.body.classList.remove(
        "modal-open"
    );


    categoryToDelete =
        null;
};


/* =========================================================
   TABLE ACTIONS
========================================================= */

const handleCategoryTableClick = (
    event
) => {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {
        return;
    }


    const action =
        button.dataset.action;


    const categoryId =
        button.dataset.id;


    if (!categoryId) {
        return;
    }


    if (action === "edit") {

        openEditCategoryModal(
            categoryId
        );
    }


    if (action === "status") {

        changeCategoryStatus(
            categoryId
        );
    }


    if (action === "delete") {

        openDeleteModal(
            categoryId
        );
    }
};


/* =========================================================
   FORM ERROR
========================================================= */

const showFormError = (
    message
) => {

    if (!categoryFormError) {
        return;
    }


    categoryFormError.textContent =
        message;


    categoryFormError.hidden =
        false;
};


const clearFormError = () => {

    if (!categoryFormError) {
        return;
    }


    categoryFormError.textContent =
        "";


    categoryFormError.hidden =
        true;
};


/* =========================================================
   SAVE BUTTON LOADING
========================================================= */

const setSaveButtonLoading = (
    loading
) => {

    if (!saveCategoryButton) {
        return;
    }


    if (loading) {

        saveCategoryButton.disabled =
            true;


        if (saveCategoryButtonText) {

            saveCategoryButtonText.textContent =
                "Saving...";
        }

    } else {

        saveCategoryButton.disabled =
            false;


        if (
            categoryIdInput.value.trim()
        ) {

            if (saveCategoryButtonText) {

                saveCategoryButtonText.textContent =
                    "Save Changes";
            }

        } else {

            if (saveCategoryButtonText) {

                saveCategoryButtonText.textContent =
                    "Create Category";
            }
        }
    }
};


/* =========================================================
   DELETE BUTTON LOADING
========================================================= */

const setDeleteButtonLoading = (
    loading
) => {

    if (!confirmDeleteButton) {
        return;
    }


    if (loading) {

        confirmDeleteButton.disabled =
            true;

        confirmDeleteButton.textContent =
            "Deleting...";

    } else {

        confirmDeleteButton.disabled =
            false;

        confirmDeleteButton.textContent =
            "Delete Category";
    }
};


/* =========================================================
   LOADING STATE
========================================================= */

const showLoadingState = () => {

    if (!categoriesTableBody) {
        return;
    }


    hideEmptyState();


    categoriesTableBody.innerHTML = `
        <tr>

            <td
                colspan="6"
                class="table-loading"
            >
                Loading categories...
            </td>

        </tr>
    `;
};


/* =========================================================
   TABLE ERROR
========================================================= */

const showTableError = (
    message
) => {

    if (!categoriesTableBody) {
        return;
    }


    hideEmptyState();


    categoriesTableBody.innerHTML = `
        <tr>

            <td
                colspan="6"
                class="table-error"
            >
                ${escapeHtml(message)}
            </td>

        </tr>
    `;
};


/* =========================================================
   EMPTY STATE
========================================================= */

const showEmptyState = () => {

    if (tableWrapper) {

        tableWrapper.style.display =
            "none";
    }


    if (emptyState) {

        emptyState.hidden =
            false;

        emptyState.style.display =
            "block";
    }
};


const hideEmptyState = () => {

    if (tableWrapper) {

        tableWrapper.style.display =
            "block";
    }


    if (emptyState) {

        emptyState.hidden =
            true;

        emptyState.style.display =
            "none";
    }
};


/* =========================================================
   SUCCESS MESSAGE
========================================================= */

const showSuccessMessage = (
    message
) => {

    createToast(
        message,
        "success"
    );
};


/* =========================================================
   ERROR MESSAGE
========================================================= */

const showErrorMessage = (
    message
) => {

    createToast(
        message,
        "error"
    );
};


/* =========================================================
   TOAST
========================================================= */

const createToast = (
    message,
    type
) => {

    const existingToast =
        document.querySelector(
            ".admin-toast"
        );


    if (existingToast) {

        existingToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `admin-toast admin-toast-${type}`;


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );
        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        3000
    );
};


/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (
    dateString
) => {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};


/* =========================================================
   CATEGORY INITIAL
========================================================= */

const getCategoryInitial = (
    name
) => {

    if (!name) {
        return "?";
    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();
};


/* =========================================================
   HTML ESCAPE
========================================================= */

const escapeHtml = (
    value
) => {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
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
};


/* =========================================================
   MODAL BACKDROP CLICK
========================================================= */

const handleModalBackdropClick = (
    event
) => {

    if (
        event.target ===
        categoryModal
    ) {

        closeCategoryModal();
    }


    if (
        event.target ===
        deleteModal
    ) {

        closeDeleteModal();
    }
};


/* =========================================================
   ESCAPE KEY
========================================================= */

const handleEscapeKey = (
    event
) => {

    if (event.key !== "Escape") {
        return;
    }


    closeCategoryModal();

    closeDeleteModal();
};


/* =========================================================
   EVENT LISTENERS
========================================================= */

addCategoryButton?.addEventListener(
    "click",
    openAddCategoryModal
);


emptyAddCategoryButton?.addEventListener(
    "click",
    openAddCategoryModal
);


closeCategoryModalButton?.addEventListener(
    "click",
    closeCategoryModal
);


cancelCategoryButton?.addEventListener(
    "click",
    closeCategoryModal
);


categoryForm?.addEventListener(
    "submit",
    saveCategory
);


categorySearchInput?.addEventListener(
    "input",
    searchCategories
);


categoriesTableBody?.addEventListener(
    "click",
    handleCategoryTableClick
);


cancelDeleteButton?.addEventListener(
    "click",
    closeDeleteModal
);


confirmDeleteButton?.addEventListener(
    "click",
    deleteCategory
);


categoryModal?.addEventListener(
    "click",
    handleModalBackdropClick
);


deleteModal?.addEventListener(
    "click",
    handleModalBackdropClick
);


document.addEventListener(
    "keydown",
    handleEscapeKey
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCategories();


        console.log(
            "HIPSTER Categories initialized"
        );
    }
);