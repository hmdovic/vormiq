(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* =========================================================
     SMOOTH SCROLL (Lenis) + GSAP ticker sync
     ========================================================= */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.1 });
    lenis.on("scroll", function () { if (hasGSAP && window.ScrollTrigger) ScrollTrigger.update(); });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    var offset = -20;
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else {
      var el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
    }
  }

  document.querySelectorAll("[data-scroll-to]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });

  /* =========================================================
     NAV: condense + active section + mobile menu
     ========================================================= */
  var nav = document.querySelector("[data-nav]");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("is-condensed", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMobile = document.querySelector("[data-nav-mobile]");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var open = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    link.addEventListener("click", function (e) {
      var el = document.querySelector(href);
      if (el) { e.preventDefault(); scrollToTarget(el); }
    });
  });

  var navSectionLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link][data-section]"));
  if (navSectionLinks.length && "IntersectionObserver" in window) {
    var sectionMap = {};
    navSectionLinks.forEach(function (l) { sectionMap[l.dataset.section] = l; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = sectionMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navSectionLinks.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    Object.keys(sectionMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
  }

  /* =========================================================
     LEGAL PAGES: table-of-contents active-section highlight
     ========================================================= */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll("[data-toc-link]"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var tocMap = {};
    tocLinks.forEach(function (l) { tocMap[l.getAttribute("href").slice(1)] = l; });
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = tocMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(tocMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) tocObserver.observe(el);
    });
  }

  /* =========================================================
     BACKGROUND PARALLAX LAYERS
     ========================================================= */
  if (!reduceMotion) {
    var depthEls = Array.prototype.slice.call(document.querySelectorAll("[data-depth]"));
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      depthEls.forEach(function (el) {
        var depth = parseFloat(el.dataset.depth) || 0.1;
        el.style.transform = "translate3d(0," + (y * depth * -0.3) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
  }

  /* =========================================================
     SCROLL PROGRESS RAIL
     ========================================================= */
  var progressFill = document.querySelector("[data-scroll-progress]");
  function updateProgress() {
    if (!progressFill) return;
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrollTop / max) * 100 : 0;
    progressFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* =========================================================
     HERO HEADLINE: word-by-word assemble
     ========================================================= */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var parts = [];
    el.childNodes.forEach(function (node) {
      var isText = node.nodeType === 3;
      var tag = isText ? null : node.tagName.toLowerCase();
      var cls = !isText && node.className ? ' class="' + node.className + '"' : "";
      var words = (node.textContent || "").trim().split(/\s+/).filter(Boolean);
      words.forEach(function (w) {
        var word = isText ? w : "<" + tag + cls + ">" + w + "</" + tag + ">";
        parts.push('<span class="word-mask"><span class="word-inner">' + word + "</span></span>");
      });
    });
    el.innerHTML = parts.join(" ");
    var inners = el.querySelectorAll(".word-inner");
    if (reduceMotion || !hasGSAP) {
      inners.forEach(function (w) { w.style.transform = "translateY(0)"; });
      return;
    }
    gsap.set(inners, { yPercent: 115, rotate: 4 });
    gsap.to(inners, {
      yPercent: 0, rotate: 0, duration: 1, ease: "power4.out",
      stagger: 0.055, delay: 0.5
    });
  });

  /* =========================================================
     GENERIC REVEAL
     ========================================================= */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 25% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* =========================================================
     COUNTERS
     ========================================================= */
  function animateCount(el) {
    var to = parseFloat(el.dataset.countTo || "0");
    var prefix = el.dataset.countPrefix || "";
    var suffix = el.dataset.countSuffix || "";
    var start = performance.now();
    var dur = 1200;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count-to]").forEach(function (el) { countObserver.observe(el); });
  }

  /* =========================================================
     MAGNETIC BUTTONS
     ========================================================= */
  if (!reduceMotion && hasGSAP && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      var moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        moveX((e.clientX - r.left - r.width / 2) * 0.35);
        moveY((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener("mouseleave", function () { moveX(0); moveY(0); });
    });
  }

  /* =========================================================
     HERO: shard assembly
     ========================================================= */
  var fragmentsHost = document.querySelector("[data-fragments]");
  var wordmark = document.querySelector("[data-hero-mark]");
  if (fragmentsHost && hasGSAP) {
    var COUNT = window.innerWidth < 700 ? 28 : 60;
    var shards = [];
    for (var i = 0; i < COUNT; i++) {
      var s = document.createElement("span");
      s.className = "shard";
      var w = 5 + Math.random() * 13;
      var h = 5 + Math.random() * 13;
      s.style.setProperty("--w", w + "px");
      s.style.setProperty("--h", h + "px");
      s.style.left = "50%";
      s.style.top = "50%";
      fragmentsHost.appendChild(s);
      shards.push(s);
    }

    /* target: a loose grid spanning the hero, so shards read as a
       forming constellation/system rather than a random cluster */
    var hostRect = fragmentsHost.getBoundingClientRect();
    var cols = Math.ceil(Math.sqrt(COUNT * (hostRect.width / hostRect.height)));
    var rows = Math.ceil(COUNT / cols);
    var gridW = hostRect.width * 0.86;
    var gridH = hostRect.height * 0.72;
    var targets = [];
    for (var gy = 0; gy < rows; gy++) {
      for (var gx = 0; gx < cols; gx++) {
        if (targets.length >= COUNT) break;
        var cellX = (gx + 0.5) / cols * gridW - gridW / 2;
        var cellY = (gy + 0.5) / rows * gridH - gridH / 2;
        targets.push({
          x: cellX + (Math.random() - 0.5) * (gridW / cols) * 0.5,
          y: cellY + (Math.random() - 0.5) * (gridH / rows) * 0.5
        });
      }
    }
    /* shuffle so the assembly doesn't sweep row by row */
    for (var sh = targets.length - 1; sh > 0; sh--) {
      var jx = Math.floor(Math.random() * (sh + 1));
      var tmp = targets[sh]; targets[sh] = targets[jx]; targets[jx] = tmp;
    }

    var spread = Math.max(window.innerWidth, window.innerHeight) * 0.7;
    gsap.set(shards, {
      x: function () { return (Math.random() - 0.5) * spread * 2.4; },
      y: function () { return (Math.random() - 0.5) * spread * 1.6; },
      rotation: function () { return (Math.random() - 0.5) * 420; },
      scale: function () { return 0.3 + Math.random() * 1.3; },
      opacity: 0
    });

    if (reduceMotion) {
      gsap.set(shards, {
        x: function (idx) { return targets[idx].x; },
        y: function (idx) { return targets[idx].y; },
        rotation: 0, opacity: 0.3
      });
    } else {
      var introTl = gsap.timeline({ delay: 0.15 });
      introTl.to(shards, {
        opacity: function () { return 0.55 + Math.random() * 0.35; },
        duration: 0.5, ease: "power1.out", stagger: { each: 0.01, from: "random" }
      }, 0)
      .to(shards, {
        x: function (idx) { return targets[idx].x; },
        y: function (idx) { return targets[idx].y; },
        rotation: 0,
        scale: function () { return 0.6 + Math.random() * 0.5; },
        duration: 1.5,
        ease: "power3.out",
        stagger: { each: 0.012, from: "random" }
      }, 0.2)
      .to(shards, {
        opacity: function () { return 0.18 + Math.random() * 0.22; },
        duration: 0.7, ease: "power1.out"
      }, ">-0.7");

      /* A pinned scroll-scrub dissolve was tried here (shards bursting
         outward + content fading while the hero stays pinned), but any
         reserved pin distance where content has already faded before the
         pin releases reads as a blank dead page during normal-speed
         scrolling — confirmed on both mobile and desktop. Simpler and
         reliably gap-free: play the on-load assembly once, then let the
         hero scroll away like every other section. */
      if (window.ScrollTrigger) {
        gsap.to(shards, {
          opacity: function () { return 0.1 + Math.random() * 0.12; },
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
        });
        gsap.to(wordmark, {
          opacity: 0, y: -40,
          scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: 0.6 }
        });
      }
    }
  }

  /* =========================================================
     SERVICES CONSTELLATION
     ========================================================= */
  var constellation = document.querySelector("[data-constellation]");
  if (constellation) {
    var linesSvg = constellation.querySelector("[data-constellation-lines]");
    var hub = constellation.querySelector(".constellation__hub");
    var nodeCards = Array.prototype.slice.call(constellation.querySelectorAll(".node-card"));
    var pairs = [];
    nodeCards.forEach(function (card) {
      var id = card.dataset.node;
      pairs.push({ a: id, b: "hub" });
      (card.dataset.connect || "").split(",").forEach(function (target) {
        target = target.trim();
        if (!target) return;
        var key = [id, target].sort().join("__");
        if (!pairs._seen) pairs._seen = {};
        if (!pairs._seen[key]) { pairs._seen[key] = true; pairs.push({ a: id, b: target }); }
      });
    });

    function nodeCenter(id) {
      var el = id === "hub" ? hub : constellation.querySelector('[data-node="' + id + '"]');
      if (!el) return null;
      var cr = constellation.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
    }

    function drawLines() {
      var cr = constellation.getBoundingClientRect();
      linesSvg.setAttribute("viewBox", "0 0 " + cr.width + " " + cr.height);
      linesSvg.innerHTML = "";
      pairs.forEach(function (pair) {
        var p1 = nodeCenter(pair.a), p2 = nodeCenter(pair.b);
        if (!p1 || !p2) return;
        var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2 + (p1.y - p2.y) * 0.08;
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M" + p1.x + "," + p1.y + " Q" + mx + "," + my + " " + p2.x + "," + p2.y);
        path.dataset.a = pair.a;
        path.dataset.b = pair.b;
        linesSvg.appendChild(path);
      });
    }

    function setActive(id) {
      var related = { hub: true };
      related[id] = true;
      nodeCards.forEach(function (card) {
        if (card.dataset.node === id) return;
        var connects = (constellation.querySelector('[data-node="' + id + '"]').dataset.connect || "").split(",").map(function (s) { return s.trim(); });
        if (connects.indexOf(card.dataset.node) !== -1) related[card.dataset.node] = true;
      });
      nodeCards.forEach(function (card) {
        var isRelated = related[card.dataset.node] || card.dataset.node === id;
        card.classList.toggle("is-active", card.dataset.node === id);
        card.classList.toggle("is-dim", !isRelated);
      });
      linesSvg.querySelectorAll("path").forEach(function (path) {
        var isRelated = related[path.dataset.a] && related[path.dataset.b];
        path.classList.toggle("is-active", isRelated);
      });
    }
    function clearActive() {
      nodeCards.forEach(function (card) { card.classList.remove("is-active", "is-dim"); });
      linesSvg.querySelectorAll("path").forEach(function (path) { path.classList.remove("is-active"); });
    }

    nodeCards.forEach(function (card) {
      var preClickActive = false;
      card.addEventListener("mouseenter", function () { setActive(card.dataset.node); });
      card.addEventListener("mouseleave", clearActive);
      card.addEventListener("focus", function () { setActive(card.dataset.node); });
      card.addEventListener("blur", clearActive);
      card.addEventListener("pointerdown", function () { preClickActive = card.classList.contains("is-active"); });
      card.addEventListener("click", function (e) {
        if (card.tagName === "A") return;
        e.preventDefault();
        var willActivate = !preClickActive;
        clearActive();
        if (willActivate) setActive(card.dataset.node);
      });
    });

    window.addEventListener("load", drawLines);
    window.addEventListener("resize", drawLines);
    setTimeout(drawLines, 50);
    if (hasGSAP && window.ScrollTrigger) ScrollTrigger.addEventListener("refresh", drawLines);
  }

  /* =========================================================
     PORTFOLIO: lazy-play videos only once scrolled near view
     ========================================================= */
  var lazyVideos = document.querySelectorAll("[data-lazy-video]");
  if (lazyVideos.length && "IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px 200px 0px", threshold: 0 });
    lazyVideos.forEach(function (v) { lazyVideoObserver.observe(v); });
  } else {
    lazyVideos.forEach(function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  }

  /* =========================================================
     PORTFOLIO: video-modal for the AI-video-only cards
     ========================================================= */
  var videoModal = document.querySelector("[data-video-modal]");
  var videoModalPlayer = document.querySelector("[data-video-modal-player]");
  if (videoModal && videoModalPlayer) {
    var closeVideoModal = function () {
      videoModal.classList.remove("is-open");
      videoModalPlayer.pause();
      videoModalPlayer.removeAttribute("src");
    };
    document.querySelectorAll("[data-open-video]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        videoModalPlayer.src = btn.dataset.openVideo;
        videoModal.classList.add("is-open");
        var playPromise = videoModalPlayer.play();
        if (playPromise && playPromise.catch) playPromise.catch(function () {});
      });
    });
    var videoModalClose = document.querySelector("[data-video-modal-close]");
    if (videoModalClose) videoModalClose.addEventListener("click", closeVideoModal);
    videoModal.addEventListener("click", function (e) { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeVideoModal(); });
  }

  /* =========================================================
     PROOF: wa-mock cards + stats
     ========================================================= */
  if ("IntersectionObserver" in window) {
    var proofObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
          var cardDelay = idx * 220;
          setTimeout(function () {
            el.classList.add("is-in");
            var typeDelay = reduceMotion ? 0 : 750;
            setTimeout(function () { el.classList.add("is-typed"); }, typeDelay);
          }, cardDelay);
          proofObserver.unobserve(el);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 30% 0px" });
    document.querySelectorAll("[data-wa-mock]").forEach(function (el) { proofObserver.observe(el); });
  }

  /* =========================================================
     SHARD MOTIF — reused in section headers beyond the hero
     ========================================================= */
  document.querySelectorAll("[data-shard-field]").forEach(function (field) {
    var count = parseInt(field.dataset.shardField, 10) || 5;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "mini-shard";
      var size = 8 + Math.random() * 15;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = (Math.random() * 94) + "%";
      s.style.top = (Math.random() * 70) + "%";
      s.style.opacity = (0.2 + Math.random() * 0.35).toFixed(2);
      if (!reduceMotion) {
        s.style.animationDuration = (5.5 + Math.random() * 4) + "s";
        s.style.animationDelay = (Math.random() * -7) + "s";
      }
      field.appendChild(s);
    }
  });

  /* =========================================================
     PROCESS — scrubbed line fill + active step
     ========================================================= */
  var processPath = document.querySelector("[data-process-path]");
  var processFill = document.querySelector("[data-process-fill]");
  if (processPath && processFill) {
    if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
      gsap.fromTo(processFill, { strokeDashoffset: 800 }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: processPath, start: "top 65%", end: "bottom 55%", scrub: true }
      });
    } else {
      processFill.style.strokeDashoffset = 0;
    }
    if ("IntersectionObserver" in window) {
      var stepObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { entry.target.classList.toggle("is-active", entry.isIntersecting); });
      }, { rootMargin: "-40% 0px -40% 0px" });
      document.querySelectorAll("[data-process-step]").forEach(function (el) { stepObserver.observe(el); });
    }
  }

  /* =========================================================
     TILT + CURSOR GLOW (pricing cards, portfolio browser-cards)
     ========================================================= */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.style.perspective = "800px";
      var strength = parseFloat(card.dataset.tiltStrength) || 8;
      var hasGlow = card.classList.contains("browser-card");
      var pressed = false;
      var px = 0, py = 0;
      function applyTransform() {
        var scale = pressed ? 0.98 : 1;
        card.style.transform = "rotateY(" + (px * strength) + "deg) rotateX(" + (py * -strength) + "deg) translateY(-4px) scale(" + scale + ")";
      }
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.transition = "none";
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (hasGlow) {
          card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
          card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        }
        applyTransform();
      });
      card.addEventListener("mousedown", function () { pressed = true; applyTransform(); });
      card.addEventListener("mouseup", function () { pressed = false; applyTransform(); });
      card.addEventListener("mouseleave", function () {
        pressed = false;
        card.style.transition = "transform 0.5s var(--ease-soft)";
        card.style.transform = "";
      });
    });
  }

  /* =========================================================
     FAQ ACCORDION
     ========================================================= */
  document.querySelectorAll(".faq-item__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".faq-item");
      var wasOpen = item.classList.contains("is-open");
      item.parentNode.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("is-open");
        i.querySelector(".faq-item__trigger").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================================================
     CONTACT FORM -> WhatsApp prefill
     ========================================================= */
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

      form.classList.add("is-submitting");
      window.setTimeout(function () {
        status.textContent = "Je WhatsApp-bericht staat klaar om te versturen. Liever mail? Stuur naar vormiq@outlook.com.";
        status.classList.add("is-success");
        form.reset();
        form.classList.remove("is-submitting");
      }, reduceMotion ? 0 : 350);
    });

    var waFloat = document.querySelector("[data-wa-float]");
    if (waFloat) {
      form.querySelectorAll("input, textarea, select").forEach(function (field) {
        field.addEventListener("focus", function () { waFloat.style.opacity = "0"; waFloat.style.pointerEvents = "none"; });
        field.addEventListener("blur", function () { waFloat.style.opacity = ""; waFloat.style.pointerEvents = ""; });
      });
    }
  }
})();
