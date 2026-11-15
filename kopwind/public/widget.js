/*
 * Kan het vandaag? aftelwidget. Plak op je site:
 *
 *   <div class="khv-teller" data-teller="kerst">
 *     <a href="https://www.kanhetvandaag.nl/hoeveel-dagen-tot-kerst">Aftellen via kanhetvandaag.nl</a>
 *   </div>
 *   <script async src="https://www.kanhetvandaag.nl/widget.js"></script>
 *
 * Het script zet de telling van vandaag boven de link. Geen cookies, geen
 * tracking: het haalt alleen de stand van de teller op.
 */
(function () {
  var script = document.currentScript;
  var basis = script && script.src ? script.src.replace(/\/widget\.js.*$/, "") : "https://www.kanhetvandaag.nl";

  function teken(el) {
    if (el.getAttribute("data-khv-klaar")) return;
    el.setAttribute("data-khv-klaar", "1");
    var id = el.getAttribute("data-teller");
    if (!id) return;
    el.style.cssText +=
      ";display:inline-block;font-family:system-ui,-apple-system,Segoe UI,sans-serif;" +
      "border:1px solid #CDD8E1;border-radius:12px;padding:12px 16px;background:#fff;color:#17222C;" +
      "text-align:center;line-height:1.3;max-width:100%";
    fetch(basis + "/api/aftel?id=" + encodeURIComponent(id))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var getal = document.createElement("div");
        getal.style.cssText = "font-size:36px;font-weight:700;font-variant-numeric:tabular-nums";
        getal.textContent = d.dagen > 0 ? String(d.dagen) : d.titel;
        var regel = document.createElement("div");
        regel.style.cssText = "font-size:15px;margin:2px 0 6px";
        regel.textContent = d.dagen > 0 ? d.regel.replace(/^nog \d+ /, "") : d.regel;
        el.insertBefore(regel, el.firstChild);
        el.insertBefore(getal, el.firstChild);
        var link = el.querySelector("a");
        if (link) link.style.cssText += ";font-size:12px;color:#234E9D";
      })
      .catch(function () {});
  }

  function start() {
    var lijst = document.querySelectorAll(".khv-teller[data-teller]");
    for (var i = 0; i < lijst.length; i++) teken(lijst[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
