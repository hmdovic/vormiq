(function () {
  "use strict";

  function init() {
    var widget = document.querySelector("[data-chat-widget]");
    if (!widget || widget.dataset.chatInit) return;
    widget.dataset.chatInit = "1";

    var endpoint = widget.dataset.chatEndpoint;
    var toggle = widget.querySelector("[data-chat-toggle]");
    var closeBtn = widget.querySelector("[data-chat-close]");
    var panel = widget.querySelector("[data-chat-panel]");
    var messagesEl = widget.querySelector("[data-chat-messages]");
    var suggestionsEl = widget.querySelector("[data-chat-suggestions]");
    var form = widget.querySelector("[data-chat-form]");
    var input = widget.querySelector("[data-chat-input]");
    var sendBtn = form ? form.querySelector("button[type=submit]") : null;

    var history = [];
    var MAX_TURNS = 20;
    var opened = false;
    var sending = false;

    function open() {
      widget.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      if (!opened) {
        opened = true;
        greet();
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

    function linkify(str) {
      var urlPattern = /(https?:\/\/[^\s<]+)/g;
      return str.replace(urlPattern, function (url) {
        var clean = url.replace(/[.,)]+$/, "");
        return '<a href="' + clean + '" target="_blank" rel="noopener noreferrer">' + clean + "</a>";
      });
    }

    function addMessage(role, text) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--" + role;
      msg.innerHTML = linkify(escapeHtml(text));
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    function addErrorMessage(prefix) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--error";
      msg.innerHTML = escapeHtml(prefix) + ' <a href="https://wa.me/31657971118?text=Hoi%20Sami%2C%20ik%20had%20een%20vraag%20aan%20de%20chatbot." target="_blank" rel="noopener noreferrer">stuur Sami een appje</a>.';
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      var el = document.createElement("div");
      el.className = "chat-typing";
      el.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }

    function greet() {
      addMessage("bot", "Hoi! Ik ben de Vormiq-assistent. Vraag me gerust naar diensten, prijzen, of onze gratis demo.");
    }

    function setSending(state) {
      sending = state;
      if (sendBtn) sendBtn.disabled = state;
      if (input) input.disabled = state;
    }

    function sendMessage(text) {
      text = (text || "").trim();
      if (!text || sending) return;

      if (history.length >= MAX_TURNS * 2) {
        addMessage("user", text);
        addErrorMessage("We hebben al een heel gesprek gehad, voor het vervolg kun je het beste");
        return;
      }

      addMessage("user", text);
      history.push({ role: "user", content: text });
      if (input) input.value = "";
      setSending(true);
      var typingEl = showTyping();

      if (!endpoint || endpoint.indexOf("YOUR-WORKER") !== -1) {
        window.setTimeout(function () {
          typingEl.remove();
          addErrorMessage("De chatbot is nog niet volledig aangesloten, probeer het via WhatsApp of");
          setSending(false);
        }, 500);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Server error");
          return res.json();
        })
        .then(function (data) {
          typingEl.remove();
          var reply = data && data.reply ? data.reply : "Sorry, daar kwam geen antwoord uit.";
          addMessage("bot", reply);
          history.push({ role: "assistant", content: reply });
          setSending(false);
        })
        .catch(function () {
          typingEl.remove();
          addErrorMessage("Er ging iets mis bij het versturen, probeer het nog eens of");
          setSending(false);
        });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        sendMessage(input ? input.value : "");
      });
    }

    if (suggestionsEl) {
      suggestionsEl.querySelectorAll("[data-chat-suggestion]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          sendMessage(btn.textContent);
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
