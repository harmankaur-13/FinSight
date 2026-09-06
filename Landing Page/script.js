const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.getElementById("signupBtn").addEventListener("click", () => {
  showToast("Let's build your financial dashboard ✦");
});

document.getElementById("heroStart").addEventListener("click", () => {
  document.getElementById("features").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("demoBtn").addEventListener("click", () => {
  showToast("Demo mode coming next!");
});

document.getElementById("loginBtn").addEventListener("click", function() {
    window.location.href = "../Login Page/index.html";
});

document.getElementById("signupBtn").addEventListener("click", function() {
    window.location.href = "../Login Page/index.html";
});
