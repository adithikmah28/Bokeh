const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    // Toggle class 'active' untuk hamburger & nav menu
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Tutup menu jika salah satu link di klik (opsional, tapi bagus untuk UX)
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));
