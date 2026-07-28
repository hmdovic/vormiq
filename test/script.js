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
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) {
      return '<span class="word-mask"><span class="word-inner">' + w + "</span></span>";
    }).join(" ");
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
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
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

      if (window.ScrollTrigger) {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=90%",
            scrub: 0.6,
            pin: true,
            pinSpacing: true
          }
        })
        .to(shards, {
          x: function () { return (Math.random() - 0.5) * spread * 2.2; },
          y: function () { return -spread * (0.6 + Math.random() * 0.8); },
          rotation: function () { return (Math.random() - 0.5) * 300; },
          opacity: 0,
          ease: "power1.in",
          stagger: { each: 0.006, from: "random" }
        }, 0)
        .to(wordmark, { opacity: 0, y: -60, ease: "power1.in" }, 0)
        .to(".hero__content", { opacity: 0, y: -40, ease: "power1.in" }, 0)
        .to(".hero__scroll", { opacity: 0, ease: "power1.in" }, 0);
      }
    }
  }

  /* =========================================================
     CONTENT MACHINE sequence
     ========================================================= */
  var machineStage = document.querySelector("[data-machine-stage]");
  if (machineStage && "IntersectionObserver" in window) {
    var machineDone = false;
    var machineObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !machineDone) {
          machineDone = true;
          var input = machineStage.querySelector('[data-machine-item="input"]');
          var lines123 = machineStage.querySelectorAll(".ml--1,.ml--2,.ml--3");
          var core = machineStage.querySelector('[data-machine-item="core"]');
          var lines456 = machineStage.querySelectorAll(".ml--4,.ml--5,.ml--6");
          var outs = machineStage.querySelectorAll(".machine__node--out");
          var result = machineStage.querySelector('[data-machine-item="result"]');

          function show(el, delay) {
            setTimeout(function () { if (el) el.classList.add("is-in"); }, delay);
          }
          function live(nodeList, delay) {
            setTimeout(function () { nodeList.forEach(function (n) { n.classList.add("is-live"); }); }, delay);
          }

          show(input, 0);
          live(lines123, 350);
          show(core, 650);
          live(lines456, 1000);
          outs.forEach(function (o, idx) { show(o, 1250 + idx * 150); });
          show(result, 1900);
        }
      });
    }, { threshold: 0.45 });
    machineObs.observe(machineStage);
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
      card.addEventListener("mouseenter", function () { setActive(card.dataset.node); });
      card.addEventListener("mouseleave", clearActive);
      card.addEventListener("focus", function () { setActive(card.dataset.node); });
      card.addEventListener("blur", clearActive);
      card.addEventListener("click", function (e) {
        e.preventDefault();
        var willActivate = !card.classList.contains("is-active");
        clearActive();
        if (willActivate) setActive(card.dataset.node);
      });
    });

    window.addEventListener("load", drawLines);
    window.addEventListener("resize", drawLines);
    setTimeout(drawLines, 50);
    if (hasGSAP && window.ScrollTrigger) ScrollTrigger.addEventListener("refresh", drawLines);

    /* mobile fallback: same data, rendered as a connected vertical list
       instead of a 2D web — the scattered layout doesn't fit narrow screens */
    var mobileHost = document.querySelector("[data-constellation-mobile]");
    if (mobileHost && !mobileHost.querySelector(".cm-list")) {
      var titleMap = {};
      nodeCards.forEach(function (card) {
        titleMap[card.dataset.node] = card.querySelector(".node-card__title").textContent;
      });
      var list = document.createElement("div");
      list.className = "cm-list";
      list.appendChild(document.createElement("div")).className = "cm-line";
      nodeCards.forEach(function (card) {
        var connects = (card.dataset.connect || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        var item = document.createElement("div");
        item.className = "cm-item";
        item.id = "cm-" + card.dataset.node;
        item.innerHTML =
          '<div class="cm-item__head"><span class="cm-item__icon">' + card.querySelector(".node-card__icon").innerHTML + "</span>" +
          "<span><span class=\"cm-item__title\">" + card.querySelector(".node-card__title").textContent + "</span>" +
          '<span class="cm-item__price">' + card.querySelector(".node-card__price").textContent + "</span></span></div>" +
          '<p class="cm-item__desc">' + card.querySelector(".node-card__desc").textContent + "</p>" +
          (connects.length
            ? '<div class="cm-item__links">' + connects.map(function (c) {
                return '<button type="button" class="cm-chip" data-cm-link="' + c + '">' + (titleMap[c] || c) + "</button>";
              }).join("") + "</div>"
            : "");
        list.appendChild(item);
      });
      mobileHost.appendChild(list);
      mobileHost.querySelectorAll("[data-cm-link]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          var target = document.getElementById("cm-" + chip.dataset.cmLink);
          if (!target) return;
          scrollToTarget(target);
          target.classList.remove("is-pulse");
          void target.offsetWidth;
          target.classList.add("is-pulse");
          setTimeout(function () { target.classList.remove("is-pulse"); }, 1400);
        });
      });
    }
  }

  /* =========================================================
     WORK STACK — ken burns + settle
     ========================================================= */
  if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
    document.querySelectorAll("[data-work-panel]").forEach(function (panel) {
      var media = panel.querySelector(".work-panel__media");
      var card = panel.querySelector(".work-panel__card");
      gsap.fromTo(media, { scale: 1.18 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true }
      });
      gsap.fromTo(card, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: panel, start: "top 85%", end: "top 40%", scrub: true }
      });
      gsap.to(panel, {
        scale: 0.94, filter: "brightness(0.55)", ease: "none",
        scrollTrigger: { trigger: panel, start: "bottom 90%", end: "bottom 10%", scrub: true }
      });
    });
  }

  /* =========================================================
     PROOF cards + stats
     ========================================================= */
  if ("IntersectionObserver" in window) {
    var proofObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var idx = Array.prototype.indexOf.call(entry.target.parentNode.children, entry.target);
          setTimeout(function () { entry.target.classList.add("is-in"); }, idx * 140);
          proofObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll("[data-proof-card]").forEach(function (el) { proofObserver.observe(el); });
  }

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
     PRICING TILT
     ========================================================= */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.style.perspective = "800px";
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "rotateY(" + (px * 8) + "deg) rotateX(" + (py * -8) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
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

      status.textContent = "Je WhatsApp-bericht staat klaar om te versturen. Liever mail? Stuur naar vormiq@outlook.com.";
      status.classList.add("is-success");
      form.reset();
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
