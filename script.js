const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealNodes = document.querySelectorAll(".reveal");
const sections = Array.from(document.querySelectorAll("main section[id]"));
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const glowSurfaces = document.querySelectorAll("[data-glow-surface]");
const pointerSurfaces = document.querySelectorAll("[data-pointer-surface]");
const journeyItems = document.querySelectorAll("[data-journey-item]");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

revealNodes.forEach((node) => {
  const delay = node.getAttribute("data-reveal-delay");
  if (delay) {
    node.style.setProperty("--reveal-delay", `${delay}ms`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" },
);

revealNodes.forEach((node) => revealObserver.observe(node));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("is-active", isActive);
      });
    });
  },
  { threshold: 0.35, rootMargin: "-15% 0px -35% 0px" },
);

sections.forEach((section) => sectionObserver.observe(section));

const servicesStrip = document.getElementById("services");
if (servicesStrip) {
  const servicesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#services");
        });
      });
    },
    { threshold: 0.55 },
  );
  servicesObserver.observe(servicesStrip);
}

glowSurfaces.forEach((surface) => {
  surface.addEventListener("pointermove", (event) => {
    const rect = surface.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    surface.style.setProperty("--glow-x", `${x}%`);
    surface.style.setProperty("--glow-y", `${y}%`);
  });
});

pointerSurfaces.forEach((surface) => {
  surface.addEventListener("pointermove", (event) => {
    const rect = surface.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    surface.style.setProperty("--pointer-x", `${x}%`);
    surface.style.setProperty("--pointer-y", `${y}%`);
  });
});

const journeyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  { threshold: 0.45, rootMargin: "0px 0px -12% 0px" },
);

journeyItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 70}ms`;
  journeyObserver.observe(item);
});

if (form instanceof HTMLFormElement && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = formData.get("consent");

    if (!name || !contact || !message || !consent) {
      formStatus.textContent = "Заполни, пожалуйста, все поля формы.";
      return;
    }

    const subject = encodeURIComponent(`Заявка с сайта от ${name}`);
    const bodyText = encodeURIComponent(
      `Имя: ${name}\nКонтакт: ${contact}\n\nЗадача:\n${message}`,
    );

    formStatus.textContent = "Открываю письмо. Если почта не запустится, можно написать мне в Telegram.";
    window.location.href = `mailto:alexander@calonder.ru?subject=${subject}&body=${bodyText}`;
    form.reset();
  });
}

const quoteBox = document.querySelector("[data-quote-box]");
const quoteText = document.querySelector("[data-quote-text]");
const quoteAuthor = document.querySelector("[data-quote-author]");
const quoteDots = quoteBox ? Array.from(quoteBox.querySelectorAll(".code-quote-dots span")) : [];

const codeQuotes = [
  {
    text: "«Работает? Не трогай.»",
    author: "— древняя мудрость разработчиков",
  },
  {
    text: "«Это не баг, это недокументированная фича.»",
    author: "— каждый второй pull request",
  },
  {
    text: "«У меня на локалке всё работало.»",
    author: "— классика перед деплоем",
  },
  {
    text: "«Сначала сделаем красиво. Потом разберёмся, почему.»",
    author: "— frontend в 3 часа ночи",
  },
  {
    text: "«git commit -m \"fix\" — и надеемся на лучшее.»",
    author: "— история почти каждого репозитория",
  },
];

if (quoteBox && quoteText && quoteAuthor && quoteDots.length) {
  let quoteIndex = 0;
  let switching = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showQuote = (index) => {
    const quote = codeQuotes[index];
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    quoteDots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const nextQuote = () => {
    if (switching) {
      return;
    }

    quoteIndex = (quoteIndex + 1) % codeQuotes.length;

    if (reduceMotion) {
      showQuote(quoteIndex);
      return;
    }

    switching = true;
    quoteBox.classList.add("is-switching");
    window.setTimeout(() => {
      showQuote(quoteIndex);
      quoteBox.classList.remove("is-switching");
      switching = false;
    }, 260);
  };

  quoteBox.addEventListener("click", nextQuote);
  quoteBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      nextQuote();
    }
  });

  if (!reduceMotion) {
    window.setInterval(nextQuote, 4500);
  }
}

const reviewDialog = document.getElementById("review-dialog");
const reviewOpenButtons = document.querySelectorAll("[data-review-open]");
const reviewCloseButtons = document.querySelectorAll("[data-review-close]");

const openReviewDialog = () => {
  if (!reviewDialog) {
    return;
  }
  reviewDialog.hidden = false;
  body.classList.add("dialog-open");
};

const closeReviewDialog = () => {
  if (!reviewDialog) {
    return;
  }
  reviewDialog.hidden = true;
  body.classList.remove("dialog-open");
};

reviewOpenButtons.forEach((button) => {
  button.addEventListener("click", openReviewDialog);
});

reviewCloseButtons.forEach((button) => {
  button.addEventListener("click", closeReviewDialog);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && reviewDialog && !reviewDialog.hidden) {
    closeReviewDialog();
  }
});
