const form = document.getElementById("authForm"), title = document.getElementById("title"), subtitle = document.getElementById("subtitle"), modeLabel = document.getElementById("modeLabel"), switchText = document.getElementById("switchText"), switchBtn = document.getElementById("switchBtn"), submitBtn = document.getElementById("submitBtn"), nameField = document.getElementById("nameField"), confirmField = document.getElementById("confirmField"), forgot = document.getElementById("forgot"), terms = document.getElementById("terms"), termsCheck = document.getElementById("termsCheck"), password = document.getElementById("password"), confirmPassword = document.getElementById("confirmPassword"), togglePassword = document.getElementById("togglePassword"), error = document.getElementById("error"), demoBtn = document.getElementById("demoBtn"), toast = document.getElementById("toast");
let isSignup = false;

switchBtn.addEventListener("click", () => {
    isSignup = !isSignup; error.textContent = ""; form.reset(); password.type = "password"; togglePassword.textContent = "Show";
    if (isSignup) { modeLabel.textContent = "GET STARTED"; title.textContent = "Create your account"; subtitle.textContent = "Start managing your financial journey with FinSight."; nameField.classList.remove("hidden"); confirmField.classList.remove("hidden"); terms.classList.remove("hidden"); forgot.classList.add("hidden"); submitBtn.textContent = "Create account"; switchText.textContent = "Already have an account?"; switchBtn.textContent = "Log in"; }
    else { modeLabel.textContent = "WELCOME BACK"; title.textContent = "Welcome back"; subtitle.textContent = "Log in to continue to your financial dashboard."; nameField.classList.add("hidden"); confirmField.classList.add("hidden"); terms.classList.add("hidden"); forgot.classList.remove("hidden"); submitBtn.textContent = "Log in"; switchText.textContent = "Don't have an account?"; switchBtn.textContent = "Create account"; }
});

togglePassword.addEventListener("click", () => { const visible = password.type === "text"; password.type = visible ? "password" : "text"; togglePassword.textContent = visible ? "Show" : "Hide"; });

form.addEventListener("submit", e => {
    e.preventDefault(); error.textContent = ""; const email = document.getElementById("email").value.trim(), passwordValue = password.value; if (!email) return showError("Please enter your email address."); if (!passwordValue) return showError("Please enter your password.");
    if (isSignup) { const name = document.getElementById("name").value.trim(); if (!name) return showError("Please enter your full name."); if (passwordValue.length < 6) return showError("Password must contain at least 6 characters."); if (passwordValue !== confirmPassword.value) return showError("Passwords do not match."); if (!termsCheck.checked) return showError("Please accept the Terms of Service."); showToast("Account created successfully!"); } else showToast("Login successful!");
});

forgot.addEventListener("click", e => { e.preventDefault(); showToast("Password reset will be available soon."); });
demoBtn.addEventListener("click", () => showToast("Opening FinSight demo..."));
function showError(message) { error.textContent = message; }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2500); }
