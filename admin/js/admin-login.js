/* =========================================================
   HIPSTER ADMIN
   ADMIN LOGIN
========================================================= */

const API_URL = "http://localhost:5000/api/auth/login";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loginForm = document.getElementById(
    "adminLoginForm"
);

const emailInput = document.getElementById(
    "email"
);

const passwordInput = document.getElementById(
    "password"
);

const passwordToggle = document.getElementById(
    "passwordToggle"
);

const rememberAdmin = document.getElementById(
    "rememberAdmin"
);

const loginButton = document.getElementById(
    "loginButton"
);

const loginError = document.getElementById(
    "loginError"
);

const loginSuccess = document.getElementById(
    "loginSuccess"
);

const emailError = document.getElementById(
    "emailError"
);

const passwordError = document.getElementById(
    "passwordError"
);


/* =========================================================
   SHOW ERROR MESSAGE
========================================================= */

const showLoginError = (message) => {

    if (!loginError) {
        return;
    }

    loginError.textContent = message;

    loginError.style.display = "block";

};


/* =========================================================
   HIDE ERROR MESSAGE
========================================================= */

const hideLoginError = () => {

    if (!loginError) {
        return;
    }

    loginError.textContent = "";

    loginError.style.display = "none";

};


/* =========================================================
   SHOW SUCCESS MESSAGE
========================================================= */

const showLoginSuccess = (message) => {

    if (!loginSuccess) {
        return;
    }

    loginSuccess.textContent = message;

    loginSuccess.style.display = "block";

};


/* =========================================================
   HIDE SUCCESS MESSAGE
========================================================= */

const hideLoginSuccess = () => {

    if (!loginSuccess) {
        return;
    }

    loginSuccess.textContent = "";

    loginSuccess.style.display = "none";

};


/* =========================================================
   CLEAR FIELD ERRORS
========================================================= */

const clearFieldErrors = () => {

    if (emailError) {
        emailError.textContent = "";
    }

    if (passwordError) {
        passwordError.textContent = "";
    }

    emailInput?.classList.remove(
        "input-error"
    );

    passwordInput?.classList.remove(
        "input-error"
    );

};


/* =========================================================
   EMAIL VALIDATION
========================================================= */

const isValidEmail = (email) => {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

};


/* =========================================================
   VALIDATE FORM
========================================================= */

const validateForm = () => {

    clearFieldErrors();

    hideLoginError();

    hideLoginSuccess();

    const email =
        emailInput?.value.trim() || "";

    const password =
        passwordInput?.value || "";

    let isValid = true;


    /* -----------------------------------------
       EMAIL
    ----------------------------------------- */

    if (!email) {

        if (emailError) {
            emailError.textContent =
                "Email address is required.";
        }

        emailInput?.classList.add(
            "input-error"
        );

        isValid = false;

    } else if (!isValidEmail(email)) {

        if (emailError) {
            emailError.textContent =
                "Please enter a valid email address.";
        }

        emailInput?.classList.add(
            "input-error"
        );

        isValid = false;

    }


    /* -----------------------------------------
       PASSWORD
    ----------------------------------------- */

    if (!password) {

        if (passwordError) {
            passwordError.textContent =
                "Password is required.";
        }

        passwordInput?.classList.add(
            "input-error"
        );

        isValid = false;

    }


    return {
        isValid,
        email,
        password
    };

};


/* =========================================================
   LOGIN BUTTON LOADING
========================================================= */

const setLoginLoading = (loading) => {

    if (!loginButton) {
        return;
    }


    if (loading) {

        loginButton.disabled = true;

        loginButton.dataset.originalText =
            loginButton.textContent;

        loginButton.textContent =
            "Signing in...";

    } else {

        loginButton.disabled = false;

        loginButton.textContent =
            loginButton.dataset.originalText ||
            "Sign in";

    }

};


/* =========================================================
   LOGIN API
========================================================= */

const loginAdmin = async (
    email,
    password
) => {

    const response = await fetch(
        API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );


    let data = null;


    try {

        data = await response.json();

    } catch (error) {

        throw new Error(
            "The server returned an invalid response."
        );

    }


    if (!response.ok) {

        throw new Error(
            data?.message ||
            "Login failed."
        );

    }


    return data;

};


