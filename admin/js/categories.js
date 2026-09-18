/* =========================================================
   HIPSTER ADMIN
   CATEGORY MANAGEMENT
========================================================= */

const API_BASE_URL = "http://localhost:5000/api/categories";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const categoriesTableBody = document.getElementById(
  "categoriesTableBody"
);

const categorySearchInput = document.getElementById(
  "categorySearch"
);

const addCategoryButton = document.getElementById(
  "addCategoryButton"
);

const categoryModal = document.getElementById(
  "categoryModal"
);

const categoryModalTitle = document.getElementById(
  "categoryModalTitle"
);

const closeCategoryModalButton = document.getElementById(
  "closeCategoryModal"
);

const cancelCategoryButton = document.getElementById(
  "cancelCategoryButton"
);

const categoryForm = document.getElementById(
  "categoryForm"
);

const categoryIdInput = document.getElementById(
  "categoryId"
);

const categoryNameInput = document.getElementById(
  "categoryName"
);

const categoryDescriptionInput = document.getElementById(
  "categoryDescription"
);

const categoryStatusGroup = document.getElementById(
  "categoryStatusGroup"
);

const categoryStatusInput = document.getElementById(
  "categoryStatus"
);

const categoryFormError = document.getElementById(
  "categoryFormError"
);

const saveCategoryButton = document.getElementById(
  "saveCategoryButton"
);

const deleteModal = document.getElementById(
  "deleteModal"
);

const closeDeleteModalButton = document.getElementById(
  "closeDeleteModal"
);

const cancelDeleteButton = document.getElementById(
  "cancelDeleteButton"
);

const confirmDeleteButton = document.getElementById(
  "confirmDeleteButton"
);

const deleteCategoryName = document.getElementById(
  "deleteCategoryName"
);

const totalCategoriesElement = document.getElementById(
  "totalCategories"
);

const activeCategoriesElement = document.getElementById(
  "activeCategories"
);

const inactiveCategoriesElement = document.getElementById(
  "inactiveCategories"
);

const emptyState = document.getElementById(
  "categoriesEmptyState"
);

const tableWrapper = document.getElementById(
  "categoriesTableWrapper"
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
  return localStorage.getItem("hipsterAdminToken");
};

/* =========================================================
   API HELPER
========================================================= */

const apiRequest = async (url, options = {}) => {
  const token = getAdminToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  /*
    Add JWT only when it exists.
    Public GET requests do not require it.
  */

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || "Something went wrong"
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

    const response = await apiRequest(API_BASE_URL);

    categories = response?.data?.categories || [];

    renderCategories(categories);

    updateCategorySummary(categories);
  } catch (error) {
    console.error("Failed to load categories:", error);

    showTableError(
      error.message || "Failed to load categories"
    );
  }
};

/* =========================================================
   RENDER CATEGORIES
========================================================= */

