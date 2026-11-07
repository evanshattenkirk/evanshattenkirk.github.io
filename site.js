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
  // Manual product gallery. Off-screen slides stay out of the focus order.
  document.querySelectorAll(".product-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const previous = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    const title = carousel.querySelector(".carousel-title");
    const counter = carousel.querySelector(".carousel-counter");
    const viewport = carousel.querySelector(".carousel-viewport");
    let active = 0;
    let start = null;
    let suppressClickUntil = 0;
    function showSlide(requested) {
      const index = Math.max(0, Math.min(slides.length - 1, requested));
      if (index === active) return;
      const moveFocus = slides[active].contains(document.activeElement);
      active = index;
      track.style.transform = `translateX(${-active * 100}%)`;
      slides.forEach((slide, i) => {
        slide.inert = i !== active;
        slide.setAttribute("aria-hidden", String(i !== active));
      });
      title.textContent = slides[active].dataset.caption;
      counter.textContent = `${active + 1} / ${slides.length}`;
      previous.setAttribute("aria-disabled", String(active === 0));
      next.setAttribute("aria-disabled", String(active === slides.length - 1));
      if (moveFocus)
        slides[active].querySelector("a").focus({ preventScroll: true });
    }
    previous.addEventListener("click", () => showSlide(active - 1));
    next.addEventListener("click", () => showSlide(active + 1));
    carousel.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      if (event.key === "Home") showSlide(0);
      else if (event.key === "End") showSlide(slides.length - 1);
      else showSlide(active + (event.key === "ArrowRight" ? 1 : -1));
    });
    viewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    });
    viewport.addEventListener("dragstart", (event) => event.preventDefault());
    viewport.addEventListener("pointercancel", () => {
      start = null;
    });
    viewport.addEventListener("pointerup", (event) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      suppressClickUntil = performance.now() + 400;
      showSlide(active + (dx < 0 ? 1 : -1));
    });
    viewport.addEventListener(
      "click",
      (event) => {
        if (performance.now() >= suppressClickUntil) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    carousel.classList.add("is-ready");
  });
  const dialog = document.getElementById("lightbox");
  const enlarged = document.getElementById("lb-img");
  let imageTrigger;
  if (typeof dialog.showModal === "function") {
    document.querySelectorAll(".lb-link").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        imageTrigger = link;
        const slideCaption = link.closest(".carousel-slide")?.dataset.caption;
        document.getElementById("lightbox-title").textContent = slideCaption
          ? `Pastefront: ${slideCaption} · Public site and sample-store views`
          : link.closest("figure")?.querySelector("figcaption")?.textContent ||
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
