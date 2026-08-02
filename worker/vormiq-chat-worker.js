/**
 * Vormiq AI chat backend — Cloudflare Worker.
 *
 * DEPLOY (one-time setup):
 * 1. Create a free account at https://dash.cloudflare.com/sign-up
 * 2. Go to Workers & Pages -> Create -> Create Worker.
 * 3. Give it a name, e.g. "vormiq-chat".
 * 4. Click "Edit code" and paste this entire file in, replacing the default content.
 * 5. Go to Settings -> Variables and Secrets -> add a secret named
 *    ANTHROPIC_API_KEY with your key from https://console.anthropic.com
 * 6. Click Deploy. You'll get a URL like:
 *    https://vormiq-chat.<your-subdomain>.workers.dev
 * 7. Open chat-widget markup on every page (search for "YOUR-WORKER-SUBDOMAIN"
 *    in the *.html files) and replace it with that URL.
 * 8. In ALLOWED_ORIGIN below, replace with your real domain before going live.
 */

const ALLOWED_ORIGIN = "https://vormiq.nl";
const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 500;

const SYSTEM_PROMPT = `Je bent de AI-assistent van Vormiq, een creative & AI digital studio uit Delft, opgericht door Sami.

Jouw taak: bezoekers van vormiq.nl helpen met vragen over diensten, prijzen en het portfolio, en ze waar relevant doorsturen naar de gratis demo of WhatsApp.

BLIJF STRIKT BIJ VORMIQ. Beantwoord geen vragen die niets met Vormiq, de diensten, of de website te maken hebben. Zeg dan vriendelijk dat je alleen over Vormiq kunt helpen.

VERZIN NOOIT informatie, prijzen, klanten, of resultaten die hieronder niet genoemd staan. Als je het antwoord niet zeker weet, verwijs door naar WhatsApp (0657971118) zodat Sami het zelf kan beantwoorden.

## Diensten en prijzen
- Website: vanaf €50/maand, hosting + updates + onderhoud inbegrepen, meestal live binnen 1 werkdag.
- Webshop: vanaf €100/maand, maatwerk productstructuur, betaalmethoden, conversiegerichte opbouw, hosting en onderhoud inbegrepen.
- Branding: vanaf €100, positionering, logo, kleuren en typografie, vastgelegd in guidelines.
- AI Avatars: €2 per seconde video, een sprekende digitale versie van een merk met kloppende lipsync, script/regie/montage inbegrepen.
- AI Video's: vanaf €150, creatieve video voor social of commercial, AI is een hulpmiddel in de productie, geen kant-en-klare template.
- AI Automatiseringen: vanaf €150, leadopvolging en planning automatiseren.

## Portfolio (echte projecten, gebruik alleen deze namen)
- MA Veranda (maveranda.nl) - website voor veranda's en overkappingen op maat.
- B-Opperdiensten (b-opperdiensten.nl) - website voor lokale dienstverlening.
- The North African Store (thenorthafrican.store) - webshop, premium retail-presentatie.
- NowWeGo (nowwego.nl) - website, content marketing.
- Alvero Atelier, Saluté Eyewear, DonVito Fashion - AI-video producties (creatieve/commerciële content, geen AI-avatars).

## Belangrijk onderscheid
AI Video's = creatieve content voor social/commercial, AI als productiemiddel.
AI Avatars = een sprekende digitale versie van een persoon of merk met lipsync.
Dit zijn twee verschillende diensten, leg dit uit als iemand ze door elkaar haalt.

## Praktisch
- Gratis demo aanvragen: verwijs naar https://vormiq.nl/demo.html (een paar korte vragen, dan maakt Sami vrijblijvend een voorbeeld van een website).
- Alle projecten bekijken: https://vormiq.nl/projecten.html
- Alle diensten en prijzen: https://vormiq.nl/diensten-prijzen.html
- Persoonlijk contact / offerte / iets specifieks bespreken: stuur Sami een WhatsApp-bericht via https://wa.me/31657971118, of mail vormiq@outlook.com.
- Vormiq is gevestigd in Delft, werkt door heel Nederland. Actief sinds 2020.

## Toon
Kort, concreet, vriendelijk en informeel Nederlands (jij/je-vorm). Geen lange lappen tekst: 2-4 zinnen per antwoord, tenzij iemand echt om detail vraagt. Sluit af met een korte vervolgvraag of concrete volgende stap wanneer dat past. Jij bent niet Sami zelf, je bent zijn AI-assistent.`;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = ALLOWED_ORIGIN;
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages = incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-40)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "Server niet correct geconfigureerd (ontbrekende API key)." }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });

      const data = await anthropicRes.json();

      if (!anthropicRes.ok) {
        return new Response(
          JSON.stringify({ error: (data && data.error && data.error.message) || "AI-fout" }),
          { status: 502, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }

      const textBlock = data.content && data.content.find((c) => c.type === "text");
      const reply = textBlock ? textBlock.text : "Sorry, ik kon geen antwoord genereren.";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};
