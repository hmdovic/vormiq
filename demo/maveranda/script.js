(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- preloader — a brief, deliberate arrival moment ---------- */
  var preloader = document.getElementById("preloader");
  var heroReady = false;
  function startHeroReveal() {
    if (heroReady) return;
    heroReady = true;
    if (window.gsap) {
      gsap.utils.toArray(".reveal-line__inner").forEach(function (el, i) {
        gsap.to(el, { y: "0%", duration: 1.1, ease: "power4.out", delay: 0.1 + i * 0.12 });
      });
    } else {
      document.querySelectorAll(".reveal-line__inner").forEach(function (el) { el.style.transform = "translateY(0)"; });
    }
    document.querySelectorAll(".hero .reveal-up").forEach(function (el) {
      var delay = parseFloat(el.dataset.delay || "0");
      setTimeout(function () { el.classList.add("is-visible"); }, delay * 1000);
    });
  }

  if (preloader) {
    if (prefersReducedMotion) {
      preloader.remove();
      document.body.classList.remove("is-loading");
      startHeroReveal();
    } else {
      requestAnimationFrame(function () {
        preloader.classList.add("is-ready");
      });
      var minHold = new Promise(function (resolve) { setTimeout(resolve, 1150); });
      minHold.then(function () {
        preloader.classList.add("is-done");
        document.body.classList.remove("is-loading");
        startHeroReveal();
        setTimeout(function () { preloader.remove(); }, 750);
      });
    }
  } else {
    startHeroReveal();
  }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- anchor links respect Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu && mobileMenu.classList.contains("is-open")) closeMobileMenu();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- navbar scroll state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- scroll progress bar ---------- */
  var progressFill = document.getElementById("progressFill");
  function updateProgress() {
    if (!progressFill) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    var pct = height > 0 ? (scrolled / height) * 100 : 0;
    progressFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  function closeMobileMenu() {
    mobileMenu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  /* ---------- GSAP scroll reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: function () { el.classList.add("is-visible"); },
        once: true,
      });
    });

    gsap.utils.toArray(".reveal-up:not(.hero .reveal-up)").forEach(function (el) {
      var delay = parseFloat(el.dataset.delay || "0");
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        onEnter: function () { setTimeout(function () { el.classList.add("is-visible"); }, delay * 1000); },
        once: true,
      });
    });

    /* services + why-list stagger within their reveal groups */
    ScrollTrigger.batch(".service-card", {
      start: "top 90%",
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });
      },
      once: true,
    });

    /* portfolio parallax */
    gsap.utils.toArray(".portfolio-item__media img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: img.closest(".portfolio-item"), start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });

    /* hero video subtle scale-out on scroll */
    var heroVideo = document.querySelector(".hero__video");
    if (heroVideo) {
      gsap.to(heroVideo, {
        scale: 1.18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 }
      });
    }

    /* final CTA background parallax */
    var ctaImg = document.querySelector(".final-cta__media img");
    if (ctaImg) {
      gsap.fromTo(ctaImg, { yPercent: -8 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".final-cta", start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    }
  } else {
    /* graceful fallback without GSAP: IntersectionObserver */
    var revealEls = document.querySelectorAll(".reveal, .reveal-up");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- fine-pointer only motion extras ---------- */
  if (!prefersReducedMotion && hasFinePointer) {
    /* dual-layer custom cursor — dot tracks tight, ring trails with lag (GSAP quickTo) */
    var cursorDot = document.getElementById("cursorDot");
    var cursorRing = document.getElementById("cursorRing");
    if (cursorDot && cursorRing && window.gsap) {
      var setDotX = gsap.quickTo(cursorDot, "left", { duration: 0.12, ease: "power3.out" });
      var setDotY = gsap.quickTo(cursorDot, "top", { duration: 0.12, ease: "power3.out" });
      var setRingX = gsap.quickTo(cursorRing, "left", { duration: 0.45, ease: "power3.out" });
      var setRingY = gsap.quickTo(cursorRing, "top", { duration: 0.45, ease: "power3.out" });
      window.addEventListener("mousemove", function (e) {
        setDotX(e.clientX); setDotY(e.clientY);
        setRingX(e.clientX); setRingY(e.clientY);
        cursorDot.classList.add("is-active");
        cursorRing.classList.add("is-active");
      });
      document.querySelectorAll("a, button, [data-tilt]").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursorRing.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cursorRing.classList.remove("is-hover"); });
      });
    }

    /* magnetic buttons */
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var strength = 0.3;
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + (x * strength).toFixed(1) + "px, " + (y * strength).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });

    /* 3D tilt on portfolio + why-media */
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var maxDeg = 5;
      el.style.transformStyle = "preserve-3d";
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * maxDeg * 2;
        var rotateX = (0.5 - py) * maxDeg * 2;
        el.style.transform = "perspective(1200px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- WhatsApp float — hide while a form field is focused ---------- */
  var waFloat = document.getElementById("waFloat");
  var contactFormEl = document.getElementById("contactForm");
  if (waFloat && contactFormEl) {
    contactFormEl.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("focus", function () { waFloat.classList.add("is-hidden"); });
      field.addEventListener("blur", function () { waFloat.classList.remove("is-hidden"); });
    });
  }

  /* ---------- contact form (demo — no backend) ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var naam = form.naam.value.trim();
      var telefoon = form.telefoon.value.trim();
      var bericht = form.bericht.value.trim();
      var status = form.querySelector(".form-status");

      var subject = encodeURIComponent("Adviesgesprek aanvraag — " + naam);
      var body = encodeURIComponent("Naam: " + naam + "\nTelefoon: " + telefoon + "\n\n" + bericht);
      window.location.href = "mailto:info@maveranda.nl?subject=" + subject + "&body=" + body;

      status.textContent = "Uw aanvraag staat klaar om te versturen via e-mail.";
      status.classList.add("is-success");
      form.reset();
    });
  }
})();
