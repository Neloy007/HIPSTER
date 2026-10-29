/* =========================================================
   HIPSTER
   Customer Account
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCustomerAccount();

    }
);


/* =========================================================
   LOAD CUSTOMER ACCOUNT
========================================================= */

async function loadCustomerAccount() {

    const loading =
        document.getElementById(
            "accountLoading"
        );

    const error =
        document.getElementById(
            "accountError"
        );

    const accountCard =
        document.getElementById(
            "accountCard"
        );


    try {

        const customer =
            await getCurrentCustomer();


        /* =================================================
           NOT LOGGED IN
        ================================================= */

        if (!customer) {

            window.location.href =
                "login.html";

            return;

        }


        /* =================================================
           DISPLAY CUSTOMER INFORMATION
        ================================================= */

        const accountName =
            document.getElementById(
                "accountName"
            );

        const accountEmail =
            document.getElementById(
                "accountEmail"
            );

        const accountRole =
            document.getElementById(
                "accountRole"
            );


        accountName.textContent =
            customer.name ||
            "Not provided";


        accountEmail.textContent =
            customer.email ||
            "Not provided";


        accountRole.textContent =
            customer.role ||
            "CUSTOMER";


        /* =================================================
           SHOW ACCOUNT
        ================================================= */

        if (loading) {

            loading.hidden = true;

        }


        if (error) {

            error.hidden = true;

        }


        if (accountCard) {

            accountCard.hidden = false;

        }


    } catch (accountError) {

        console.error(
            "Failed to load customer account:",
            accountError
        );


        if (loading) {

            loading.hidden = true;

        }


        if (error) {

            error.hidden = false;

        }

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutCustomer();

            window.location.href =
                "index.html";

        }
    );

}

}