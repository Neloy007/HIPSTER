/* =========================================================
   HIPSTER
   Customer Registration
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeRegistration();

    }
);


/* =========================================================
   INITIALIZE REGISTRATION
========================================================= */

function initializeRegistration() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const registerButton =
        document.getElementById(
            "registerButton"
        );


    if (!registerForm) {

        return;

    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "registerConfirmPassword"
                    )
                    .value;


            /* =================================================
               VALIDATE NAME
            ================================================= */

            if (!name) {

                showRegisterMessage(
                    "Please enter your full name.",
                    "error"
                );

                return;

            }


            if (name.length < 2) {

                showRegisterMessage(
                    "Your name must be at least 2 characters long.",
                    "error"
                );

                return;

            }


            /* =================================================
               VALIDATE EMAIL
            ================================================= */

            if (!email) {

                showRegisterMessage(
                    "Please enter your email address.",
                    "error"
                );

                return;

            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showRegisterMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            /* =================================================
               VALIDATE PASSWORD
            ================================================= */

            if (!password) {

                showRegisterMessage(
                    "Please create a password.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                showRegisterMessage(
                    "Password must be at least 6 characters long.",
                    "error"
                );

                return;

            }


            /* =================================================
               CONFIRM PASSWORD
            ================================================= */

            if (!confirmPassword) {

                showRegisterMessage(
                    "Please confirm your password.",
                    "error"
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showRegisterMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            /* =================================================
               DISABLE BUTTON
            ================================================= */

            if (registerButton) {

                registerButton.disabled =
                    true;

                registerButton.textContent =
                    "CREATING ACCOUNT...";

            }


            hideRegisterMessage();


            /* =================================================
               REGISTER CUSTOMER
            ================================================= */

            try {

                const result =
                    await registerCustomer(
                        name,
                        email,
                        password
                    );


                console.log(
                    "Customer registration successful:",
                    result
                );


                showRegisterMessage(
                    "Account created successfully. Signing you in...",
                    "success"
                );


                /* =================================================
                   AUTOMATIC LOGIN
                ================================================= */

                try {

                    await loginCustomer(
                        email,
                        password
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "account.html";

                        },
                        700
                    );

                } catch (loginError) {

                    /*
                     * Registration succeeded,
                     * but automatic login failed.
                     */

                    console.error(
                        "Automatic login failed:",
                        loginError
                    );


                    showRegisterMessage(
                        "Your account was created successfully. Please sign in.",
                        "success"
                    );


                    if (registerButton) {

                        registerButton.disabled =
                            false;

                        registerButton.textContent =
                            "CREATE ACCOUNT";

                    }

                }


            } catch (error) {

                console.error(
                    "Customer registration failed:",
                    error
                );


                showRegisterMessage(
                    error.message ||
                    "Unable to create your account. Please try again.",
                    "error"
                );


                if (registerButton) {

                    registerButton.disabled =
                        false;

                    registerButton.textContent =
                        "CREATE ACCOUNT";

                }

            }

        }
    );

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showRegisterMessage(
    message,
    type
) {

    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    if (!registerMessage) {

        return;

    }


    registerMessage.textContent =
        message;


    registerMessage.className =
        `auth-message show ${type}`;

}


/* =========================================================
   HIDE MESSAGE
========================================================= */

function hideRegisterMessage() {

    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    if (!registerMessage) {

        return;

    }


    registerMessage.textContent =
        "";


    registerMessage.className =
        "auth-message";

}