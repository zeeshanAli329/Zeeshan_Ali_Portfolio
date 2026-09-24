/* ==========================================
   FILE: script.js
   Zeeshan Ali - Frontend & Full Stack Developer Portfolio
   ========================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Navigation ---------- */
  const navbar = document.getElementById("navbar");
  const menu = document.getElementById("nav-menu");
  const burger = document.getElementById("hamburger");

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () =>
    setMenu(!menu.classList.contains("is-open"))
  );

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active link while scrolling ---------- */
  const navLinks = [...menu.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            )
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Typing effect ---------- */
  const typeEl = document.getElementById("dynamic-type");
  const roles = [
    "Frontend Developer",
    "React.js & Next.js Developer",
    "Full Stack (MERN) Developer",
    "Responsive UI Builder",
  ];

  if (typeEl) {
    if (reduceMotion) {
      typeEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typeEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 40 : 80;
        if (!deleting && charIndex === word.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      };

      setTimeout(tick, 500);
    }
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll("[data-target]");

  const animateCounter = (el) => {
    const target = Number(el.dataset.target);
    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = target;
      return;
    }
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Image fallbacks ---------- */
  const AVATAR =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">' +
        '<rect width="400" height="500" fill="#111833"/>' +
        '<text x="50%" y="54%" text-anchor="middle" font-family="sans-serif" ' +
        'font-size="140" font-weight="700" fill="#ffb547">ZA</text></svg>'
    );

  const handleBroken = (img) => {
    if (img.dataset.fallbackDone) return;
    img.dataset.fallbackDone = "1";

    if (img.classList.contains("profile-img")) {
      img.src = AVATAR;
      return;
    }
    const holder = img.closest("[data-placeholder]");
    if (holder) holder.classList.add("is-missing");
  };

  document.querySelectorAll("img").forEach((img) => {
    if (img.id === "lightbox-img") return;
    img.addEventListener("error", () => handleBroken(img));
    if (img.complete && img.naturalWidth === 0) handleBroken(img);
  });

  /* ---------- Lightbox ---------- */
  const box = document.getElementById("lightbox");
  const boxImg = document.getElementById("lightbox-img");
  const boxTitle = document.getElementById("lightbox-title");
  const closeBtn = document.getElementById("lightbox-close-btn");
  let lastFocused = null;

  const openBox = (src, title, trigger) => {
    lastFocused = trigger;
    box.classList.remove("is-missing");
    boxImg.src = src;
    boxImg.alt = title;
    boxTitle.textContent = title;
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  };

  const closeBox = () => {
    if (!box.classList.contains("is-open")) return;
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  };

  boxImg.addEventListener("error", () => {
    if (box.classList.contains("is-open")) box.classList.add("is-missing");
  });

  document.querySelectorAll("[data-lightbox-src]").forEach((btn) => {
    btn.addEventListener("click", () =>
      openBox(btn.dataset.lightboxSrc, btn.dataset.lightboxTitle || "Preview", btn)
    );
  });

  closeBtn.addEventListener("click", closeBox);

  box.addEventListener("click", (e) => {
    if (e.target === box) closeBox();
  });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") closeBox();
    // Only one focusable element in the dialog, so keep focus on it.
    if (e.key === "Tab") {
      e.preventDefault();
      closeBtn.focus();
    }
  });
})();