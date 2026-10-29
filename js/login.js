/* =========================================================
   HIPSTER
   Customer Login
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");


    if (!loginForm) {
        return;
    }


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -------------------------------------------------
               GET FORM VALUES
            ------------------------------------------------- */

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            /* -------------------------------------------------
               BASIC VALIDATION
            ------------------------------------------------- */

            if (!email || !password) {

                showLoginMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            /* -------------------------------------------------
               DISABLE BUTTON
            ------------------------------------------------- */

            loginButton.disabled = true;

            loginButton.textContent =
                "SIGNING IN...";


            hideLoginMessage();


            try {

                /* ---------------------------------------------
                   SEND LOGIN REQUEST
                --------------------------------------------- */

                const result =
                    await loginCustomer(
                        email,
                        password
                    );


                console.log(
                    "Customer login successful:",
                    result
                );


                /* ---------------------------------------------
                   SUCCESS
                --------------------------------------------- */

                showLoginMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                /*
                 * Give the user a short moment to see
                 * the success message.
                 */

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Customer login failed:",
                    error
                );


                showLoginMessage(
                    error.message ||
                    "Unable to sign in. Please check your email and password.",
                    "error"
                );


                loginButton.disabled = false;

                loginButton.textContent =
                    "SIGN IN";

            }

        }
    );

});


/* =========================================================
   SHOW LOGIN MESSAGE
========================================================= */

function showLoginMessage(
    message,
    type
) {

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );


    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        `auth-message show ${type}`;

}


/* =========================================================
   HIDE LOGIN MESSAGE
========================================================= */

function hideLoginMessage() {

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );


    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        "";


    loginMessage.className =
        "auth-message";

}