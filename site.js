(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-links");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav")) closeMenu();
  });
  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = sectionLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (!current) return;
        sectionLinks.forEach((link) => {
          if (link.hash === "#" + current.target.id)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }
  const image = document.getElementById("gallery-image");
  const caption = document.getElementById("gallery-caption");
  const openImage = document.getElementById("gallery-open");
  document.querySelectorAll(".gallery-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.image;
      image.alt = button.dataset.alt;
      openImage.href = button.dataset.image;
      caption.textContent = button.dataset.caption;
      document
        .querySelectorAll(".gallery-thumb")
        .forEach((other) =>
          other.setAttribute("aria-pressed", String(other === button)),
        );
    });
  });
  const dialog = document.getElementById("lightbox");
  const enlarged = document.getElementById("lb-img");
  let imageTrigger;
  if (typeof dialog.showModal === "function") {
    document.querySelectorAll(".lb-link").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        imageTrigger = link;
        document.getElementById("lightbox-title").textContent =
          link.closest("figure")?.querySelector("figcaption")?.textContent ||
          "Product interface · Fictional data";
        enlarged.src = link.href;
        enlarged.alt =
          link.querySelector("img")?.alt || "Enlarged interface view";
        dialog.showModal();
        document.getElementById("lb-close").focus();
      }),
    );
    document
      .getElementById("lb-close")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      enlarged.removeAttribute("src");
      imageTrigger?.focus();
    });
  }
  document.querySelectorAll(".chapter").forEach((button) =>
    button.addEventListener("click", () => {
      const video = document.getElementById(button.dataset.video);
      if (!video) return;
      const seek = () => {
        video.currentTime = Number(button.dataset.time);
        video.play()?.catch(() => {});
      };
      if (video.readyState >= 1) seek();
      else {
        video.addEventListener("loadedmetadata", seek, { once: true });
        video.load();
      }
    }),
  );
  document.querySelectorAll("details").forEach((details) =>
    details.addEventListener("toggle", () => {
      if (!details.open)
        details.querySelectorAll("video").forEach((video) => video.pause());
    }),
  );
  // Deep links open a video disclosure before moving to it.
  function revealHash() {
    const id = location.hash.slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    if (target.matches("details")) target.open = true;
    const parent = target.closest("details");
    if (parent) parent.open = true;
  }
  addEventListener("hashchange", revealHash);
  revealHash();
})();
