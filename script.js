(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  function heart(size) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("width", size); s.setAttribute("height", size);
    var u = document.createElementNS(NS, "use");
    u.setAttribute("href", "#heart");
    s.appendChild(u);
    return s;
  }

  /* peeche uthte hue hearts */
  var layer = document.getElementById("float");
  if (!reduce) {
    for (var i = 0; i < 14; i++) {
      var h = heart(14 + Math.random() * 26);
      h.style.left = (Math.random() * 96) + "%";
      h.style.animationDuration = (11 + Math.random() * 12) + "s";
      h.style.animationDelay = (-Math.random() * 20) + "s";
      layer.appendChild(h);
    }
  }

  /* confetti hearts */
  function burst(fromEl) {
    if (reduce || !fromEl.animate) return;
    var r = fromEl.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 28; i++) {
      var el = document.createElementNS(NS, "svg");
      el.setAttribute("class", "burst");
      var u = document.createElementNS(NS, "use");
      u.setAttribute("href", "#heart");
      el.appendChild(u);
      el.style.left = cx + "px"; el.style.top = cy + "px";
      el.style.opacity = "0";
      el.style.color = i % 3 === 0 ? "var(--lilac)" : "var(--rose)";
      document.body.appendChild(el);
      var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 140;
      var dx = Math.cos(a) * d, dy = Math.sin(a) * d - 60;
      var anim = el.animate([
        { transform: "translate(0,0) scale(.4)", opacity: 1 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(1.1) rotate(" + (Math.random() * 60 - 30) + "deg)", opacity: 1, offset: .6 },
        { transform: "translate(" + dx + "px," + (dy + 120) + "px) scale(.8)", opacity: 0 }
      ], { duration: 1300 + Math.random() * 600, easing: "ease-out" });
      anim.onfinish = (function (n) { return function () { n.remove(); }; })(el);
    }
  }

  /* "Haan" */
  var yes = document.getElementById("yes"), no = document.getElementById("no");
  var after = document.getElementById("after"), stage = document.getElementById("stage");
  var accepted = false;
  function accept(src) {
    if (accepted) return;
    accepted = true;
    burst(src);
    no.hidden = true;
    yes.disabled = true;
    yes.textContent = "Maaf kar diya 💖";
    yes.style.opacity = ".85";
    after.hidden = false;
    stage.style.minHeight = "0";
  }
  yes.addEventListener("click", function () { accept(yes); });

  /* "Nahi" bhaagta hai: button apni jagah se transform ke saath smoothly hat'ta hai */
  var dodges = 0, tx = 0, ty = 0, lastDodge = 0;
  function overlaps(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }
  function dodge() {
    var now = Date.now();
    /* touch par ek tap kai events deta hai (enter, down, click), is liye 450ms mein ek hi dafa */
    if (accepted || dodges >= 6 || now - lastDodge < 450) return;
    lastDodge = now;
    dodges++;
    /* text pehle badlo taake naap naye text ki chaurai se ho */
    if (dodges === 3) no.textContent = "Pakka nahi? 🥺";
    if (dodges >= 6) no.textContent = "Achha chalo, haan 😅";
    var s = stage.getBoundingClientRect();
    var b = no.getBoundingClientRect();
    var y = yes.getBoundingClientRect();
    var bw = b.width, bh = b.height;
    var homeLeft = b.left - tx, homeTop = b.top - ty;
    var left = b.left, top = b.top, found = false;
    for (var i = 0; i < 14 && !found; i++) {
      left = s.left + Math.random() * Math.max(s.width - bw, 0);
      top = s.top + Math.random() * Math.max(s.height - bh, 0);
      var rect = { left: left - 6, top: top - 6, right: left + bw + 6, bottom: top + bh + 6 };
      found = Math.abs(left - b.left) + Math.abs(top - b.top) > 90 && !overlaps(rect, y);
    }
    tx = left - homeLeft;
    ty = top - homeTop;
    if (dodges >= 6) { tx = 0; ty = 0; }
    no.style.transform = "translate(" + tx + "px," + ty + "px)";
  }
  no.addEventListener("pointerenter", dodge);
  no.addEventListener("mouseenter", dodge);
  no.addEventListener("touchstart", function (e) {
    if (dodges < 6) { e.preventDefault(); dodge(); }
  }, { passive: false });
  no.addEventListener("pointerdown", function (e) {
    if (dodges < 6) { e.preventDefault(); dodge(); }
  });
  no.addEventListener("click", function () {
    /* jis tap se button bhaaga, usi tap ka click ginti mein nahi aata */
    if (Date.now() - lastDodge < 700) return;
    if (dodges >= 6) accept(no);
    else dodge();
  });

  /* treat */
  var chips = document.querySelectorAll("#chips .chip");
  var treat = document.getElementById("treat");
  Array.prototype.forEach.call(chips, function (c) {
    c.addEventListener("click", function () {
      Array.prototype.forEach.call(chips, function (o) { o.setAttribute("aria-pressed", "false"); });
      c.setAttribute("aria-pressed", "true");
      treat.textContent = c.getAttribute("data-reply") || "";
    });
  });
})();
