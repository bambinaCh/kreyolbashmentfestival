/* =========================================================================
   KBF – Main script
   No dependencies. Reads content from config.js (KBF_CONFIG, KBF_LINKS)
   and translations from i18n.js (KBF_I18N).
   ========================================================================= */
(function () {
  "use strict";

  const CONFIG = window.KBF_CONFIG || {};
  const LINKS = window.KBF_LINKS || {};
  const I18N = window.KBF_I18N || { defaultLang: "en", languages: [], dictionaries: {} };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

  /** Returns a URL from KBF_LINKS only if it is a valid absolute https URL. */
  const linkFor = (key) => {
    const value = (LINKS[key] || "").trim();
    if (!value) return "";
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch (e) {
      return "";
    }
  };

  const t = (key, fallback) => {
    const lang = document.documentElement.lang || I18N.defaultLang;
    const dict = I18N.dictionaries[lang] || I18N.dictionaries[I18N.defaultLang] || {};
    return dict[key] || fallback;
  };

  const ACCENTS = ["var(--c-pink)", "var(--c-yellow)", "var(--c-teal)", "var(--c-orange)", "var(--c-green-light)"];

  /** Markup for an image slot: a real <img> if a source is given, otherwise a placeholder. */
  const mediaMarkup = ({ image, alt, label, size, ratio, position, extraClass = "" }) => {
    if (image) {
      const pos = position ? ` style="object-position: ${esc(position)}"` : "";
      return `<div class="media ${extraClass}" style="--ratio: ${ratio}"><img src="${esc(image)}" alt="${esc(alt)}" loading="lazy"${pos}></div>`;
    }
    return `<div class="media ${extraClass}" style="--ratio: ${ratio}" data-ph="${esc(label)}" data-size="${esc(size)}" role="img" aria-label="Image placeholder: ${esc(label)}"></div>`;
  };

  /* -----------------------------------------------------------------------
     Simple data bindings: <span data-bind="festival.dateLong">
     ----------------------------------------------------------------------- */
  function applyBindings() {
    $$("[data-bind]").forEach((el) => {
      const value = get(CONFIG, el.dataset.bind);
      if (value) el.textContent = value;
    });
  }

  /* -----------------------------------------------------------------------
     External links & Google Forms
     - [data-form="KEY"]  → application buttons; "Applications coming soon" if empty
     - [data-link="KEY"]  → other external links (Instagram, maps …)
     ----------------------------------------------------------------------- */
  function markExternal(el, url) {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    if (!el.querySelector(".visually-hidden.ext-note")) {
      el.insertAdjacentHTML("beforeend", '<span class="visually-hidden ext-note"> (opens in a new tab)</span>');
    }
  }

  function setupExternalLinks() {
    $$("[data-form]").forEach((el) => {
      const url = linkFor(el.dataset.form);
      if (url) {
        markExternal(el, url);
        el.dataset.external = "true";
      } else {
        const label = el.textContent.trim();
        el.removeAttribute("href");
        el.setAttribute("role", "link");
        el.setAttribute("aria-disabled", "true");
        el.classList.add("is-soon");
        const soon = el.dataset.soonLabel || t("forms.soon", "Applications coming soon");
        el.innerHTML = `<span>${esc(label)}</span><span class="btn__soon">${esc(soon)}</span>`;
      }
    });

    // Email links: open the visitor's mail app (address only printed if allowed in config)
    const c = CONFIG.contact || {};
    $$("[data-mail]").forEach((el) => {
      if (!c.enquiryEmail) return;
      el.href = `mailto:${c.enquiryEmail}?subject=${encodeURIComponent("[#KBF27] Enquiry")}`;
      if (c.showEmailAddress && !el.classList.contains("icon-link")) el.textContent = c.enquiryEmail;
    });
    if (!c.enquiryEmail) $$("[data-mail-block]").forEach((el) => (el.hidden = true));

    $$("[data-link]").forEach((el) => {
      const url = linkFor(el.dataset.link);
      if (url) {
        markExternal(el, url);
      } else if (el.dataset.soon !== undefined) {
        // No URL configured: render as plain text, never a broken link.
        const span = document.createElement("span");
        span.className = el.className;
        span.textContent = el.dataset.soon || el.textContent;
        el.replaceWith(span);
      }
    });

    $$("[data-link-note]").forEach((el) => {
      el.hidden = Boolean(linkFor(el.dataset.linkNote));
    });
  }

  /* -----------------------------------------------------------------------
     Language selector (only languages with status "available" can be chosen)
     ----------------------------------------------------------------------- */
  function applyTranslations(lang) {
    const dict = I18N.dictionaries[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value) el.textContent = value;
    });
  }

  function setupLanguage() {
    const wrap = $("#lang");
    if (!wrap) return;
    const toggle = $(".lang__toggle", wrap);
    const menu = $(".lang__menu", wrap);
    const current = $(".lang__current", wrap);

    let saved = I18N.defaultLang;
    try { saved = localStorage.getItem("kbf-lang") || I18N.defaultLang; } catch (e) { /* storage unavailable */ }
    const isAvailable = (code) => I18N.languages.some((l) => l.code === code && l.status === "available" && I18N.dictionaries[code]);
    let active = isAvailable(saved) ? saved : I18N.defaultLang;

    const render = () => {
      menu.innerHTML = I18N.languages
        .map((l) => {
          const available = l.status === "available" && I18N.dictionaries[l.code];
          return `<li role="none"><button type="button" class="lang__option" role="menuitem" lang="${l.code}" data-lang="${l.code}"
            ${available ? "" : 'aria-disabled="true"'} ${l.code === active ? 'aria-current="true"' : ""}>
            <span>${esc(l.label)}</span>${available ? (l.code === active ? "<small>✓</small>" : "") : `<small>${esc(t("lang.soon", "coming soon"))}</small>`}
          </button></li>`;
        })
        .join("");
      const activeLang = I18N.languages.find((l) => l.code === active);
      current.textContent = activeLang ? activeLang.short : active.toUpperCase();
    };

    const open = () => { menu.hidden = false; toggle.setAttribute("aria-expanded", "true"); const first = $(".lang__option", menu); first && first.focus(); };
    const close = (focusToggle) => { menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); if (focusToggle) toggle.focus(); };

    toggle.addEventListener("click", () => (menu.hidden ? open() : close()));
    menu.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang__option");
      if (!btn || btn.getAttribute("aria-disabled") === "true") return;
      active = btn.dataset.lang;
      try { localStorage.setItem("kbf-lang", active); } catch (err) { /* ignore */ }
      applyTranslations(active);
      render();
      close(true);
    });
    menu.addEventListener("keydown", (e) => {
      const items = $$(".lang__option", menu);
      const i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === "Escape") close(true);
      if (e.key === "Tab") close();
    });
    document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) close(); });

    render();
    if (active !== I18N.defaultLang) applyTranslations(active);
  }

  /* -----------------------------------------------------------------------
     Header: scroll state, mobile navigation, active section
     ----------------------------------------------------------------------- */
  function setupHeader() {
    const header = $("#site-header");
    const toTop = $(".to-top");
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      toTop && toTop.classList.toggle("is-visible", y > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile navigation
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    const mq = window.matchMedia("(max-width: 1180px)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      header.classList.toggle("nav-open", open);
      document.body.classList.toggle("is-locked", open);
      if (open) { const first = $("a", nav); first && first.focus(); }
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a") && mq.matches) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    // Keep keyboard focus inside the open mobile menu
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      const focusables = [toggle, ...$$("a, button", nav)];
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    mq.addEventListener("change", () => setOpen(false));

    // Active link highlighting
    const links = $$(".site-nav__link");
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
            const link = map.get(entry.target.id);
            if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => io.observe(s));
    }
  }

  /* -----------------------------------------------------------------------
     Countdown – target interpreted in the festival time zone (Europe/Zurich)
     ----------------------------------------------------------------------- */
  function zonedTimeToUtc({ year, month, day, hour, minute }, timeZone) {
    const naive = Date.UTC(year, month - 1, day, hour, minute);
    const offsetAt = (ts) => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
      }).formatToParts(new Date(ts));
      const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
      const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
      return asUtc - ts;
    };
    let ts = naive - offsetAt(naive);
    ts = naive - offsetAt(ts); // second pass handles DST edges
    return ts;
  }

  function setupCountdown() {
    const root = $("#countdown");
    if (!root || !CONFIG.festival) return;
    let target;
    try {
      target = zonedTimeToUtc(CONFIG.festival.countdownTarget, CONFIG.festival.timezone || "Europe/Zurich");
    } catch (e) {
      target = Date.UTC(2027, 7, 21, 12, 0); // 14:00 CEST fallback
    }
    const els = {
      days: $('[data-unit="days"]', root), hours: $('[data-unit="hours"]', root),
      minutes: $('[data-unit="minutes"]', root), seconds: $('[data-unit="seconds"]', root),
    };
    const pad = (n) => String(n).padStart(2, "0");
    const units = $(".countdown__units", root);
    let timer;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        units.hidden = true;
        $(".countdown__done", root).hidden = false;
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      els.days.textContent = Math.floor(s / 86400);
      els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      els.seconds.textContent = pad(s % 60);
      units.setAttribute("aria-label", `${els.days.textContent} days, ${els.hours.textContent} hours and ${els.minutes.textContent} minutes to go`);
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* -----------------------------------------------------------------------
     Content rendering from config
     ----------------------------------------------------------------------- */
  function renderLineup() {
    const grid = $("#lineup-grid");
    if (!grid) return;
    const artists = CONFIG.artists || [];
    grid.innerHTML = artists
      .map((a, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        const n = String(i + 1).padStart(2, "0");
        return `<article class="artist-card reveal" style="--accent: ${accent}">
          ${CONFIG.lineupAnnounced || a.announced ? "" : '<span class="tag artist-card__badge">Coming soon</span>'}
          ${mediaMarkup({ image: a.image, alt: a.imageAlt || a.name, position: a.imagePosition, label: `Artist portrait ${n}`, size: "1200 × 1500 px · 4:5", ratio: "4 / 5" })}
          <div class="artist-card__body">
            <h3 class="artist-card__name ${a.name ? "" : "is-tba"}">${esc(a.name || `Artist ${n} – TBA`)}</h3>
            <p class="artist-card__meta"><span>${esc(a.genre || "Genre TBA")}</span>${a.origin || !a.announced ? `<span>${esc(a.origin || "Background TBA")}</span>` : ""}</p>
            <p class="artist-card__bio">${esc(a.bio || "Biography coming soon.")}</p>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderGenres() {
    const grid = $("#genre-grid");
    const ticker = $("#sound-ticker");
    const genres = CONFIG.genres || [];
    if (grid) {
      grid.innerHTML = genres
        .map((g, i) => `<article class="genre reveal" style="--accent: ${ACCENTS[i % 4]}; --tilt: ${i % 2 ? 1.2 : -1.2}deg">
            <h3 class="genre__name">${esc(g.name)}</h3>
            <p class="genre__origin">${esc(g.origin)}</p>
            <p class="genre__vibe">${esc(g.vibe)}</p>
          </article>`)
        .join("");
    }
    if (ticker) {
      const row = genres.filter((g) => !g.name.startsWith("&")).map((g) => `<span>${esc(g.name)}</span><span class="ticker__dot"></span>`).join("");
      ticker.innerHTML = row + row; // duplicated for a seamless loop
    }
  }

  function renderProgramme() {
    const body = $("#programme-body");
    if (!body) return;
    const items = CONFIG.programme || [];
    if (items.length) {
      body.innerHTML = `<ol class="programme-list">${items
        .map((p) => `<li><time>${esc(p.time)}</time><div><strong>${esc(p.title)}</strong>${p.note ? `<br><span>${esc(p.note)}</span>` : ""}</div></li>`)
        .join("")}</ol>`;
      return;
    }
    const widths = ["72%", "55%", "84%", "64%", "46%"];
    body.innerHTML = `<div class="programme-empty">
      <div class="programme-empty__text">
        <p><strong>Programme coming soon.</strong></p>
        <p>The running order, DJ sets and activities will be published once the line-up is confirmed. The festival is planned to open at ${esc(CONFIG.festival?.startTime || "14:00")}.</p>
      </div>
      <div class="programme-skeleton" aria-hidden="true">
        ${widths.map((w) => `<div class="programme-skeleton__row"><span class="programme-skeleton__time">TBA</span><span class="programme-skeleton__bar" style="--w:${w}"></span></div>`).join("")}
      </div>
    </div>`;
  }

  function renderVendors(listId, items, kind) {
    const grid = document.getElementById(listId);
    if (!grid) return;
    const isFood = kind === "food";
    grid.innerHTML = (items || [])
      .map((v, i) => `<article class="vendor-card reveal">
          ${mediaMarkup({ image: v.image, alt: v.imageAlt || v.name, position: v.imagePosition, label: v.imageLabel || (isFood ? `Food vendor ${i + 1}` : `Market vendor ${i + 1}`), size: "1200 × 800 px · 3:2", ratio: "3 / 2" })}
          <div class="vendor-card__body">
            <p class="vendor-card__type">${esc(v.specialty || (isFood ? "Food vendor" : "Market vendor"))}</p>
            <h4 class="vendor-card__name">${esc(v.name || "To be announced")}</h4>
            <p>${esc(v.description || (isFood ? "Caribbean and international specialities – vendor selection in progress." : "Caribbean-inspired products, merchandise and souvenirs – selection in progress."))}</p>
          </div>
        </article>`)
      .join("");
  }

  function renderPartners(listId, items, label) {
    const grid = document.getElementById(listId);
    if (!grid) return;
    grid.innerHTML = (items || [])
      .map((p, i) => {
        const media = p.logo
          ? `<div class="media logo-slot" style="--ratio: 5 / 2"><img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy" style="object-fit: contain; padding: 1rem"></div>`
          : `<div class="media logo-slot" style="--ratio: 5 / 2" data-ph="${esc(label)} logo ${i + 1}" data-size="500 × 200 px · SVG/PNG" role="img" aria-label="Logo placeholder: ${esc(label)} ${i + 1}"></div>`;
        return p.url && p.logo ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${media}</a>` : media;
      })
      .join("");
  }

  function renderFaq() {
    const list = $("#faq-list");
    if (!list) return;
    list.innerHTML = (CONFIG.faq || [])
      .map((item, i) => `<div class="accordion__item reveal">
          <h3 class="accordion__heading">
            <button class="accordion__trigger" type="button" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
              <span>${esc(item.q)}</span>
              <span class="accordion__icon" aria-hidden="true"><svg class="icon icon--sm"><use href="#i-plus"/></svg></span>
            </button>
          </h3>
          <div class="accordion__panel" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" inert>
            <div><div class="accordion__content">${item.a /* trusted HTML from config */}</div></div>
          </div>
        </div>`)
      .join("");

    const setItem = (item, open) => {
      const btn = $(".accordion__trigger", item);
      const panel = $(".accordion__panel", item);
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      panel.inert = !open;
    };
    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".accordion__trigger");
      if (!btn) return;
      const item = btn.closest(".accordion__item");
      setItem(item, !item.classList.contains("is-open"));
    });
    // Arrow-key navigation between questions
    list.addEventListener("keydown", (e) => {
      const triggers = $$(".accordion__trigger", list);
      const i = triggers.indexOf(document.activeElement);
      if (i < 0) return;
      const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: triggers.length - 1 }[e.key];
      if (go === undefined) return;
      e.preventDefault();
      triggers[(go + triggers.length) % triggers.length].focus();
    });
    $$("[data-faq]").forEach((btn) =>
      btn.addEventListener("click", () => $$(".accordion__item", list).forEach((it) => setItem(it, btn.dataset.faq === "expand")))
    );
  }

  function renderContact() {
    const c = CONFIG.contact || {};
    const list = $("#contact-list");
    const footer = $("#footer-contact");
    const instagram = linkFor("INSTAGRAM_URL");
    const igMarkup = instagram
      ? `<a href="${esc(instagram)}" target="_blank" rel="noopener noreferrer">${esc(c.instagramLabel)}<span class="visually-hidden"> (opens in a new tab)</span></a>`
      : `${esc(c.instagramLabel || "Kreyol Bashment")} <small>(link coming soon)</small>`;
    const phoneLink = c.showPhone && c.phone
      ? `<a href="tel:${esc(c.phone.replace(/\s+/g, ""))}">${esc(c.phone)}</a>`
      : "";

    if (list) {
      const rows = [
        ["Project", esc(c.project)],
        ["Location", esc(c.location)],
      ];
      if (phoneLink) rows.push(["Telephone", phoneLink]);
      rows.push(["Instagram", igMarkup]);
      list.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    }
    if (footer) {
      footer.innerHTML = (phoneLink ? `<li>${phoneLink}</li>` : "") + `<li>${esc(c.location)}</li>`;
    }

    const icons = $("#contact-icons");
    if (icons) {
      const item = (href, icon, label, external) =>
        `<li><a class="icon-link" href="${esc(href)}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${esc(label)}${external ? " (opens in a new tab)" : ""}">
          <svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg></a></li>`;
      icons.innerHTML =
        (instagram ? item(instagram, "i-instagram", `Instagram ${c.instagramLabel}`, true) : "") +
        (c.enquiryEmail ? item(`mailto:${c.enquiryEmail}?subject=${encodeURIComponent("[#KBF27] Enquiry")}`, "i-mail", "Send us an email") : "") +
        (c.showPhone && c.phone ? item(`tel:${c.phone.replace(/\s+/g, "")}`, "i-phone", `Call ${c.phone}`) : "");
    }
  }

  /* -----------------------------------------------------------------------
     Form validation (newsletter + contact). Nothing is sent by this site.
     ----------------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    const errorEl = document.getElementById(field.getAttribute("aria-describedby") || "");
    let msg = "";
    if (field.type === "checkbox") {
      if (field.required && !field.checked) msg = "Please confirm to continue.";
    } else {
      const v = field.value.trim();
      if (field.required && !v) msg = "This field is required.";
      else if (field.type === "email" && v && !EMAIL_RE.test(v)) msg = "Please enter a valid email address.";
      else if (field.minLength > 0 && v.length < field.minLength) msg = `Please write at least ${field.minLength} characters.`;
    }
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errorEl && errorEl.classList.contains("field__error")) errorEl.textContent = msg;
    return !msg;
  }

  function validateForm(form) {
    const fields = $$("input, select, textarea", form).filter((f) => f.required);
    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length) invalid[0].focus();
    return invalid.length === 0;
  }

  function setupForms() {
    $$("form[novalidate]").forEach((form) => {
      $$("input, select, textarea", form).forEach((f) => {
        f.addEventListener("blur", () => f.required && f.getAttribute("aria-invalid") !== null && validateField(f));
        f.addEventListener("input", () => f.getAttribute("aria-invalid") === "true" && validateField(f));
        f.addEventListener("change", () => f.getAttribute("aria-invalid") === "true" && validateField(f));
      });
    });

    const status = (form, text) => {
      const el = $(".form__status", form);
      el.textContent = text;
      el.classList.add("is-info");
    };

    const newsletter = $("#newsletter-form");
    if (newsletter) {
      newsletter.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm(newsletter)) return;
        const url = linkFor("NEWSLETTER_FORM_URL");
        if (url) {
          window.open(url, "_blank", "noopener");
          status(newsletter, "We opened the newsletter sign-up form in a new tab. Your sign-up is only complete once you submit that form.");
        } else {
          status(newsletter, "Newsletter sign-up is not active yet – nothing has been sent or saved. Please check back soon.");
        }
      });
    }

    const contact = $("#contact-form");
    if (contact) {
      contact.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm(contact)) return;
        const c = CONFIG.contact || {};
        if (!c.enquiryEmail) {
          status(contact, "Online enquiries will be available soon – nothing has been sent. Please reach us by phone or on Instagram.");
          return;
        }
        const data = new FormData(contact);
        const select = $("#c-category", contact);
        const category = select.options[select.selectedIndex].text;
        const subject = `[#KBF27] ${category} – ${data.get("name")}`;
        const body = `${data.get("message")}\n\n—\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nCategory: ${category}`;
        window.location.href = `mailto:${c.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status(contact, "Your email app should now open with your message pre-filled. Please review and send it from there – this website has not sent anything.");
      });
    }
  }

  /* -----------------------------------------------------------------------
     Scroll reveal
     ----------------------------------------------------------------------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
      io.observe(el);
    });
  }

  /* -----------------------------------------------------------------------
     Init
     ----------------------------------------------------------------------- */
  function init() {
    applyBindings();
    renderGenres();
    renderLineup();
    renderProgramme();
    renderVendors("vendors-food", CONFIG.vendors?.food, "food");
    renderVendors("vendors-market", CONFIG.vendors?.market, "market");
    renderPartners("partners-supporting", CONFIG.partners?.supporting, "Partner");
    renderPartners("partners-sponsors", CONFIG.partners?.sponsors, "Sponsor");
    renderFaq();
    renderContact();
    setupLanguage();
    setupExternalLinks();
    setupHeader();
    setupCountdown();
    setupForms();
    setupReveal();
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
