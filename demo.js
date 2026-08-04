(function () {
  "use strict";

  var WHATSAPP_NUMBER = "31657971118";

  var ICON_PATHS = {
    restaurant: '<path d="M3 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 7 0 0 0-5 7v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2Z"/><path d="M21 15v7"/>',
    kapsalon: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
    bouwbedrijf: '<path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
    schoonmaak: '<path fill="currentColor" stroke="none" d="M12 2l1.7 5.8L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.2L12 2z"/>',
    coach: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    makelaar: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
    webshop: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    sportschool: '<path d="M3 9v6"/><path d="M7 6.5v11"/><path d="M17 6.5v11"/><path d="M21 9v6"/><line x1="7" y1="12" x2="17" y2="12"/>',
    anders: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/>',
    inbox: '<path d="M21 11h-5l-2 3h-4l-2-3H2"/><path d="M5.34 5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.34-7A2 2 0 0 0 16.86 4H7.14a2 2 0 0 0-1.8 1Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
    info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    star: '<path fill="currentColor" stroke="none" d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6-4.8-4.6 6.6-.8z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    check: '<polyline points="20 6 9 17 4 12" stroke-width="3"/>'
  };

  function icon(name) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICON_PATHS[name] || "") + "</svg>";
  }

  var HYPE_MESSAGES = [
    "Hey! Fijn dat je er bent &#128075;",
    "Mooi begin!",
    "Je bent er bijna doorheen.",
    "Goed bezig &#10024;",
    "Nu het leukste gedeelte.",
    "Nog een paar klikken.",
    "Bijna klaar, laatste vraag.",
    "Laatste stap voor je demo!"
  ];

  function stepHead(wrap, step, index) {
    wrap.appendChild(el("span", "demo-step__hype", (HYPE_MESSAGES[index] || "")));
    wrap.appendChild(el("h2", "demo-step__title", step.title));
    if (step.sub) wrap.appendChild(el("p", "demo-step__sub", step.sub));
  }

  var STEPS = [
    {
      id: "business", field: "business", type: "cards",
      title: "Wat voor bedrijf heb je?",
      options: [
        { label: "Restaurant", icon: "restaurant" },
        { label: "Kapsalon", icon: "kapsalon" },
        { label: "Bouwbedrijf", icon: "bouwbedrijf" },
        { label: "Schoonmaak", icon: "schoonmaak" },
        { label: "Coach", icon: "coach" },
        { label: "Makelaar", icon: "makelaar" },
        { label: "Webshop", icon: "webshop" },
        { label: "Sportschool", icon: "sportschool" },
        { label: "Anders", icon: "anders" }
      ]
    },
    {
      id: "companyName", field: "companyName", type: "text",
      title: "Hoe heet je bedrijf?",
      placeholder: "Bijv. Bakkerij Jansen"
    },
    {
      id: "hasWebsite", field: "hasWebsite", type: "yesno",
      title: "Heb je al een website?"
    },
    {
      id: "goal", field: "goal", type: "cards",
      title: "Wat wil je vooral bereiken?",
      options: [
        { label: "Meer klanten", icon: "users" },
        { label: "Professionelere uitstraling", icon: "award" },
        { label: "Meer aanvragen", icon: "inbox" },
        { label: "Nieuwe website", icon: "monitor" },
        { label: "Anders", icon: "anders" }
      ]
    },
    {
      id: "style", field: "style", type: "style",
      title: "Welke stijl vind je mooi?",
      options: ["Modern", "Luxe", "Minimalistisch", "Zakelijk", "Speels"]
    },
    {
      id: "pages", field: "pages", type: "multi", skippable: true,
      title: "Welke pagina&rsquo;s wil je ongeveer?",
      sub: "Kies er zoveel als je wilt, of sla over als je het nog niet weet.",
      options: [
        { label: "Home", icon: "home" },
        { label: "Over ons", icon: "info" },
        { label: "Diensten", icon: "list" },
        { label: "Portfolio", icon: "image" },
        { label: "Reviews", icon: "star" },
        { label: "Contact", icon: "phone" },
        { label: "Offerte aanvragen", icon: "file" },
        { label: "Afspraak maken", icon: "calendar" }
      ]
    },
    {
      id: "extra", field: "extra", type: "textarea",
      title: "Is er nog iets wat ik moet weten?",
      sub: "Optioneel &mdash; alles is welkom.",
      placeholder: "Bijv. een concurrent waar je iets van vindt, of een wens die je hebt..."
    },
    {
      id: "contact", field: "contact", type: "contact",
      title: "Bijna klaar! Waar mag Sami je demo naartoe sturen?"
    }
  ];

  var stage = document.querySelector(".demo-flow__stage");
  var progressBar = document.querySelector(".demo-flow__progress-bar");
  var stepLabel = document.querySelector(".demo-flow__step-label");
  var progressWrap = document.querySelector(".demo-flow__progress");
  if (!stage) return;

  var answers = { pages: [] };
  var currentIndex = 0;

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function updateProgress(index, done) {
    var pct = done ? 100 : Math.round((index / STEPS.length) * 100);
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressWrap) progressWrap.setAttribute("aria-valuenow", String(pct));
    if (stepLabel) stepLabel.textContent = done ? "Klaar!" : "Stap " + (index + 1) + " van " + STEPS.length;
  }

  function buildContinue(label, disabled) {
    var wrap = el("div", "demo-continue");
    var btn = el("button", "btn btn--solid", label || "Doorgaan");
    btn.type = "button";
    if (disabled) btn.disabled = true;
    wrap.appendChild(btn);
    return { wrap: wrap, btn: btn };
  }

  function focusFirstInput(wrap) {
    var field = wrap.querySelector("input, textarea");
    if (field) window.setTimeout(function () { field.focus(); }, 350);
  }

  function renderCardsStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var grid = el("div", "demo-cards");
    step.options.forEach(function (opt, i) {
      var card = el("button", "demo-card demo-card--" + (i % 5),
        '<span class="demo-card__icon">' + icon(opt.icon) + "</span>" +
        '<span class="demo-card__label">' + opt.label + "</span>" +
        '<span class="demo-card__check">' + icon("check") + "</span>"
      );
      card.type = "button";
      card.style.animationDelay = (i * 40) + "ms";
      card.addEventListener("click", function () {
        if (card.classList.contains("is-selected")) return;
        answers[step.field] = opt.label;
        card.classList.add("is-selected");
        window.setTimeout(function () { goTo(index + 1); }, 320);
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  var STYLE_ACCENTS = {
    modern: "#1c1c1c",
    luxe: "#8a6a2f",
    minimalistisch: "#c9c6bd",
    zakelijk: "#1b2f47",
    speels: "hsl(var(--accent-bright))"
  };

  function renderStyleStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var grid = el("div", "demo-style-cards");
    step.options.forEach(function (label, i) {
      var slug = label.toLowerCase();
      var card = el("button", "demo-style-card",
        '<div class="demo-style-card__preview demo-style-card__preview--' + slug + '">' +
        '<span class="dsc__nav"><span></span><span></span><span></span></span>' +
        '<span class="dsc__bar dsc__bar--1"></span>' +
        '<span class="dsc__bar dsc__bar--2"></span>' +
        '<span class="dsc__btn"></span>' +
        "</div>" +
        '<div class="demo-style-card__label">' + label + "</div>"
      );
      card.type = "button";
      card.style.animationDelay = (i * 40) + "ms";
      card.addEventListener("click", function () {
        if (card.classList.contains("is-selected")) return;
        answers[step.field] = label;
        card.classList.add("is-selected");

        var stageRect = stage.getBoundingClientRect();
        var cardRect = card.getBoundingClientRect();
        var flash = el("div", "demo-style-flash");
        flash.style.background = STYLE_ACCENTS[slug] || "hsl(var(--accent))";
        flash.style.setProperty("--fx", (((cardRect.left + cardRect.width / 2 - stageRect.left) / stageRect.width) * 100) + "%");
        flash.style.setProperty("--fy", (((cardRect.top + cardRect.height / 2 - stageRect.top) / stageRect.height) * 100) + "%");
        stage.appendChild(flash);
        requestAnimationFrame(function () { flash.classList.add("is-growing"); });

        window.setTimeout(function () {
          flash.classList.add("is-fading");
          goTo(index + 1);
        }, 380);
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderMultiStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var grid = el("div", "demo-cards");
    var selected = {};
    var cont = buildContinue("Doorgaan", true);
    step.options.forEach(function (opt, i) {
      var card = el("button", "demo-card demo-card--" + (i % 5),
        '<span class="demo-card__icon">' + icon(opt.icon) + "</span>" +
        '<span class="demo-card__label">' + opt.label + "</span>" +
        '<span class="demo-card__check">' + icon("check") + "</span>"
      );
      card.type = "button";
      card.style.animationDelay = (i * 40) + "ms";
      card.addEventListener("click", function () {
        var isSel = card.classList.toggle("is-selected");
        if (isSel) selected[opt.label] = true; else delete selected[opt.label];
        cont.btn.disabled = Object.keys(selected).length === 0;
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    cont.btn.addEventListener("click", function () {
      answers[step.field] = Object.keys(selected);
      goTo(index + 1);
    });
    wrap.appendChild(cont.wrap);
    if (step.skippable) {
      var skip = el("button", "demo-skip", "Sla deze stap over");
      skip.type = "button";
      skip.addEventListener("click", function () {
        answers[step.field] = [];
        goTo(index + 1);
      });
      cont.wrap.appendChild(skip);
    }
    return wrap;
  }

  function renderTextStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var group = el("div", "demo-input-group");
    var input = el("input", "demo-input");
    input.type = "text";
    input.autocomplete = "off";
    input.placeholder = step.placeholder || "";
    group.appendChild(input);
    wrap.appendChild(group);
    var cont = buildContinue("Doorgaan", true);
    input.addEventListener("input", function () { cont.btn.disabled = input.value.trim() === ""; });
    function submit() { if (input.value.trim() === "") return; answers[step.field] = input.value.trim(); goTo(index + 1); }
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    cont.btn.addEventListener("click", submit);
    wrap.appendChild(cont.wrap);
    focusFirstInput(wrap);
    return wrap;
  }

  function renderTextareaStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var group = el("div", "demo-input-group");
    var textarea = el("textarea", "demo-textarea");
    textarea.placeholder = step.placeholder || "";
    group.appendChild(textarea);
    wrap.appendChild(group);
    var cont = buildContinue("Doorgaan");
    cont.btn.addEventListener("click", function () {
      answers[step.field] = textarea.value.trim();
      goTo(index + 1);
    });
    wrap.appendChild(cont.wrap);
    focusFirstInput(wrap);
    return wrap;
  }

  function renderYesNoStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var grid = el("div", "demo-cards");
    var urlGroupWrap = null;
    ["Ja", "Nee"].forEach(function (label, i) {
      var card = el("button", "demo-card",
        '<span class="demo-card__label">' + label + "</span>" +
        '<span class="demo-card__check">' + icon("check") + "</span>"
      );
      card.type = "button";
      card.style.animationDelay = (i * 40) + "ms";
      card.addEventListener("click", function () {
        Array.prototype.forEach.call(grid.querySelectorAll(".demo-card"), function (c) { c.classList.remove("is-selected"); });
        card.classList.add("is-selected");
        answers.hasWebsite = label;
        if (label === "Nee") {
          answers.websiteUrl = "";
          window.setTimeout(function () { goTo(index + 1); }, 320);
        } else if (!urlGroupWrap) {
          urlGroupWrap = el("div", "demo-input-group", '<label for="demo-website-url">Wat is het adres van je huidige website?</label>');
          var input = el("input", "demo-input");
          input.type = "text";
          input.id = "demo-website-url";
          input.autocomplete = "off";
          input.placeholder = "bijv. www.jouwbedrijf.nl";
          urlGroupWrap.appendChild(input);
          wrap.insertBefore(urlGroupWrap, wrap.querySelector(".demo-continue") || null);
          var cont = buildContinue("Doorgaan");
          cont.btn.addEventListener("click", function () {
            answers.websiteUrl = input.value.trim();
            goTo(index + 1);
          });
          wrap.appendChild(cont.wrap);
          window.setTimeout(function () { input.focus(); }, 350);
        }
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderContactStep(step, index) {
    var wrap = el("div", "demo-step");
    stepHead(wrap, step, index);
    var nameGroup = el("div", "demo-input-group", '<label for="demo-name">Naam</label>');
    var nameInput = el("input", "demo-input");
    nameInput.type = "text";
    nameInput.id = "demo-name";
    nameInput.autocomplete = "name";
    nameInput.placeholder = "Jouw naam";
    nameGroup.appendChild(nameInput);

    var phoneGroup = el("div", "demo-input-group", '<label for="demo-phone">Telefoonnummer</label>');
    var phoneInput = el("input", "demo-input");
    phoneInput.type = "tel";
    phoneInput.id = "demo-phone";
    phoneInput.autocomplete = "tel";
    phoneInput.placeholder = "06 - 12345678";
    phoneGroup.appendChild(phoneInput);

    var emailGroup = el("div", "demo-input-group", '<label for="demo-email">E-mailadres (optioneel)</label>');
    var emailInput = el("input", "demo-input");
    emailInput.type = "email";
    emailInput.id = "demo-email";
    emailInput.autocomplete = "email";
    emailInput.placeholder = "jij@voorbeeld.nl";
    emailGroup.appendChild(emailInput);

    wrap.appendChild(nameGroup);
    wrap.appendChild(phoneGroup);
    wrap.appendChild(emailGroup);

    var cont = buildContinue("Vraag mijn gratis demo aan", true);
    function checkValid() { cont.btn.disabled = nameInput.value.trim() === "" || phoneInput.value.trim() === ""; }
    nameInput.addEventListener("input", checkValid);
    phoneInput.addEventListener("input", checkValid);

    function submit() {
      if (nameInput.value.trim() === "" || phoneInput.value.trim() === "") return;
      answers.name = nameInput.value.trim();
      answers.phone = phoneInput.value.trim();
      answers.email = emailInput.value.trim();
      goTo(index + 1);
    }
    [nameInput, phoneInput, emailInput].forEach(function (input) {
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    });
    cont.btn.addEventListener("click", submit);
    wrap.appendChild(cont.wrap);
    wrap.appendChild(el("p", "demo-trust-note",
      icon("check") + " We gebruiken dit alleen om je gratis demo naar je toe te sturen. Geen spam."
    ));
    focusFirstInput(wrap);
    return wrap;
  }

  function buildStepNode(step, index) {
    switch (step.type) {
      case "cards": return renderCardsStep(step, index);
      case "style": return renderStyleStep(step, index);
      case "multi": return renderMultiStep(step, index);
      case "text": return renderTextStep(step, index);
      case "textarea": return renderTextareaStep(step, index);
      case "yesno": return renderYesNoStep(step, index);
      case "contact": return renderContactStep(step, index);
    }
  }

  function showStep(index, backwards) {
    currentIndex = index;
    updateProgress(index, false);
    var node = buildStepNode(STEPS[index], index);
    if (backwards) node.classList.add("demo-step--back");
    stage.appendChild(node);
  }

  function realignScroll() {
    var inner = document.querySelector(".demo-flow__inner");
    if (!inner) return;
    var top = inner.getBoundingClientRect().top;
    if (top < -40 || top > 120) {
      window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
    }
  }

  function goTo(index, backwards) {
    var current = stage.querySelector(".demo-step");
    function place() {
      stage.innerHTML = "";
      if (index >= STEPS.length) { renderEnd(); } else { showStep(index, backwards); }
      realignScroll();
    }
    if (current) {
      current.classList.add(backwards ? "is-leaving-back" : "is-leaving");
      window.setTimeout(place, 220);
    } else {
      place();
    }
  }

  /* ---- end screen: quick summary + direct wa.me handoff ---- */

  function buildSummaryPairs() {
    var pairs = [
      { q: "Wat voor bedrijf heb je?", a: answers.business },
      { q: "Hoe heet je bedrijf?", a: answers.companyName },
      { q: "Heb je al een website?", a: answers.hasWebsite === "Ja" ? ("Ja" + (answers.websiteUrl ? " &mdash; " + answers.websiteUrl : "")) : "Nog geen website" },
      { q: "Wat wil je vooral bereiken?", a: answers.goal },
      { q: "Welke stijl vind je mooi?", a: answers.style },
      { q: "Welke pagina&rsquo;s wil je ongeveer?", a: (answers.pages && answers.pages.length ? answers.pages.join(", ") : "Laat ik aan Sami over") }
    ];
    if (answers.extra) pairs.push({ q: "Nog iets dat ik moet weten?", a: answers.extra });
    pairs.push({ q: "Naam en telefoonnummer?", a: answers.name + " &middot; " + answers.phone + (answers.email ? " &middot; " + answers.email : "") });
    return pairs;
  }

  function buildWaLink() {
    var lines = [];
    lines.push("👋 Nieuwe demo aanvraag");
    lines.push("");
    lines.push("🏢 Bedrijf: " + answers.companyName);
    lines.push("📂 Branche: " + answers.business);
    lines.push("🌐 Website: " + (answers.hasWebsite === "Ja" && answers.websiteUrl ? answers.websiteUrl : "Nog geen website"));
    lines.push("🎯 Doel: " + answers.goal);
    lines.push("🎨 Stijl: " + answers.style);
    lines.push("📄 Pagina's: " + (answers.pages && answers.pages.length ? answers.pages.join(", ") : "-"));
    if (answers.extra) lines.push("📝 Extra informatie: " + answers.extra);
    lines.push("👤 Naam: " + answers.name);
    lines.push("📱 Telefoon: " + answers.phone);
    if (answers.email) lines.push("📧 E-mail: " + answers.email);
    lines.push("");
    lines.push("Ik kijk uit naar de gratis demo!");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function burstConfetti() {
    var host = el("div", "demo-confetti");
    document.body.appendChild(host);
    var colors = ["#c6ff3d", "#8b5cf6", "#22c55e", "#facc15", "#38bdf8"];
    for (var i = 0; i < 46; i++) {
      var s = document.createElement("span");
      s.style.left = (Math.random() * 100) + "vw";
      s.style.background = colors[i % colors.length];
      s.style.animationDuration = (2.1 + Math.random() * 1.4) + "s";
      s.style.animationDelay = (Math.random() * 0.35) + "s";
      s.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
      host.appendChild(s);
    }
    window.setTimeout(function () { host.remove(); }, 4200);
  }

  function renderEnd() {
    updateProgress(STEPS.length, true);
    var wrap = el("div", "demo-step demo-end");
    wrap.appendChild(el("h2", "demo-step__title", "Top! Ik heb genoeg informatie om een demo voor je te maken."));
    wrap.appendChild(el("p", "demo-step__sub demo-end__intro", "Controleer je gegevens en verstuur ze direct naar Sami via WhatsApp. Meestal ontvang je je demo binnen enkele dagen."));

    var summary = el("div", "sami-chat-summary demo-end__summary");
    summary.innerHTML = buildSummaryPairs().map(function (p) {
      return '<div class="sami-chat-summary__row"><span>' + p.q + "</span><strong>" + p.a + "</strong></div>";
    }).join("");
    wrap.appendChild(summary);

    var cta = el("div", "demo-end__cta");
    var waBtn = el("a", "btn btn--solid", "Verstuur via WhatsApp");
    waBtn.href = buildWaLink();
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    cta.appendChild(waBtn);
    wrap.appendChild(cta);

    stage.appendChild(wrap);
    burstConfetti();
  }

  var backLink = document.querySelector("[data-demo-back]");
  if (backLink) {
    backLink.addEventListener("click", function (e) {
      if (currentIndex > 0) {
        e.preventDefault();
        goTo(currentIndex - 1, true);
      }
    });
  }

  showStep(0);
})();
