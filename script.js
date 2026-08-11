// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Theme Toggle
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");

  // Set initial theme
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  // Add click listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
      console.log("Theme switched to:", newTheme); // Debug log
    });
  }

  function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector("i");
    if (icon) {
      if (theme === "dark") {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    }
  }
}

// Initialize theme when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
    mobileMenuBtn.setAttribute("aria-expanded", navLinks.classList.contains("mobile-open"));
  });
}

// Close mobile menu when a link is clicked
if (navLinks) {
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".card, .project-card, .stat, .timeline__item").forEach((el) => {
  observer.observe(el);
});

// Scrollspy: highlight nav links based on the section closest to the top of the viewport
const sections = document.querySelectorAll('section[id]');
const navLinkSelector = '.nav__links a';
const navLinksAll = document.querySelectorAll(navLinkSelector);
const navLinksContainer = document.querySelector('.nav__links');
const headerOffset = 120;

function updateSliderPosition() {
  const activeLink = document.querySelector(`${navLinkSelector}.active`);
  if (activeLink && navLinksContainer) {
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = navLinksContainer.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    navLinksContainer.style.setProperty('--slider-left', `${left}px`);
    navLinksContainer.style.setProperty('--slider-width', `${width}px`);
  }
}

function setActiveNavLink() {
  let currentSection = sections[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top - headerOffset);

    if (rect.top <= headerOffset + 80 && rect.bottom >= headerOffset + 80) {
      currentSection = section;
      closestDistance = distance;
      return;
    }

    if (distance < closestDistance) {
      closestDistance = distance;
      currentSection = section;
    }
  });

  const id = currentSection?.getAttribute('id');
  const link = document.querySelector(`${navLinkSelector}[href="#${id}"]`);

  if (link) {
    navLinksAll.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    updateSliderPosition();
  }
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });
window.addEventListener('resize', () => {
  updateSliderPosition();
  setActiveNavLink();
});

window.addEventListener('load', setActiveNavLink);
setTimeout(setActiveNavLink, 100);
