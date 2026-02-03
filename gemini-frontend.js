// LOADING SCREEN SIMULATION
document.addEventListener("DOMContentLoaded", () => {
    let progress = 0;

    const interval = setInterval(() => {
        progress += 1;

        const progressBar = document.getElementById("progress-bar");
        const loadingPercent = document.getElementById("loading-percent");

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (loadingPercent) loadingPercent.innerText = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);

            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen) loadingScreen.style.display = "none";

            const main = document.getElementById("main-content");
            if (main) main.classList.add("fade-in");

            // Start Animations
            initAnimations();
        }
    }, 50); // Speed up for dev testing, normally 100
});

function initAnimations() {
    // 1. Intersection Observer for Sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");

                // Check if this is the typewriter section
                const typewriterEl = entry.target.querySelector("#typewriter-text");
                if (typewriterEl && !typewriterEl.dataset.typed) {
                    typeWriterEffect(typewriterEl, "Xypher is a crime intelligence platform that organizes and visualizes Indian crime data into meaningful insights.");
                    typewriterEl.dataset.typed = "true";
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal-section").forEach(el => observer.observe(el));
}

function typeWriterEffect(element, text) {
    let i = 0;
    element.innerHTML = ""; // Clear initial
    const speed = 30; // ms per char

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
