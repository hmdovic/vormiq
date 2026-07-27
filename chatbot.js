(function () {
  "use strict";

  var WHATSAPP_NUMBER = "31657971118";

  var LABELS = {
    intent: "Waar ben je naar op zoek",
    web_type: "Type project",
    web_business: "Bedrijf / dienst",
    web_goal: "Belangrijkste doel",
    web_content: "Content status",
    web_style: "Stijlvoorkeur",
    web_timeline: "Gewenste planning",
    ai_purpose: "Doel van de avatar",
    ai_length: "Gewenste lengte",
    ai_script: "Script status",
    ai_who: "Wie in beeld",
    other_desc: "Omschrijving",
    contact_name: "Naam",
    contact_phone: "Telefoon / e-mail"
  };

  var FLOW = {
    start: {
      field: "intent",
      bot: "Hoi! Ik ben Sami&rsquo;s chatassistent 👋 Waar ben je naar op zoek?",
      options: [
        { label: "Een website", next: "web_type" },
        { label: "Een AI avatar", next: "ai_purpose" },
        { label: "Iets anders", next: "other_desc" }
      ]
    },
    web_type: {
      field: "web_type",
      bot: "Top! Begin je vanaf nul, of wil je een bestaande site vervangen?",
      options: [
        { label: "Nieuwe website", next: "web_business" },
        { label: "Bestaande site vervangen", next: "web_business" }
      ]
    },
    web_business: {
      field: "web_business",
      bot: "Wat voor bedrijf of dienst gaat het worden?",
      input: true,
      next: "web_goal"
    },
    web_goal: {
      field: "web_goal",
      bot: "Wat moet de site vooral opleveren?",
      options: [
        { label: "Meer telefoontjes / boekingen", next: "web_content" },
        { label: "Meer verkoop (webshop)", next: "web_content" },
        { label: "Portfolio / uitstraling tonen", next: "web_content" }
      ]
    },
    web_content: {
      field: "web_content",
      bot: "Heb je al teksten en foto&rsquo;s klaar, of moet dat ook nog geregeld worden?",
      options: [
        { label: "Heb ik al klaar", next: "web_style" },
        { label: "Moet nog geregeld worden", next: "web_style" },
        { label: "Beetje van beide", next: "web_style" }
      ]
    },
    web_style: {
      field: "web_style",
      bot: "Heb je voorbeelden van sites of een stijl die je mooi vindt? (mag ook &lsquo;nee&rsquo;)",
      input: true,
      next: "web_timeline"
    },
    web_timeline: {
      field: "web_timeline",
      bot: "Wanneer wil je live staan?",
      options: [
        { label: "Zo snel mogelijk", next: "contact_name" },
        { label: "Binnen een maand", next: "contact_name" },
        { label: "Geen haast", next: "contact_name" }
      ]
    },
    ai_purpose: {
      field: "ai_purpose",
      bot: "Leuk! Waarvoor wil je de AI avatar gebruiken?",
      options: [
        { label: "Social media content", next: "ai_length" },
        { label: "Productuitleg", next: "ai_length" },
        { label: "Introductievideo", next: "ai_length" }
      ]
    },
    ai_length: {
      field: "ai_length",
      bot: "Hoe lang moet de video ongeveer worden?",
      options: [
        { label: "±15-30 sec.", next: "ai_script" },
        { label: "±30-60 sec.", next: "ai_script" },
        { label: "60+ sec.", next: "ai_script" },
        { label: "Weet ik nog niet", next: "ai_script" }
      ]
    },
    ai_script: {
      field: "ai_script",
      bot: "Heb je al een script, of moet dat ook geschreven worden?",
      options: [
        { label: "Heb al een script", next: "ai_who" },
        { label: "Moet nog geschreven worden", next: "ai_who" }
      ]
    },
    ai_who: {
      field: "ai_who",
      bot: "Wil je jezelf als avatar, of iets anders (bijv. een merk-personage)?",
      input: true,
      next: "contact_name"
    },
    other_desc: {
      field: "other_desc",
      bot: "Geen probleem &mdash; vertel kort wat je zoekt?",
      input: true,
      next: "contact_name"
    },
    contact_name: {
      field: "contact_name",
      bot: "Laatste stap &mdash; wat is je naam?",
      input: true,
      next: "contact_phone"
    },
    contact_phone: {
      field: "contact_phone",
      bot: "En op welk telefoonnummer of e-mailadres kan Sami je bereiken?",
      input: true,
      next: "done"
    }
  };

  var STEP_ORDER = ["intent", "web_type", "web_business", "web_goal", "web_content", "web_style", "web_timeline", "ai_purpose", "ai_length", "ai_script", "ai_who", "other_desc", "contact_name", "contact_phone"];
  var TOTAL_STEPS = 6; // approximate depth of any single branch, used for the progress bar

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* Generic conversation engine — drives any set of DOM refs (floating widget or hero mockup) through the same FLOW graph. */
  function mountChatEngine(refs) {
    var state = { key: "start", answers: {} };
    var messagesEl = refs.messagesEl;
    var quickRepliesEl = refs.quickRepliesEl;
    var inputRow = refs.inputRow;
    var inputField = refs.inputField;
    var progressBar = refs.progressBar;

    function scrollToBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addBubble(text, kind) {
      var bubble = el("div", "sami-chat-bubble sami-chat-bubble--" + kind, text);
      messagesEl.appendChild(bubble);
      scrollToBottom();
      return bubble;
    }

    function addTyping(callback) {
      var typing = el("div", "sami-chat-bubble sami-chat-bubble--bot sami-chat-typing", "<span></span><span></span><span></span>");
      messagesEl.appendChild(typing);
      scrollToBottom();
      window.setTimeout(function () {
        typing.remove();
        callback();
      }, 500 + Math.random() * 350);
    }

    function clearComposer() {
      quickRepliesEl.innerHTML = "";
      quickRepliesEl.style.display = "none";
      inputRow.style.display = "none";
    }

    function updateProgress() {
      if (!progressBar) return;
      var pct = Math.min(100, Math.round((Object.keys(state.answers).length / TOTAL_STEPS) * 100));
      progressBar.style.width = pct + "%";
    }

    function renderStep() {
      if (state.key === "done") { return renderDone(); }
      var node = FLOW[state.key];
      updateProgress();
      addTyping(function () {
        addBubble(node.bot, "bot");
        clearComposer();
        if (node.options) {
          quickRepliesEl.style.display = "flex";
          node.options.forEach(function (opt) {
            var btn = el("button", "sami-chat-chip", opt.label);
            btn.type = "button";
            btn.addEventListener("click", function () { answer(node.field, opt.label, opt.next); });
            quickRepliesEl.appendChild(btn);
          });
        } else if (node.input) {
          inputRow.style.display = "flex";
          inputField.value = "";
          inputRow.onsubmit = function (e) {
            e.preventDefault();
            var val = inputField.value.trim();
            if (!val) return;
            answer(node.field, val, node.next);
          };
        }
      });
    }

    function answer(field, label, next) {
      addBubble(label, "user");
      state.answers[field] = label;
      state.key = next;
      clearComposer();
      renderStep();
    }

    function buildSummaryLines() {
      return STEP_ORDER.filter(function (f) { return state.answers[f]; }).map(function (f) {
        return LABELS[f] + ": " + state.answers[f];
      });
    }

    function renderDone() {
      updateProgress();
      if (progressBar) progressBar.style.width = "100%";
      addTyping(function () {
        addBubble("Helemaal goed — hier is je vragenlijst. Stuur &rsquo;m met &eacute;&eacute;n tik naar Sami via WhatsApp, dan neemt hij snel contact op.", "bot");
        clearComposer();
        var lines = buildSummaryLines();
        var summary = el("div", "sami-chat-summary");
        summary.innerHTML = lines.map(function (l) {
          var parts = l.split(": ");
          return '<div class="sami-chat-summary__row"><span>' + parts[0] + "</span><strong>" + parts.slice(1).join(": ") + "</strong></div>";
        }).join("");
        messagesEl.appendChild(summary);

        var waText = "Hoi Sami! Ik heb de vragenlijst op vormiq.nl ingevuld:\n\n" + lines.join("\n");
        var waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waText);

        var actions = el("div", "sami-chat-final-actions");
        var waBtn = el("a", "btn btn--primary sami-chat-send-btn", "Verstuur naar Sami via WhatsApp");
        waBtn.href = waLink;
        waBtn.target = "_blank";
        waBtn.rel = "noopener noreferrer";
        var restartBtn = el("button", "sami-chat-restart", "Nieuw gesprek starten");
        restartBtn.type = "button";
        restartBtn.addEventListener("click", function () {
          state = { key: "start", answers: {} };
          messagesEl.innerHTML = "";
          renderStep();
        });
        actions.appendChild(waBtn);
        actions.appendChild(restartBtn);
        messagesEl.appendChild(actions);
        scrollToBottom();
      });
    }

    return {
      start: function () {
        if (messagesEl.children.length === 0) renderStep();
      }
    };
  }

  function buildFloatingWidget() {
    var launcher = el("button", "sami-chat-launcher", "");
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Chat met Sami's assistent");
    launcher.innerHTML =
      '<img src="sami-portrait.jpg" alt="" />' +
      '<span class="sami-chat-launcher__badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>' +
      '<span class="sami-chat-launcher__unread">1</span>';

    var preview = el("div", "sami-chat-preview", 'Hoi 👋 Vraag me gerust iets over je website of AI avatar &mdash; ik denk graag met je mee.<button type="button" class="sami-chat-preview__close" aria-label="Sluiten">&times;</button>');

    var panel = el("div", "sami-chat-panel");
    panel.innerHTML =
      '<div class="sami-chat-header">' +
      '<img src="sami-portrait.jpg" alt="" class="sami-chat-header__avatar" />' +
      '<div class="sami-chat-header__info"><strong>Sami</strong><span>Meestal binnen enkele minuten</span></div>' +
      '<button type="button" class="sami-chat-header__close" aria-label="Sluiten">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>' +
      "</button>" +
      "</div>" +
      '<div class="sami-chat-progress"><span class="sami-chat-progress__bar"></span></div>' +
      '<div class="sami-chat-messages"></div>' +
      '<div class="sami-chat-composer">' +
      '<div class="sami-chat-quick-replies"></div>' +
      '<form class="sami-chat-input-row">' +
      '<input type="text" autocomplete="off" placeholder="Typ je antwoord..." />' +
      '<button type="submit" aria-label="Versturen"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
      "</form>" +
      "</div>";

    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    document.body.appendChild(preview);

    var engine = mountChatEngine({
      messagesEl: panel.querySelector(".sami-chat-messages"),
      quickRepliesEl: panel.querySelector(".sami-chat-quick-replies"),
      inputRow: panel.querySelector(".sami-chat-input-row"),
      inputField: panel.querySelector(".sami-chat-input-row input"),
      progressBar: panel.querySelector(".sami-chat-progress__bar")
    });

    var closeBtn = panel.querySelector(".sami-chat-header__close");
    var unreadBadge = launcher.querySelector(".sami-chat-launcher__unread");
    var previewCloseBtn = preview.querySelector(".sami-chat-preview__close");

    var HAS_ENGAGED_KEY = "vormiq_sami_chat_engaged";
    function markEngaged() {
      unreadBadge.classList.remove("is-shown");
      preview.classList.remove("is-shown");
      try { sessionStorage.setItem(HAS_ENGAGED_KEY, "1"); } catch (e) {}
    }
    previewCloseBtn.addEventListener("click", function (e) { e.stopPropagation(); markEngaged(); });
    preview.addEventListener("click", function () { markEngaged(); open(); });

    var alreadyEngaged = false;
    try { alreadyEngaged = sessionStorage.getItem(HAS_ENGAGED_KEY) === "1"; } catch (e) {}
    if (!alreadyEngaged) {
      window.setTimeout(function () {
        if (panel.classList.contains("is-open")) return;
        unreadBadge.classList.add("is-shown");
        preview.classList.add("is-shown");
      }, 4000);
    }

    function open() {
      panel.classList.add("is-open");
      launcher.classList.add("is-active");
      markEngaged();
      engine.start();
    }
    function close() {
      panel.classList.remove("is-open");
      launcher.classList.remove("is-active");
    }
    launcher.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) { close(); } else { open(); }
    });
    closeBtn.addEventListener("click", close);

    return { launcher: launcher, panel: panel, preview: preview };
  }

  /* Live WhatsApp-style mockup embedded directly in the hero — same conversation engine, WhatsApp chrome. */
  function buildHeroMockup() {
    var host = document.querySelector(".hero__cards");
    if (!host) return;
    host.innerHTML = "";
    host.classList.add("hero__cards--whatsapp");

    var mock = el("div", "hero-whatsapp-mock hero-in hero-in--3");
    mock.innerHTML =
      '<div class="hero-whatsapp-mock__bar">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' +
      '<img src="sami-portrait.jpg" alt="" class="hero-whatsapp-mock__avatar" />' +
      '<div class="hero-whatsapp-mock__info"><strong>Sami</strong><span>online</span></div>' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' +
      "</div>" +
      '<div class="sami-chat-messages hero-whatsapp-mock__messages"></div>' +
      '<div class="sami-chat-composer hero-whatsapp-mock__composer">' +
      '<div class="sami-chat-quick-replies"></div>' +
      '<form class="sami-chat-input-row">' +
      '<input type="text" autocomplete="off" placeholder="Typ een bericht" />' +
      '<button type="submit" aria-label="Versturen"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>' +
      "</form>" +
      "</div>";
    host.appendChild(mock);

    var engine = mountChatEngine({
      messagesEl: mock.querySelector(".hero-whatsapp-mock__messages"),
      quickRepliesEl: mock.querySelector(".sami-chat-quick-replies"),
      inputRow: mock.querySelector(".sami-chat-input-row"),
      inputField: mock.querySelector(".sami-chat-input-row input")
    });

    if ("IntersectionObserver" in window) {
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            engine.start();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(mock);
    } else {
      engine.start();
    }
  }

  function init() {
    var floating = buildFloatingWidget();
    buildHeroMockup();

    /* Hide the floating launcher while the hero (with its own live mockup) is in view, to avoid two chat entry points competing on screen at once. */
    var hero = document.getElementById("hero");
    if (hero && floating && "IntersectionObserver" in window) {
      var heroIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var hidden = entry.isIntersecting;
          floating.launcher.classList.toggle("is-hidden-for-hero", hidden);
          floating.preview.classList.toggle("is-hidden-for-hero", hidden);
          if (hidden) floating.panel.classList.remove("is-open");
        });
      }, { threshold: 0.15 });
      heroIo.observe(hero);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
