/* =========================================================
HIPSTER ADMIN - CUSTOMERS PAGE
========================================================= */

/* =========================================================
API CONFIGURATION
========================================================= */

const CUSTOMERS_API_URL =
"http://localhost:5000/api/users";

/* =========================================================
STATE
========================================================= */

let customers = [];

let toastTimer = null;

/* =========================================================
DOM ELEMENTS
========================================================= */

/* =========================================================
SUMMARY
========================================================= */

const totalCustomers =
document.getElementById(
"totalCustomers"
);

const activeCustomers =
document.getElementById(
"activeCustomers"
);

const inactiveCustomers =
document.getElementById(
"inactiveCustomers"
);

/* =========================================================
TABLE
========================================================= */

const customersTableBody =
document.getElementById(
"customersTableBody"
);

const loadingState =
document.getElementById(
"loadingState"
);

const errorState =
document.getElementById(
"errorState"
);

const emptyState =
document.getElementById(
"emptyState"
);

const tableWrapper =
document.getElementById(
"tableWrapper"
);

/* =========================================================
CONTROLS
========================================================= */

const refreshButton =
document.getElementById(
"refreshButton"
);

const logoutButton =
document.getElementById(
"logoutButton"
);

/* =========================================================
INITIALIZATION
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {


    initializeCustomersPage();

}


);

async function initializeCustomersPage() {


setupEventListeners();

await loadCustomers();


}

/* =========================================================
EVENT LISTENERS
========================================================= */

function setupEventListeners() {


/* Refresh */

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        () => loadCustomers()
    );

}


/* Logout */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


}

/* =========================================================
AUTHENTICATION
========================================================= */

function getAdminToken() {

```
return localStorage.getItem(
    "hipsterAdminToken"
);
```

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

/* =========================================================
LOAD CUSTOMERS
========================================================= */

async function loadCustomers() {


showLoading();


if (refreshButton) {

    refreshButton.disabled =
        true;

}


try {

    if (!getAdminToken()) {

        handleUnauthorized();

        return;

    }


    const response =
        await fetch(
            CUSTOMERS_API_URL,
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


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Failed to load customers."
        );

    }


    customers =
        extractCustomers(
            result
        );


    updateSummary();

    renderCustomers();


} catch (error) {

    console.error(
        "Load customers error:",
        error
    );


    showError(
        error.message ||
        "Failed to load customers."
    );


} finally {

    if (refreshButton) {

        refreshButton.disabled =
            false;

    }

}


}

/* =========================================================
EXTRACT CUSTOMERS
========================================================= */

function extractCustomers(result) {


if (
    Array.isArray(
        result.data
    )
) {

    return result.data;

}


if (
    result.data &&
    Array.isArray(
        result.data.users
    )
) {

    return result.data.users;

}


if (
    Array.isArray(
        result.users
    )
) {

    return result.users;

}


return [];


}

/* =========================================================
UPDATE SUMMARY
========================================================= */

function updateSummary() {


const total =
    customers.length;


const active =
    customers.filter(
        (customer) =>
            customer.isActive !== false
    ).length;


const inactive =
    customers.filter(
        (customer) =>
            customer.isActive === false
    ).length;


if (totalCustomers) {

    totalCustomers.textContent =
        String(total);

}


if (activeCustomers) {

    activeCustomers.textContent =
        String(active);

}


if (inactiveCustomers) {

    inactiveCustomers.textContent =
        String(inactive);

}


}

/* =========================================================
RENDER CUSTOMERS
========================================================= */

function renderCustomers() {


hideLoading();

hideError();


if (
    customers.length === 0
) {

    showEmpty();

    return;

}


hideEmpty();


if (!tableWrapper) {

    return;

}


tableWrapper.style.display =
    "block";


if (!customersTableBody) {

    return;

}


customersTableBody.innerHTML =
    customers
        .map(
            (customer) =>
                createCustomerRow(
                    customer
                )
        )
        .join("");


attachCustomerRowListeners();


}

/* =========================================================
CREATE CUSTOMER ROW
========================================================= */

function createCustomerRow(customer) {


const customerId =
    customer._id ||
    customer.id ||
    "";


const customerName =
    getCustomerName(
        customer
    );


const customerInitial =
    getCustomerInitial(
        customer
    );


const email =
    customer.email ||
    "—";


const role =
    customer.role ||
    "CUSTOMER";


const isActive =
    customer.isActive !== false;


const statusClass =
    isActive
        ? "status-active"
        : "status-inactive";


const statusText =
    isActive
        ? "Active"
        : "Inactive";


const actionClass =
    isActive
        ? "deactivate-button"
        : "activate-button";


const actionText =
    isActive
        ? "Deactivate"
        : "Activate";


const joinedDate =
    formatDate(
        customer.createdAt ||
        customer.created_at
    );


return `
    <tr
        data-customer-id="${escapeHtml(
            customerId
        )}"
    >

        <td>

            <div class="customer-cell">

                <div class="customer-avatar">
                    ${escapeHtml(
                        customerInitial
                    )}
                </div>

                <span class="customer-name">
                    ${escapeHtml(
                        customerName
                    )}
                </span>

            </div>

        </td>


        <td>
            ${escapeHtml(
                email
            )}
        </td>


        <td>

            <span class="role-badge">
                ${escapeHtml(
                    role
                )}
            </span>

        </td>


        <td>

            <span
                class="status-badge ${statusClass}"
            >
                ${statusText}
            </span>

        </td>


        <td>
            ${escapeHtml(
                joinedDate
            )}
        </td>


        <td>

            <button
                type="button"
                class="status-button ${actionClass}"
                data-action="status"
                data-customer-id="${escapeHtml(
                    customerId
                )}"
                data-active="${isActive}"
            >
                ${actionText}
            </button>

        </td>

    </tr>
`;


}

