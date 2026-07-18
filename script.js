(function () {
  "use strict";

  /* Navbar scroll state */
  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.querySelector(".navbar__toggle");
  var mobileMenu = document.querySelector(".navbar__mobile");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Scroll reveal — arm elements only once JS confirms it's running */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("reveal-armed"); });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Accordion */
  document.querySelectorAll(".accordion-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".accordion-item");
      var wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".accordion-item").forEach(function (i) {
        i.classList.remove("is-open");
        i.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Project filter tabs */
  var filterTabs = document.querySelectorAll(".filter-tab");
  var projectRows = document.querySelectorAll(".project-row");
  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      filterTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-pressed", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-pressed", "true");
      var filter = tab.dataset.filter;
      projectRows.forEach(function (row) {
        var show = filter === "all" || row.dataset.category === filter;
        row.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* Project detail modal */
  var modal = document.getElementById("project-modal");
  if (modal) {
    var modalMedia = modal.querySelector(".modal__media");
    var modalBadge = modal.querySelector(".modal__badge");
    var modalTitle = modal.querySelector(".modal__title");
    var modalDesc = modal.querySelector(".modal__desc");
    var closeBtn = modal.querySelector(".modal__close");

    function openModal(trigger) {
      var type = trigger.dataset.mediaType;
      var src = trigger.dataset.mediaSrc;
      modalMedia.innerHTML =
        type === "video"
          ? '<video src="' + src + '" autoplay muted loop playsinline controls></video>'
          : '<img src="' + src + '" alt="" />';
      modalBadge.textContent = trigger.dataset.badge || "";
      modalTitle.textContent = trigger.dataset.title || "";
      modalDesc.textContent = trigger.dataset.desc || "";
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      modal.classList.remove("is-open");
      modalMedia.innerHTML = "";
      document.body.style.overflow = "";
    }
    document.querySelectorAll("[data-open-project]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(el);
      });
    });
    closeBtn && closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* Contact form -> opens WhatsApp/mail with the message pre-filled */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var naam = form.naam.value.trim();
      var email = form.email.value.trim();
      var dienst = form.dienst.value;
      var bericht = form.bericht.value.trim();
      var status = form.querySelector(".form-status");

      var lines = [
        "Hoi Sami, ik ben " + naam + ".",
        dienst ? "Ik heb interesse in: " + dienst + "." : "",
        bericht,
        "Mijn e-mail: " + email
      ].filter(Boolean);

      var waText = encodeURIComponent(lines.join(" "));
      window.open("https://wa.me/31657971118?text=" + waText, "_blank", "noopener");

      status.textContent = "Je WhatsApp-bericht staat klaar om te versturen. Liever mail? Stuur naar vormiq@outlook.com.";
      status.classList.add("is-success");
      form.reset();
    });

    /* Hide the floating WhatsApp bubble while a form field has focus — on small
       screens it sits over the corner of the "Bericht" textarea otherwise. */
    var waFloat = document.querySelector(".wa-float");
    if (waFloat) {
      form.querySelectorAll("input, textarea, select").forEach(function (field) {
        field.addEventListener("focus", function () { waFloat.classList.add("is-hidden"); });
        field.addEventListener("blur", function () { waFloat.classList.remove("is-hidden"); });
      });
    }
  }

  /* Motion extras — skipped entirely for reduced-motion or touch/coarse pointers */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!prefersReducedMotion && hasFinePointer) {
    /* Magnetic buttons — nudge toward the cursor within a small radius */
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var strength = 0.35;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + (x * strength).toFixed(1) + "px, " + (y * strength).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });

    /* Hero glow follows the cursor */
    var hero = document.getElementById("hero");
    var heroGlow = hero && hero.querySelector(".hero__glow");
    if (hero && heroGlow) {
      hero.addEventListener("mousemove", function (e) {
        var rect = hero.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        heroGlow.style.setProperty("--mx", x + "%");
        heroGlow.style.setProperty("--my", y + "%");
        heroGlow.style.opacity = "1";
      });
      hero.addEventListener("mouseleave", function () {
        heroGlow.style.opacity = "0";
      });
    }

    /* Spotlight highlight that tracks the cursor on cards */
    document.querySelectorAll(".bento-card, .pricing-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });

    /* 3D tilt — perspective rotate + glare, following the cursor. Reserved for
       the "screen" showcases (bento cards, project previews, highlighted pricing)
       so it reads as a premium detail rather than a gimmick applied everywhere. */
    document.querySelectorAll(".bento-card, .project-row__preview, .pricing-card--highlight, .pricing-card--recommend").forEach(function (el) {
      el.classList.add("tilt-3d");
      var maxDeg = el.classList.contains("project-row__preview") ? 10 : 6;
      var lift = el.classList.contains("pricing-card") ? "translateY(-4px)" : (el.classList.contains("bento-card") ? "translateY(-4px)" : "");

      el.addEventListener("mouseenter", function () {
        el.classList.add("is-tilting");
      });
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * maxDeg * 2;
        var rotateX = (0.5 - py) * maxDeg * 2;
        el.style.transform = "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) " + lift;
        el.style.setProperty("--glare-x", (px * 100) + "%");
        el.style.setProperty("--glare-y", (py * 100) + "%");
      });
      el.addEventListener("mouseleave", function () {
        el.classList.remove("is-tilting");
        el.style.transform = "";
      });
    });
  }

  /* Hero video parallax on scroll — pure scroll-driven, fine on touch too,
     only skipped for reduced-motion */
  if (!prefersReducedMotion) {
    var heroVideo = document.querySelector(".hero__video");
    var heroSection = document.getElementById("hero");
    if (heroVideo && heroSection) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var progress = Math.min(window.scrollY / heroSection.offsetHeight, 1);
          heroVideo.style.transform = "scale(" + (1 + progress * 0.12) + ")";
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* Animated stat counters */
  document.querySelectorAll("[data-count-to]").forEach(function (el) {
    var target = parseFloat(el.dataset.countTo);
    var suffix = el.dataset.countSuffix || "";
    var done = false;
    if (!("IntersectionObserver" in window)) {
      el.textContent = target + suffix;
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !done) {
          done = true;
          var start = null;
          var duration = 1100;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
})();
