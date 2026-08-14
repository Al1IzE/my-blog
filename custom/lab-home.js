(() => {
  const ROOT_PATHS = new Set(["/", "/index.html"]);

  function cleanup() {
    if (typeof window.__labHomeCleanup === "function") {
      window.__labHomeCleanup();
    }
  }

  function initLabHome() {
    cleanup();

    if (!ROOT_PATHS.has(window.location.pathname)) return;

    const shell = document.querySelector(".lab-home-shell");
    if (!shell) return;

    document.documentElement.classList.add("lab-js");

    const clock = document.getElementById("lab-local-clock");
    const updateClock = () => {
      if (!clock) return;
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Hong_Kong",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      clock.textContent = `HKT ${time}`;
    };

    updateClock();
    const clockTimer = window.setInterval(updateClock, 30000);
    const revealItems = document.querySelectorAll(".lab-reveal");
    let observer;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("lab-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("lab-visible"));
    }

    window.__labHomeCleanup = () => {
      window.clearInterval(clockTimer);
      if (observer) observer.disconnect();
      document.documentElement.classList.remove("lab-js");
      window.__labHomeCleanup = null;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLabHome, { once: true });
  } else {
    initLabHome();
  }

  window.addEventListener("redefine:page:refresh", initLabHome);
})();
