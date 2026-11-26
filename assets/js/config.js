/* =========================================================================
   KBF – Festival content configuration
   -------------------------------------------------------------------------
   Edit this file to update festival facts, artists, vendors, partners,
   FAQ answers and contact details. Everything rendered dynamically on the
   page is read from here – no HTML changes needed.

   Conventions
   - Leave a text field empty ("") to show "To be announced".
   - Leave `image` empty to show a neutral image placeholder.
     To use a real image, set e.g. image: "assets/img/artists/dj-name.jpg"
     and add a meaningful `imageAlt`.
   - Nothing here is official until confirmed by the organisers.
   ========================================================================= */

/* =========================================================================
   EXTERNAL LINKS – the single place for every external URL on the site.
   -------------------------------------------------------------------------
   Paste the public Google Forms links ("Send" → link icon, e.g.
   https://forms.gle/… or https://docs.google.com/forms/d/e/…/viewform).
   While a value is empty, every related button shows "Applications coming
   soon" instead of opening a broken link. Never commit editing links
   (…/edit) – only the public viewform / forms.gle link.
   ========================================================================= */
window.KBF_LINKS = {
  VOLUNTEER_FORM_URL: "",
  FOOD_VENDOR_FORM_URL: "",
  MARKET_VENDOR_FORM_URL: "",
  ARTIST_FORM_URL: "",
  SPONSORSHIP_FORM_URL: "",
  /* Optional: an external newsletter sign-up page (e.g. a Google Form). */
  NEWSLETTER_FORM_URL: "",
  INSTAGRAM_URL: "https://www.instagram.com/kreyol_bashment/",
  /* Music: a public Spotify / SoundCloud / YouTube playlist and a teaser video link. */
  PLAYLIST_URL: "",
  TEASER_VIDEO_URL: "",
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/search/?api=1&query=GZ%20Wollishofen%2C%20Bachstrasse%207%2C%208038%20Z%C3%BCrich",
  TIMETABLE_URL: "https://www.sbb.ch/en",
};