const renderCategories = (categoryList) => {
  if (!categoriesTableBody) {
    return;
  }

  categoriesTableBody.innerHTML = "";

  if (categoryList.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  categoryList.forEach((category) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="category-name-cell">
          <strong>${escapeHtml(category.name)}</strong>
        </div>
      </td>

      <td>
        <span class="category-slug">
          ${escapeHtml(category.slug)}
        </span>
      </td>

      <td>
        <span class="category-description">
          ${
            category.description
              ? escapeHtml(category.description)
              : "No description"
          }
        </span>
      </td>

      <td>
        <span class="status-badge ${
          category.isActive
            ? "status-active"
            : "status-inactive"
        }">
          ${
            category.isActive
              ? "Active"
              : "Inactive"
          }
        </span>
      </td>

      <td>
        <span class="category-date">
          ${formatDate(category.createdAt)}
        </span>
      </td>

      <td>
        <div class="category-actions">

          <button
            type="button"
            class="table-action-button edit-button"
            data-action="edit"
            data-id="${category._id}"
            aria-label="Edit ${escapeHtml(category.name)}"
          >
            Edit
          </button>

          <button
            type="button"
            class="table-action-button status-button"
            data-action="status"
            data-id="${category._id}"
            aria-label="${
              category.isActive
                ? "Deactivate"
                : "Activate"
            } ${escapeHtml(category.name)}"
          >
            ${
              category.isActive
                ? "Deactivate"
                : "Activate"
            }
          </button>

          <button
            type="button"
            class="table-action-button delete-button"
            data-action="delete"
            data-id="${category._id}"
            aria-label="Delete ${escapeHtml(category.name)}"
          >
            Delete
          </button>

        </div>
      </td>
    `;

    categoriesTableBody.appendChild(row);
  });
};

/* =========================================================
   SUMMARY
========================================================= */

const updateCategorySummary = (categoryList) => {
  const total = categoryList.length;

  const active = categoryList.filter(
    (category) => category.isActive
  ).length;

  const inactive = categoryList.filter(
    (category) => !category.isActive
  ).length;

  if (totalCategoriesElement) {
    totalCategoriesElement.textContent = total;
  }

  if (activeCategoriesElement) {
    activeCategoriesElement.textContent = active;
  }

  if (inactiveCategoriesElement) {
    inactiveCategoriesElement.textContent = inactive;
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
    renderCategories(categories);
    return;
  }

  const filteredCategories = categories.filter(
    (category) => {
      return (
        category.name
          ?.toLowerCase()
          .includes(searchTerm) ||
        category.slug
          ?.toLowerCase()
          .includes(searchTerm) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm)
      );
    }
  );

  renderCategories(filteredCategories);
};

/* =========================================================
   OPEN ADD MODAL
========================================================= */

const openAddCategoryModal = () => {
  if (!categoryModal) {
    return;
  }

  categoryModalTitle.textContent = "Add Category";

  categoryIdInput.value = "";

  categoryNameInput.value = "";

  categoryDescriptionInput.value = "";

  if (categoryStatusGroup) {
    categoryStatusGroup.style.display = "none";
  }

  if (categoryFormError) {
    categoryFormError.textContent = "";
    categoryFormError.style.display = "none";
  }

  categoryModal.classList.add("is-open");

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(() => {
    categoryNameInput?.focus();
  }, 100);
};

/* =========================================================
   OPEN EDIT MODAL
========================================================= */

const openEditCategoryModal = (categoryId) => {
  const category = categories.find(
    (item) => item._id === categoryId
  );

  if (!category) {
    console.error("Category not found:", categoryId);
    return;
  }

  categoryModalTitle.textContent = "Edit Category";

  categoryIdInput.value = category._id;

  categoryNameInput.value = category.name || "";

  categoryDescriptionInput.value =
    category.description || "";

  if (categoryStatusGroup) {
    categoryStatusGroup.style.display = "block";
  }

  if (categoryStatusInput) {
    categoryStatusInput.value =
      category.isActive ? "active" : "inactive";
  }

  if (categoryFormError) {
    categoryFormError.textContent = "";
    categoryFormError.style.display = "none";
  }

  categoryModal.classList.add("is-open");

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(() => {
    categoryNameInput?.focus();
  }, 100);
};

/* =========================================================
   CLOSE CATEGORY MODAL
========================================================= */

const closeCategoryModal = () => {
  if (!categoryModal) {
    return;
  }

  categoryModal.classList.remove("is-open");

  document.body.classList.remove(
    "modal-open"
  );
};

/* =========================================================
   SAVE CATEGORY
========================================================= */

const saveCategory = async (event) => {
  event.preventDefault();

  const name = categoryNameInput.value.trim();

  const description =
    categoryDescriptionInput.value.trim();

  const categoryId =
    categoryIdInput.value.trim();

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

  clearFormError();

  setSaveButtonLoading(true);

  try {
    /*
      ADD CATEGORY
    */

    if (!categoryId) {
      await apiRequest(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
        }),
      });

      closeCategoryModal();

      await loadCategories();

      showSuccessMessage(
        "Category created successfully."
      );

      return;
    }

    /*
      EDIT CATEGORY
    */

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

    /*
      Update status separately if necessary.
    */

    const originalCategory = categories.find(
      (category) =>
        category._id === categoryId
    );

    const selectedStatus =
      categoryStatusInput?.value === "active";

    if (
      originalCategory &&
      originalCategory.isActive !== selectedStatus
    ) {
      await apiRequest(
        `${API_BASE_URL}/${categoryId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: selectedStatus,
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
    setSaveButtonLoading(false);
  }
};

