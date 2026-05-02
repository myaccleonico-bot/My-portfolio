const nav = document.getElementById("nav");
const toggle = document.getElementById("menu-toggle");
const typingTarget = document.getElementById("typing");
const form = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (window.lucide) {
  window.lucide.createIcons();
}

const closeMenu = () => {
  nav?.classList.remove("show");
  document.body.classList.remove("nav-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Open menu");
};

toggle?.addEventListener("click", () => {
  if (!nav) return;

  const isOpen = nav.classList.toggle("show");
  document.body.classList.toggle("nav-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const roles = ["Web Developer", "UI Designer", "PHP Builder", "Freelancer", "VS Code"]
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  if (!typingTarget) return;

  const word = roles[roleIndex];
  typingTarget.textContent = word.slice(0, charIndex);
  let delay = 90;

  if (!deleting && charIndex < word.length) {
    charIndex += 1;
  } else if (deleting && charIndex > 0) {
    charIndex -= 1;
    delay = 48;
  } else {
    delay = deleting ? 220 : 1200;
    deleting = !deleting;
    if (!deleting) {
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  window.setTimeout(typeRole, delay);
}

typeRole();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

const marqueeTrack = document.querySelector(".marquee div");
if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name")?.toString().trim() || "there";
  const email = data.get("email")?.toString().trim() || "";
  const message = data.get("message")?.toString().trim() || "";
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

  if (formNote) {
    formNote.textContent = "Opening your email app...";
  }

  window.location.href = `mailto:leonico@example.com?subject=${subject}&body=${body}`;
  form.reset();
});