window.KBF_CONFIG = {
  festival: {
    name: "Kreyol Bashment Festival – Caribbean Fever",
    shortName: "KBF",
    hashtag: "#KBF27",
    organiser: "Kreyol Bashment Entertainment",
    edition: 2027,
    dateLong: "Saturday, 21 August 2027",
    dateShort: "21.08.2027",
    startTime: "14:00",
    endTime: "02:00",
    endTimeNote: "the following morning – provisional, subject to final approval",
    /* Countdown target – local festival time, interpreted in `timezone`. */
    countdownTarget: { year: 2027, month: 8, day: 21, hour: 14, minute: 0 },
    timezone: "Europe/Zurich",
    admission: "Free entry planned",
    format: "Family-friendly outdoor Caribbean cultural and community festival",
  },

  venue: {
    name: "GZ Wollishofen",
    street: "Bachstrasse 7",
    postcode: "8038",
    city: "Zürich",
    country: "Switzerland",
    /* Map + timetable links live in KBF_LINKS above. */
  },

  /* -----------------------------------------------------------------------
     CONTACT – the "Get in touch" list shows only: project, location,
     telephone and Instagram. Set `showPhone: false` to hide the number.
     `enquiryEmail` is NOT displayed on the page; it is only used as the
     recipient when the enquiry form opens the visitor's email app
     (the visitor will see it there). Leave it empty to disable that.
     ----------------------------------------------------------------------- */
  contact: {
    showPhone: true,
    project: "Kreyol Bashment Festival – Caribbean Fever",
    location: "Zürich, Switzerland",
    enquiryEmail: "kendyfelizmatos@gmail.com",
    /* false = email icons say "Write to us" without printing the address */
    showEmailAddress: false,
    phone: "+41 79 456 74 00",
    instagramLabel: "@kreyol_bashment",
    /* Profile URL: set INSTAGRAM_URL in KBF_LINKS above. */
  },


  /* -----------------------------------------------------------------------
     THE SOUND – genre tiles. Illustrative, not a confirmed programme.
     ----------------------------------------------------------------------- */
  genres: [
    { name: "Soca", origin: "Trinidad & Tobago", vibe: "Carnival energy, non-stop jump and wave." },
    { name: "Bouyon", origin: "Dominica", vibe: "Fast, raw and made for the dance floor." },
    { name: "Kompa", origin: "Haiti", vibe: "Smooth, rolling rhythm for dancing close." },
    { name: "Zouk", origin: "Guadeloupe & Martinique", vibe: "The heartbeat of the French Antilles." },
    { name: "Dancehall", origin: "Jamaica", vibe: "Sound-system culture and big riddims." },
    { name: "Reggae", origin: "Jamaica", vibe: "Roots, rhythm and a message." },
    { name: "Calypso", origin: "Trinidad & Tobago", vibe: "Storytelling with a smile." },
    { name: "Salsa", origin: "Cuba & Puerto Rico", vibe: "Brass, clave and quick feet." },
    { name: "Bachata", origin: "Dominican Republic", vibe: "Guitar-led romance with a sway." },
    { name: "Merengue", origin: "Dominican Republic", vibe: "Up-tempo, joyful and impossible to resist." },
    { name: "Reggaetón", origin: "Puerto Rico", vibe: "Dembow beats that move every crowd." },
    { name: "& more", origin: "All the islands", vibe: "Gwoka, steelpan, chutney soca – and surprises." },
  ],

  /* -----------------------------------------------------------------------
     LINE-UP – add as many entries as needed; the grid grows automatically.
     ----------------------------------------------------------------------- */
  lineupAnnounced: false,
  /* Per artist: set announced: true to drop the "Coming soon" badge on that card.
     imagePosition moves the crop (e.g. "50% 15%" keeps a face near the top). */
  artists: [
    {
      name: "DJ Lagwada",
      genre: "",
      origin: "",
      bio: "",
      image: "assets/img/artists/lagwada.jpg",
      imageAlt: "Portrait of DJ Lagwada with red curly hair in a denim jacket",
      imagePosition: "50% 15%",
      announced: true,
    },
    { name: "", genre: "", origin: "", bio: "", image: "", imageAlt: "" },
    { name: "", genre: "", origin: "", bio: "", image: "", imageAlt: "" },
    { name: "", genre: "", origin: "", bio: "", image: "", imageAlt: "" },
    { name: "", genre: "", origin: "", bio: "", image: "", imageAlt: "" },
  ],

  /* PROGRAMME – leave empty to show "Programme coming soon".
     Example entry once confirmed: { time: "15:00", title: "…", note: "…" } */
  programme: [],

  /* -----------------------------------------------------------------------
     VENDORS – selection not final. Placeholders only.
     ----------------------------------------------------------------------- */
  vendors: {
    food: [
      { name: "", specialty: "", description: "", image: "", imageAlt: "" },
      { name: "", specialty: "", description: "", image: "", imageAlt: "" },
      { name: "", specialty: "", description: "", image: "", imageAlt: "" },
    ],
    market: [
      { name: "", specialty: "", description: "", image: "", imageAlt: "" },
      { name: "", specialty: "", description: "", image: "", imageAlt: "" },
    ],
  },

  /* -----------------------------------------------------------------------
     PARTNERS – the venue cooperation is planned; everything else is open.
     ----------------------------------------------------------------------- */
  partners: {
    supporting: [
      { name: "", url: "", logo: "" },
      { name: "", url: "", logo: "" },
      { name: "", url: "", logo: "" },
    ],
    sponsors: [
      { name: "", url: "", logo: "" },
      { name: "", url: "", logo: "" },
      { name: "", url: "", logo: "" },
      { name: "", url: "", logo: "" },
    ],
  },

  /* -----------------------------------------------------------------------
     FAQ – answers only use information available today.
     Simple HTML (links, <strong>) is allowed in answers.
     ----------------------------------------------------------------------- */
  faq: [
    {
      q: "When does KBF 2027 take place?",
      a: "KBF 2027 is planned for <strong>Saturday, 21 August 2027</strong>, starting at <strong>14:00</strong>. The planned end is 02:00 the following morning – this end time is provisional and subject to final approval.",
    },
    {
      q: "Where is the festival?",
      a: "At <strong>GZ Wollishofen</strong>, Bachstrasse 7, 8038 Zürich. The festival is planned primarily in the outdoor area of the community centre.",
    },
    {
      q: "Is entry free?",
      a: "Free entry is currently planned. Should anything change, we will announce it here and on our channels well in advance.",
    },
    {
      q: "Is the festival suitable for children?",
      a: "Yes. KBF is conceived as a family-friendly festival where children, parents and grandparents are just as welcome as groups of friends. Details on family-specific activities will be announced closer to the festival.",
    },
    {
      q: "What kind of music can I expect?",
      a: "Caribbean sounds from Spanish-speaking, French-speaking, English-speaking and Creole-speaking regions. The current concept includes around four to five DJs, and styles could include dancehall, soca, reggae, zouk, kompa, bouyon, salsa, bachata, merengue, reggaetón and more. The programme has not yet been confirmed.",
    },
    {
      q: "Can I wear a carnival outfit and bring my flag?",
      a: "Yes, please! We encourage carnival outfits, island colours and cool looks – and every Caribbean flag is welcome. Keep it family-friendly and wear comfortable shoes. Share your look with <strong>#KBF27</strong>. Any site rules (for example on flag poles) will be shared closer to the festival.",
    },
    {
      q: "Will there be food and drinks?",
      a: "Yes – an outdoor food area with independent vendors and a festival bar are planned, including non-alcoholic options. The vendor selection and drinks offering will be announced closer to the festival.",
    },
    {
      q: "How can I get to the festival?",
      a: "We strongly recommend travelling by public transport. Parking is not permitted on the festival premises. Detailed travel information will be published closer to the festival; in the meantime you can plan your journey with the official <a href=\"https://www.sbb.ch/en\" target=\"_blank\" rel=\"noopener\">SBB timetable</a>.",
    },
    {
      q: "Is the festival accessible?",
      a: "We want KBF to be open to as many people as possible. Current plans include mobile toilets with an accessible toilet. Detailed accessibility information will be published closer to the festival. If you have specific needs, please <a href=\"#contact\">contact us</a> – we are happy to help.",
    },
    {
      q: "What happens if it rains?",
      a: "KBF is planned as an outdoor festival. Information on weather arrangements will be announced closer to the festival – please check this website before your visit.",
    },
    {
      q: "When will the line-up be announced?",
      a: "The line-up will be announced on this website and on Instagram at <a href=\"https://www.instagram.com/kreyol_bashment/\" target=\"_blank\" rel=\"noopener\">@kreyol_bashment</a> in the run-up to the festival. Sign up for updates in the <a href=\"#stay-connected\">Stay Connected</a> section.",
    },
    {
      q: "Can I apply as a food vendor?",
      a: "Yes. Food businesses, Caribbean cuisine providers and market vendors are welcome to express their interest via the <a href=\"#vendors-apply\">vendor applications</a> (food and market). We encourage as many businesses as possible to apply so we can put together a diverse selection. Applying is free and non-binding and is not a confirmation of a stall – the selection is not yet final.",
    },
    {
      q: "Can I participate as a DJ or artist?",
      a: "Yes. DJs, musicians, performers and creatives can get in touch via the <a href=\"#get-involved\">DJ and artist application</a>. Applying is not a booking or confirmation of a performance.",
    },
    {
      q: "Can I volunteer?",
      a: "Absolutely – KBF is a community project and volunteers are at its heart. Register your interest via the <a href=\"#volunteer\">volunteer registration</a>. Registering is non-binding; we will contact volunteers once dates and shifts are set.",
    },
    {
      q: "How can I become a sponsor?",
      a: "Businesses, organisations and cultural institutions interested in supporting KBF can reach out via the <a href=\"#partners\">partnership enquiry</a> or through the <a href=\"#contact\">contact section</a>.",
    },
  ],
};