/* =========================================================
   HANDLE LOGIN
========================================================= */

const handleLogin = async (event) => {

    event.preventDefault();


    const validation =
        validateForm();


    if (!validation.isValid) {

        return;

    }


    const {
        email,
        password
    } = validation;


    setLoginLoading(true);


    try {

        const response =
            await loginAdmin(
                email,
                password
            );


        /* -----------------------------------------
           CHECK RESPONSE
        ----------------------------------------- */

        const token =
            response?.data?.token;

        const user =
            response?.data?.user;


        if (!token || !user) {

            throw new Error(
                "Invalid login response from server."
            );

        }


        /* -----------------------------------------
           ADMIN ROLE CHECK
        ----------------------------------------- */

        if (user.role !== "ADMIN") {

            throw new Error(
                "You do not have permission to access the admin panel."
            );

        }


        /* -----------------------------------------
           SAVE LOGIN DATA
        ----------------------------------------- */

        localStorage.setItem(
            "hipsterAdminToken",
            token
        );

        localStorage.setItem(
            "hipsterAdminUser",
            JSON.stringify(user)
        );


        /* -----------------------------------------
           REMEMBER LOGIN
        ----------------------------------------- */

        if (rememberAdmin?.checked) {

            localStorage.setItem(
                "hipsterRememberAdmin",
                "true"
            );

        } else {

            localStorage.removeItem(
                "hipsterRememberAdmin"
            );

        }


        /* -----------------------------------------
           SUCCESS
        ----------------------------------------- */

        showLoginSuccess(
            "Login successful. Redirecting..."
        );


        /* -----------------------------------------
           REDIRECT
        ----------------------------------------- */

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 700);


    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        showLoginError(
            error instanceof Error
                ? error.message
                : "Unable to sign in. Please try again."
        );

    } finally {

        setLoginLoading(false);

    }

};


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

const togglePasswordVisibility = () => {

    if (!passwordInput) {
        return;
    }


    const isPassword =
        passwordInput.type === "password";


    if (isPassword) {

        passwordInput.type = "text";

        if (passwordToggle) {
            passwordToggle.textContent =
                "Hide";

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );
        }

    } else {

        passwordInput.type = "password";

        if (passwordToggle) {
            passwordToggle.textContent =
                "Show";

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    }

};


/* =========================================================
   CLEAR ERROR WHEN USER TYPES
========================================================= */

const handleInput = () => {

    hideLoginError();

    hideLoginSuccess();

};


/* =========================================================
   LOAD REMEMBER PREFERENCE
========================================================= */

const loadRememberPreference = () => {

    const shouldRemember =
        localStorage.getItem(
            "hipsterRememberAdmin"
        );


    if (
        shouldRemember === "true" &&
        rememberAdmin
    ) {

        rememberAdmin.checked = true;

    }

};


/* =========================================================
   CHECK EXISTING LOGIN
========================================================= */

const checkExistingLogin = () => {

    const token =
        localStorage.getItem(
            "hipsterAdminToken"
        );

    const userData =
        localStorage.getItem(
            "hipsterAdminUser"
        );


    if (!token || !userData) {
        return;
    }


    try {

        const user =
            JSON.parse(userData);


        if (user.role === "ADMIN") {

            /*
              The token will be verified by the
              backend when the admin dashboard
              makes an authenticated request.

              For now, redirect the already logged-in
              admin directly to the dashboard.
            */

            window.location.href =
                "index.html";

        }

    } catch (error) {

        /*
          Remove corrupted login information.
        */

        localStorage.removeItem(
            "hipsterAdminToken"
        );

        localStorage.removeItem(
            "hipsterAdminUser"
        );

    }

};


/* =========================================================
   EVENT LISTENERS
========================================================= */

loginForm?.addEventListener(
    "submit",
    handleLogin
);


passwordToggle?.addEventListener(
    "click",
    togglePasswordVisibility
);


emailInput?.addEventListener(
    "input",
    handleInput
);


passwordInput?.addEventListener(
    "input",
    handleInput
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadRememberPreference();

        checkExistingLogin();

        console.log(
            "HIPSTER Admin Login initialized"
        );

    }
);