/* =========================================================
   CHANGE CATEGORY STATUS
========================================================= */

const changeCategoryStatus = async (
  categoryId
) => {
  const category = categories.find(
    (item) => item._id === categoryId
  );

  if (!category) {
    return;
  }

  const newStatus = !category.isActive;

  const actionText = newStatus
    ? "activate"
    : "deactivate";

  const confirmed = window.confirm(
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
          isActive: newStatus,
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
   DELETE CATEGORY
========================================================= */

const openDeleteModal = (categoryId) => {
  const category = categories.find(
    (item) => item._id === categoryId
  );

  if (!category) {
    return;
  }

  categoryToDelete = category;

  if (deleteCategoryName) {
    deleteCategoryName.textContent =
      category.name;
  }

  deleteModal?.classList.add(
    "is-open"
  );

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
    setDeleteButtonLoading(true);

    await apiRequest(
      `${API_BASE_URL}/${categoryId}`,
      {
        method: "DELETE",
      }
    );

    closeDeleteModal();

    categoryToDelete = null;

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
    setDeleteButtonLoading(false);
  }
};

/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

const closeDeleteModal = () => {
  deleteModal?.classList.remove(
    "is-open"
  );

  document.body.classList.remove(
    "modal-open"
  );

  categoryToDelete = null;
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

const showFormError = (message) => {
  if (!categoryFormError) {
    return;
  }

  categoryFormError.textContent = message;

  categoryFormError.style.display =
    "block";
};

const clearFormError = () => {
  if (!categoryFormError) {
    return;
  }

  categoryFormError.textContent = "";

  categoryFormError.style.display =
    "none";
};

/* =========================================================
   BUTTON LOADING STATES
========================================================= */

const setSaveButtonLoading = (
  loading
) => {
  if (!saveCategoryButton) {
    return;
  }

  if (loading) {
    saveCategoryButton.disabled = true;

    saveCategoryButton.dataset.originalText =
      saveCategoryButton.textContent;

    saveCategoryButton.textContent =
      "Saving...";
  } else {
    saveCategoryButton.disabled = false;

    saveCategoryButton.textContent =
      saveCategoryButton.dataset
        .originalText ||
      "Save Category";
  }
};

const setDeleteButtonLoading = (
  loading
) => {
  if (!confirmDeleteButton) {
    return;
  }

  if (loading) {
    confirmDeleteButton.disabled = true;

    confirmDeleteButton.dataset.originalText =
      confirmDeleteButton.textContent;

    confirmDeleteButton.textContent =
      "Deleting...";
  } else {
    confirmDeleteButton.disabled = false;

    confirmDeleteButton.textContent =
      confirmDeleteButton.dataset
        .originalText ||
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
    document.createElement("div");

  toast.className =
    `admin-toast admin-toast-${type}`;

  toast.textContent = message;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add(
      "show"
    );
  });

  setTimeout(() => {
    toast.classList.remove(
      "show"
    );

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
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

  if (Number.isNaN(
    date.getTime()
  )) {
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
   HTML ESCAPE
========================================================= */

const escapeHtml = (
  value
) => {
  if (value === null ||
      value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

closeDeleteModalButton?.addEventListener(
  "click",
  closeDeleteModal
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