/* =========================================================
   HIPSTER
   Storefront API Configuration
========================================================= */


/* =========================================================
   API BASE URL
========================================================= */

const HIPSTER_API_BASE_URL =
    "http://localhost:5000/api";


/* =========================================================
   API ENDPOINTS
========================================================= */

const HIPSTER_API = {

    categories:
        `${HIPSTER_API_BASE_URL}/categories`,

    products:
        `${HIPSTER_API_BASE_URL}/products`,

    login:
        `${HIPSTER_API_BASE_URL}/auth/login`,

    register:
        `${HIPSTER_API_BASE_URL}/auth/register`,

    me:
        `${HIPSTER_API_BASE_URL}/auth/me`

};


/* =========================================================
   CUSTOMER TOKEN
========================================================= */

function getCustomerToken() {

    return localStorage.getItem(
        "hipsterCustomerToken"
    );

}


/* =========================================================
   SAVE CUSTOMER TOKEN
========================================================= */

function saveCustomerToken(token) {

    if (!token) {
        return;
    }

    localStorage.setItem(
        "hipsterCustomerToken",
        token
    );

}


/* =========================================================
   REMOVE CUSTOMER TOKEN
========================================================= */

function removeCustomerToken() {

    localStorage.removeItem(
        "hipsterCustomerToken"
    );

}


/* =========================================================
   CUSTOMER AUTH HEADERS
========================================================= */

function getCustomerAuthHeaders() {

    const token =
        getCustomerToken();


    if (!token) {

        return {
            "Content-Type":
                "application/json"
        };

    }


    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


/* =========================================================
   API REQUEST HELPER
========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            options
        );


    let result;


    try {

        result =
            await response.json();

    } catch (error) {

        throw new Error(
            "The server returned an invalid response."
        );

    }


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Something went wrong with the request."
        );

    }


    if (
        result.success === false
    ) {

        throw new Error(
            result.message ||
            "Request failed."
        );

    }


    return result;

}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function getCategories() {

    const result =
        await apiRequest(
            HIPSTER_API.categories,
            {
                method: "GET"
            }
        );


    return (
        result.data?.categories ||
        []
    );

}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function getProducts() {

    const result =
        await apiRequest(
            HIPSTER_API.products,
            {
                method: "GET"
            }
        );


    return (
        result.data?.products ||
        []
    );

}


/* =========================================================
   CUSTOMER LOGIN
========================================================= */

async function loginCustomer(
    email,
    password
) {

    const result =
        await apiRequest(
            HIPSTER_API.login,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        email,
                        password

                    })

            }
        );


    const token =
        result.data?.token;


    if (!token) {

        throw new Error(
            "Login succeeded but no authentication token was returned."
        );

    }


    saveCustomerToken(
        token
    );


    return result;

}


/* =========================================================
   CUSTOMER REGISTRATION
========================================================= */

async function registerCustomer(
    name,
    email,
    password
) {

    const result =
        await apiRequest(
            HIPSTER_API.register,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        name,
                        email,
                        password

                    })

            }
        );


    return result;

}


/* =========================================================
   GET CURRENT CUSTOMER
========================================================= */

async function getCurrentCustomer() {

    const token =
        getCustomerToken();


    if (!token) {

        return null;

    }


    try {

        const result =
            await apiRequest(
                HIPSTER_API.me,
                {

                    method: "GET",

                    headers:
                        getCustomerAuthHeaders()

                }
            );


        return (
            result.data?.user ||
            result.data ||
            null
        );

    } catch (error) {

        /*
         * If the token is expired
         * or invalid, remove it.
         */

        removeCustomerToken();

        return null;

    }

}


/* =========================================================
   CUSTOMER LOGOUT
========================================================= */

function logoutCustomer() {

    removeCustomerToken();

}