/* =========================================================
CUSTOMER ROW EVENTS
========================================================= */

function attachCustomerRowListeners() {


if (!customersTableBody) {

    return;

}


const statusButtons =
    customersTableBody.querySelectorAll(
        ".status-button"
    );


statusButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            handleCustomerStatusAction
        );

    }
);


}

/* =========================================================
CUSTOMER STATUS ACTION
========================================================= */

function handleCustomerStatusAction(event) {


const button =
    event.currentTarget;


const customerId =
    button.dataset.customerId;


const currentStatus =
    button.dataset.active ===
    "true";


if (!customerId) {

    showToast(
        "Customer ID is missing."
    );

    return;

}


const newStatus =
    !currentStatus;


updateCustomerStatus(
    customerId,
    newStatus,
    button
);


}

/* =========================================================
UPDATE CUSTOMER STATUS
========================================================= */

async function updateCustomerStatus(
customerId,
isActive,
button
) {


if (!button) {

    return;

}


const originalText =
    button.textContent.trim();


button.disabled =
    true;


button.textContent =
    "Updating...";


try {

    if (!getAdminToken()) {

        handleUnauthorized();

        return;

    }


    const response =
        await fetch(
            `${CUSTOMERS_API_URL}/${customerId}/status`,
            {
                method: "PATCH",

                headers: {
                    ...getAuthHeaders(),

                    "Content-Type":
                        "application/json",
                },

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

        return;

    }


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Failed to update customer status."
        );

    }


    const customer =
        customers.find(
            (item) =>
                (
                    item._id ||
                    item.id
                ) ===
                customerId
        );


    if (customer) {

        customer.isActive =
            isActive;

    }


    updateSummary();

    renderCustomers();


    showToast(
        isActive
            ? "Customer activated successfully."
            : "Customer deactivated successfully."
    );


} catch (error) {

    console.error(
        "Update customer status error:",
        error
    );


    button.disabled =
        false;


    button.textContent =
        originalText;


    showToast(
        error.message ||
        "Failed to update customer status."
    );

}


}

/* =========================================================
LOADING STATE
========================================================= */

function showLoading() {


if (loadingState) {

    loadingState.style.display =
        "flex";

}


if (errorState) {

    errorState.style.display =
        "none";

}


if (emptyState) {

    emptyState.style.display =
        "none";

}


if (tableWrapper) {

    tableWrapper.style.display =
        "none";

}


}

function hideLoading() {


if (loadingState) {

    loadingState.style.display =
        "none";

}


}

/* =========================================================
ERROR STATE
========================================================= */

function showError(message) {


hideLoading();


if (emptyState) {

    emptyState.style.display =
        "none";

}


if (tableWrapper) {

    tableWrapper.style.display =
        "none";

}


if (errorState) {

    errorState.textContent =
        message;

    errorState.style.display =
        "flex";

}


}

function hideError() {

if (errorState) {

    errorState.style.display =
        "none";

}


}

/* =========================================================
EMPTY STATE
========================================================= */

function showEmpty() {


hideLoading();

hideError();


if (emptyState) {

    emptyState.style.display =
        "flex";

}


if (tableWrapper) {

    tableWrapper.style.display =
        "none";

}


}

function hideEmpty() {


if (emptyState) {

    emptyState.style.display =
        "none";

}


}

/* =========================================================
GET CUSTOMER NAME
========================================================= */

function getCustomerName(customer) {

if (
    customer.name &&
    String(
        customer.name
    ).trim()
) {

    return String(
        customer.name
    ).trim();

}


if (
    customer.firstName ||
    customer.lastName
) {

    return [
        customer.firstName,
        customer.lastName,
    ]
        .filter(
            Boolean
        )
        .join(" ");

}


if (customer.email) {

    return String(
        customer.email
    )
        .split("@")[0];

}


return "Customer";


}

/* =========================================================
GET CUSTOMER INITIAL
========================================================= */

function getCustomerInitial(customer) {


const name =
    getCustomerName(
        customer
    );


return name
    .charAt(0)
    .toUpperCase();


}

/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(value) {


if (!value) {

    return "—";

}


const date =
    new Date(
        value
    );


if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "—";

}


return date.toLocaleDateString(
    "en-GB",
    {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }
);


}

/* =========================================================
PARSE JSON RESPONSE
========================================================= */

async function parseJsonResponse(response) {


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
LOGOUT
========================================================= */

function logout() {


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
TOAST
========================================================= */

function showToast(message) {

const toast =
    document.getElementById(
        "toast"
    );


if (!toast) {

    console.log(
        message
    );

    return;

}


const messageElement =
    toast.querySelector(
        ".toast-message"
    );


if (messageElement) {

    messageElement.textContent =
        message;

}


toast.classList.add(
    "show"
);


clearTimeout(
    toastTimer
);


toastTimer =
    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3500
    );


}

/* =========================================================
HTML ESCAPE
========================================================= */

function escapeHtml(value) {


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
