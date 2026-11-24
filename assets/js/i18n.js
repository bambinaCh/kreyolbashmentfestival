/* =========================================================================
   KBF – Translation architecture
   -------------------------------------------------------------------------
   English is the source language and is written directly in index.html.
   Elements carrying `data-i18n="key"` can be translated by adding a
   dictionary for another language below.

   To add a language (e.g. German):
     1. Copy the `en` dictionary, rename it to `de` and translate the values.
     2. Set `status: "available"` for "de" in `languages`.
   The language selector will then enable it automatically. Languages with
   status "planned" are shown as "coming soon" and cannot be selected –
   the site never pretends a translation exists when it does not.

   For long-form content (FAQ, vendor texts …) a per-language copy of
   config.js can be introduced later, or the site can be moved to a static
   site generator with one folder per language (/de/, /fr/ …).
   ========================================================================= */

window.KBF_I18N = {
  defaultLang: "en",

  languages: [
    { code: "en", label: "English", short: "EN", status: "available" },
    { code: "de", label: "Deutsch", short: "DE", status: "planned" },
    { code: "fr", label: "Français", short: "FR", status: "planned" },
    { code: "es", label: "Español", short: "ES", status: "planned" },
    { code: "ht", label: "Kreyòl ayisyen", short: "HT", status: "planned" },
  ],

  dictionaries: {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.lineup": "Line-up",
      "nav.food": "Food & Market",
      "nav.visitor": "Visitor Info",
      "nav.involved": "Get Involved",
      "nav.partners": "Partners",
      "nav.contact": "Contact",
      "nav.cta": "Festival info",
      "nav.volunteer": "Volunteer",
      "forms.soon": "Applications coming soon",
      "lang.label": "Language",
      "lang.soon": "coming soon",

      "hero.headline": "Caribbean roots. Zürich vibes.",
      "hero.lead": "A celebration of Caribbean music, food, culture and community in the heart of Zürich.",
      "hero.cta1": "Discover the Festival",
      "hero.cta2": "Get Involved",
      "countdown.label": "Countdown to the festival",

      "about.title": "More than a festival. A celebration of who we are.",
      "experience.title": "Music. Food. Culture. Community.",
      "lineup.title": "2027 Line-up — Coming soon",
      "food.title": "Discover the flavours of the Caribbean.",
      "location.title": "From the islands to the lakeside.",
      "visitor.title": "Plan your visit.",
      "faq.title": "Frequently asked questions",
      "involved.title": "Be part of the movement.",
      "community.title": "Different roots. Shared rhythms.",
      "partners.title": "Partners & sponsors",
      "gallery.title": "Visual preview",
      "connect.title": "Stay connected.",
      "contact.title": "Get in touch.",
    },
    /* de: { … }, fr: { … }, es: { … }, ht: { … } */
  },
};
