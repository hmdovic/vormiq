(function () {
  "use strict";

  var WA_NUMBER = "31657971118";

  function waLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }

  var FLOW = {
    start: {
      bot: "Hoi! Ik ben de Vormiq-assistent. Waarmee kan ik je helpen?",
      options: [
        { label: "Diensten & prijzen", next: "services" },
        { label: "Ons werk bekijken", href: "projecten.html" },
        { label: "Gratis demo aanvragen", href: "demo.html" },
        { label: "Veelgestelde vragen", next: "faq" },
        { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag over Vormiq." },
      ],
    },
    services: {
      bot: "Welke dienst wil je meer over weten?",
      options: [
        { label: "Website", next: "svc_website" },
        { label: "Webshop", next: "svc_webshop" },
        { label: "Branding", next: "svc_branding" },
        { label: "AI Avatars", next: "svc_avatars" },
        { label: "AI Video's", next: "svc_video" },
        { label: "AI Automatiseringen", next: "svc_automation" },
        { label: "Alles op 1 pagina", href: "diensten-prijzen.html" },
        { label: "← Terug naar begin", next: "start" },
      ],
    },
    svc_website: {
      bot: "Website: vanaf €50/maand. Op maat gebouwd, met hosting, updates en onderhoud inbegrepen. Meestal binnen 1 werkdag live.",
      options: [
        { label: "Meer info", href: "website.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd wat een website via Vormiq kost." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    svc_webshop: {
      bot: "Webshop: vanaf €100/maand. Maatwerk productstructuur, betaalmethoden en conversiegerichte opbouw, hosting en onderhoud inbegrepen.",
      options: [
        { label: "Meer info", href: "webshop.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd wat een webshop via Vormiq kost." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    svc_branding: {
      bot: "Branding: vanaf €100. Positionering, logo, kleuren en typografie, vastgelegd in heldere guidelines.",
      options: [
        { label: "Meer info", href: "diensten-prijzen.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd naar branding via Vormiq." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    svc_avatars: {
      bot: "AI Avatars: €2 per seconde video. Een sprekende digitale versie van jou of je merk, met kloppende lipsync. Script, regie en montage inbegrepen.",
      options: [
        { label: "Meer info", href: "ai-avatars.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd naar een AI avatar video." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    svc_video: {
      bot: "AI Video's: vanaf €150. Creatieve video voor social of commercial, met storyboard en montage. AI is een hulpmiddel, geen kant-en-klare template.",
      options: [
        { label: "Meer info", href: "ai-video.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd naar een AI video." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    svc_automation: {
      bot: "AI Automatiseringen: vanaf €150. Leadopvolging en planning automatiseren, op maat per workflow gebouwd.",
      options: [
        { label: "Meer info", href: "diensten-prijzen.html" },
        { label: "Ik wil dit, praat met Sami", wa: "Hoi Sami, ik ben benieuwd naar AI automatiseringen via Vormiq." },
        { label: "← Andere diensten", next: "services" },
      ],
    },
    faq: {
      bot: "Waar wil je meer over weten?",
      options: [
        { label: "Hoe lang duurt een website?", next: "faq_duration" },
        { label: "Waarom €50 per maand?", next: "faq_price" },
        { label: "Kan ik later uitbreiden?", next: "faq_expand" },
        { label: "Bouwen jullie webshops?", next: "faq_webshop" },
        { label: "Werken jullie alleen in Delft?", next: "faq_delft" },
        { label: "← Terug naar begin", next: "start" },
      ],
    },
    faq_duration: {
      bot: "Een website staat meestal binnen ongeveer één werkdag live. Een uitgebreider traject duurt langer, afhankelijk van het aantal pagina's en de gewenste strategie.",
      options: [{ label: "← Andere vragen", next: "faq" }, { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag." }],
    },
    faq_price: {
      bot: "Zo betaal je niet in één keer een groot bedrag, en zit alles (bouwen, hosten, updaten, onderhoud) in die ene vaste rekening.",
      options: [{ label: "← Andere vragen", next: "faq" }, { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag." }],
    },
    faq_expand: {
      bot: "Ja. Je website of webshop groeit mee: meer pagina's, extra functionaliteit of een uitgebreidere strategie passen we in overleg aan, inclusief de prijs.",
      options: [{ label: "← Andere vragen", next: "faq" }, { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag." }],
    },
    faq_webshop: {
      bot: "Ja, webshops zijn een aparte dienst vanaf €100 per maand, alles inbegrepen.",
      options: [{ label: "← Andere vragen", next: "faq" }, { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag." }],
    },
    faq_delft: {
      bot: "Vormiq is gevestigd in Delft en werkt voor ondernemers uit Delft, maar ook voor bedrijven elders in Nederland.",
      options: [{ label: "← Andere vragen", next: "faq" }, { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag." }],
    },
    fallback: {
      bot: "Ik snap je vraag niet helemaal. Kies een van de opties, of stuur Sami direct een appje.",
      options: [
        { label: "Diensten & prijzen", next: "services" },
        { label: "Veelgestelde vragen", next: "faq" },
        { label: "Ik wil Sami spreken", wa: "Hoi Sami, ik heb een vraag over Vormiq." },
      ],
    },
  };

  var KEYWORD_ROUTES = [
    { test: /webshop/i, next: "svc_webshop" },
    { test: /avatar/i, next: "svc_avatars" },
    { test: /\bvideo/i, next: "svc_video" },
    { test: /brand|logo/i, next: "svc_branding" },
    { test: /automat/i, next: "svc_automation" },
    { test: /website|site\b/i, next: "svc_website" },
    { test: /prijs|kost|euro|€|tarief/i, next: "services" },
    { test: /demo/i, href: "demo.html" },
    { test: /werk|project|portfolio/i, href: "projecten.html" },
    { test: /delft/i, next: "faq_delft" },
    { test: /uitbreid/i, next: "faq_expand" },
    { test: /lang|duur|snel/i, next: "faq_duration" },
    { test: /sami|contact|bellen|appje|whatsapp/i, wa: "Hoi Sami, ik heb een vraag over Vormiq." },
  ];

  function init() {
    var widget = document.querySelector("[data-chat-widget]");
    if (!widget || widget.dataset.chatInit) return;
    widget.dataset.chatInit = "1";

    var toggle = widget.querySelector("[data-chat-toggle]");
    var closeBtn = widget.querySelector("[data-chat-close]");
    var panel = widget.querySelector("[data-chat-panel]");
    var messagesEl = widget.querySelector("[data-chat-messages]");
    var suggestionsEl = widget.querySelector("[data-chat-suggestions]");
    var form = widget.querySelector("[data-chat-form]");
    var input = widget.querySelector("[data-chat-input]");

    var opened = false;

    function open() {
      widget.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      if (!opened) {
        opened = true;
        renderNode("start");
      }
      window.setTimeout(function () { if (input) input.focus(); }, 250);
    }
    function close() {
      widget.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    }
    toggle.addEventListener("click", function () {
      if (widget.classList.contains("is-open")) close(); else open();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && widget.classList.contains("is-open")) close();
    });

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function addMessage(role, text) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--" + role;
      msg.innerHTML = escapeHtml(text);
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    function showTyping(callback) {
      var el = document.createElement("div");
      el.className = "chat-typing";
      el.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      window.setTimeout(function () {
        el.remove();
        callback();
      }, 350);
    }

    function clearSuggestions() {
      if (suggestionsEl) suggestionsEl.innerHTML = "";
    }

    function renderNode(key) {
      var node = FLOW[key] || FLOW.fallback;
      clearSuggestions();
      showTyping(function () {
        addMessage("bot", node.bot);
        node.options.forEach(function (opt) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = opt.label;
          btn.addEventListener("click", function () { handleOption(opt); });
          suggestionsEl.appendChild(btn);
        });
      });
    }

    function handleOption(opt) {
      addMessage("user", opt.label);
      clearSuggestions();
      if (opt.wa) {
        showTyping(function () {
          addMessage("bot", "Ik open WhatsApp voor je, dan reageert Sami snel persoonlijk.");
          window.open(waLink(opt.wa), "_blank", "noopener");
          renderNode("start");
        });
        return;
      }
      if (opt.href) {
        showTyping(function () {
          addMessage("bot", "Ik open die pagina voor je…");
          window.setTimeout(function () { window.location.href = opt.href; }, 500);
        });
        return;
      }
      renderNode(opt.next || "start");
    }

    function routeFreeText(text) {
      for (var i = 0; i < KEYWORD_ROUTES.length; i++) {
        var r = KEYWORD_ROUTES[i];
        if (r.test.test(text)) {
          if (r.wa) return handleOption({ label: text, wa: r.wa });
          if (r.href) return handleOption({ label: text, href: r.href });
          if (r.next) return renderNode(r.next);
        }
      }
      renderNode("fallback");
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input ? input.value.trim() : "";
        if (!text) return;
        addMessage("user", text);
        if (input) input.value = "";
        clearSuggestions();
        showTyping(function () { routeFreeText(text); });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
