# Kreyol Bashment Festival – Caribbean Fever (KBF) · #KBF27

The static website for **Kreyol Bashment Festival – Caribbean Fever**, organised by
**Kreyol Bashment Entertainment**. It is a family-friendly outdoor
Caribbean festival in Zürich. Built with plain HTML, CSS and JavaScript: no framework,
no build step, no backend and no database. It is designed to be reused for future
annual editions.

> **Status: in development. Nothing is public yet.** The festival is in planning and the
> site is built to show provisional details as provisional. Search-engine indexing is
> blocked until launch (see [Going public](#going-public)).

---

## Contents

1. [Project structure](#project-structure)
2. [Running the website locally](#running-the-website-locally)
3. [Updating festival information](#updating-festival-information)
4. [Configuring the Google Forms URLs](#configuring-the-google-forms-urls)
5. [Updating social media links](#updating-social-media-links)
6. [Replacing image placeholders](#replacing-image-placeholders)
7. [Adding translations](#adding-translations)
8. [Sharing a preview on GitHub Pages (temporary)](#sharing-a-preview-on-github-pages-temporary)
9. [Deploying to Cloudflare Pages via GitLab](#deploying-to-cloudflare-pages-via-gitlab)
10. [Connecting a custom .ch domain](#connecting-a-custom-ch-domain)
11. [Keeping the website private during development](#keeping-the-website-private-during-development)
12. [Going public](#going-public)
13. [Before publication: checklist](#before-publication-checklist)

---

## Project structure

```
kbf-site/
├── index.html              One-page festival website (all sections)
├── privacy.html            Privacy policy – placeholder structure, NOT legal text
├── legal.html              Legal notice (Impressum) – placeholder structure
├── accessibility.html      Accessibility information
├── 404.html                "Page not found" page (used automatically by Cloudflare Pages)
├── _headers                Cloudflare Pages response headers (security + pre-launch noindex)
├── robots.txt              Pre-launch: blocks crawlers
├── assets/
│   ├── css/main.css        All styles. Design tokens (colours, fonts, spacing) at the top
│   ├── js/config.js        ★ ALL editable content + ALL external URLs
│   ├── js/i18n.js          Translation setup and language list
│   ├── js/main.js          Behaviour (navigation, countdown, FAQ, forms, rendering)
│   └── img/                Put real images here (see assets/img/README.md for sizes)
└── scripts/serve.mjs       Optional zero-dependency local preview server
```

**You will almost only ever need to edit `assets/js/config.js`.**

---

## Running the website locally

The site is plain static files. Choose one option:

**Option A: open the file directly.** Double-click `index.html`. Everything works,
including the countdown, FAQ and navigation.

**Option B: local server (closest to real hosting).** With [Node.js](https://nodejs.org) installed:

```powershell
node scripts/serve.mjs
```

Then open <http://localhost:8080>. The script has no dependencies and installs nothing.
Any other static server also works (for example the VS Code "Live Server" extension).

---

## Updating festival information

Open **`assets/js/config.js`**. Each block is commented:

| Block | What it controls |
|---|---|
| `festival` | Name, date, start and end times, countdown target, time zone, admission |
| `venue` | Venue name and address |
| `contact` | Get in touch list (project, location, telephone, Instagram). `showPhone: false` hides the number. `enquiryEmail` is not displayed; it is only the recipient used by the enquiry form |
| `lineupAnnounced` / `artists` | Line-up cards. Add or remove entries; the grid adapts automatically |
| `programme` | Running order. Empty means the "Programme coming soon" state is shown |
| `vendors.food` / `vendors.market` | Vendor cards |
| `partners.supporting` / `partners.sponsors` | Logo slots |
| `faq` | Questions and answers (simple HTML such as links is allowed) |

Rules built into the site:

- Empty text fields show **"To be announced"** or a similar wording automatically.
- Empty `image` or `logo` fields show a neutral placeholder.
- Static text that is not in `config.js` (section introductions, visitor info tiles) is edited
  directly in `index.html`. Every section is marked with a large comment banner.

**Example: announcing an artist**

```js
artists: [
  {
    name: "DJ Example",
    genre: "Dancehall · Soca",
    origin: "Martinique / Zürich",
    bio: "Two sentences about the artist.",
    image: "assets/img/artists/dj-example.webp",
    imageAlt: "DJ Example behind the decks",
  },
  // …
],
lineupAnnounced: true,   // removes the "Coming soon" badges
```

**New edition (e.g. 2028):** update `festival` (dates and `countdownTarget`), clear
`artists`, `programme` and `vendors`, and search `index.html` for `2027`.

---

## Configuring the Google Forms URLs

All external links are in **one place**: the `KBF_LINKS` block at the top of
`assets/js/config.js`.

```js
window.KBF_LINKS = {
  VOLUNTEER_FORM_URL: "",
  FOOD_VENDOR_FORM_URL: "",
  MARKET_VENDOR_FORM_URL: "",
  ARTIST_FORM_URL: "",
  SPONSORSHIP_FORM_URL: "",
  NEWSLETTER_FORM_URL: "",   // optional
  INSTAGRAM_URL: "",
  GOOGLE_MAPS_URL: "https://www.google.com/maps/search/?api=1&query=…",
  TIMETABLE_URL: "https://www.sbb.ch/en",
};
```

**How to get the right link from Google Forms**

1. Open the form in Google Forms and click **Send**.
2. Choose the **link** tab (🔗), optionally tick "Shorten URL", and copy it.
   It looks like `https://forms.gle/…` or `https://docs.google.com/forms/d/e/…/viewform`.
3. Paste it between the quotes, save and redeploy (push to `main`).

> Never paste the editing link (`…/edit`). It would give visitors access to edit the form.

**What happens on the site**

| Configured? | Button behaviour |
|---|---|
| Yes (valid `https://` link) | Opens the Google Form in a **new tab** and is announced to screen readers as "opens in a new tab" |
| No (empty or invalid) | Shown as a dashed, inactive button with the label **"Applications coming soon"**, never a broken link |

**Where each link appears**

| Key | Buttons |
|---|---|
| `VOLUNTEER_FORM_URL` | "Join the crew" feature and volunteer card in Get Involved (the header and hero "Volunteer" links jump there) |
| `FOOD_VENDOR_FORM_URL` | Vendor applications block (Food & Market) and vendor card in Get Involved |
| `MARKET_VENDOR_FORM_URL` | Vendor applications block (Food & Market) and vendor card in Get Involved |
| `ARTIST_FORM_URL` | Artist card in Get Involved |
| `SPONSORSHIP_FORM_URL` | Partner card in Get Involved and the partnership banner in Partners |
| `NEWSLETTER_FORM_URL` | Optional. If set, submitting the newsletter box opens this form in a new tab |

**Recommended Google Forms settings**

- Link responses to a Google Sheet (Responses → Link to Sheets), one sheet per form or one
  "pipeline" spreadsheet with a tab per form.
- Turn on email notifications for new responses.
- Include a required consent checkbox, and a confirmation message that makes clear the
  application is **non-binding and not a confirmation of participation**.
- Check insurance cover for volunteers before opening the volunteer form.

To add another form button anywhere in `index.html`:

```html
<a class="btn btn--dark" href="#get-involved" data-form="ARTIST_FORM_URL">Apply as artist</a>
```

---

## Updating social media links

- **Instagram:** `INSTAGRAM_URL` in `KBF_LINKS` is set to `https://www.instagram.com/kreyol_bashment/`.
  If you empty it, the handle is shown as plain text with "link coming soon".
- The display name comes from `contact.instagramLabel`.
- For more channels, add a key to `KBF_LINKS` and use
  `<a href="#" data-link="YOUR_KEY" data-soon="Label">Label</a>` in the HTML.

---

## Replacing image placeholders

Every image slot is a `div.media` carrying a `data-ph` label and the intended size:

```html
<div class="media" style="--ratio: 4 / 5"
     data-ph="Caribbean community" data-size="1200 × 1500 px · 4:5"
     role="img" aria-label="Image placeholder: Caribbean community"></div>
```

To use a real image, put an `<img>` inside the same div and remove the placeholder attributes:

```html
<div class="media" style="--ratio: 4 / 5">
  <img src="assets/img/gallery/community.webp"
       alt="Friends dancing at an outdoor Caribbean party" loading="lazy">
</div>
```

The image fills the frame (`object-fit: cover`), so **the layout never changes**. Keep the
`--ratio` value. The hero background works the same way (`.hero__bg`). The dark overlay
keeps the text readable on any photo.

- Line-up, vendor and partner images: set `image` / `logo` in `config.js` instead.
- Sizes, folders and formats for every slot: **[assets/img/README.md](assets/img/README.md)**.
- Logo in the header and footer: replace the `.media--logo` div with
  `<img src="assets/img/brand/kbf-logo.svg" alt="Kreyol Bashment – Caribbean Fever" height="44">`.
- Social share image: create `assets/img/og/kbf-og-1200x630.jpg` and uncomment the
  `og:image` / `og:url` / `canonical` tags in `index.html` (use the final domain).
- Use the GZ Wollishofen logo only after approval.

---

## Adding translations

English is written directly in the HTML. Elements with `data-i18n="key"` (navigation,
hero, section titles) can be translated:

1. In `assets/js/i18n.js`, copy the `en` dictionary to e.g. `de` and translate it.
2. Set `status: "available"` for that language in `languages`.

Languages with status `planned` (German, French, Spanish, Haitian Creole) appear in the
selector as **"coming soon"** and cannot be selected, so the site never claims a translation
exists when it does not. For full translations of long texts, the recommended next step is
one folder per language (`/de/index.html`, `/fr/index.html` …) with `hreflang` tags.

---

## Sharing a preview on GitHub Pages (temporary)

GitHub Pages is a quick way for partners to see the site before the domain and the final
hosting (Cloudflare Pages) are set up. The site works there as it is.

> **Important before you push:**
> - On the free GitHub plan, Pages only works with a **public repository**. Anyone can then
>   read the code, including the phone number and the enquiry email in
>   `assets/js/config.js`. Private repositories with Pages require a paid GitHub plan.
> - The site itself is public too. Anyone with the link can open it. The `noindex` tags still
>   keep search engines away, but GitHub Pages ignores `_headers`.
> - Never add internal documents (contracts, budgets, safety plans) to the repository.

1. On github.com, create a new repository, e.g. `kbf-site` (no README, no .gitignore).
2. In this folder (skip the first three commands if the repository is already set up locally):

```powershell
git init -b main
```

```powershell
git add .
```

```powershell
git commit -m "KBF website preview"
```

```powershell
git remote add origin https://github.com/<your-user>/kbf-site.git
```

```powershell
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
   branch **`main`**, folder **`/ (root)`** → **Save**.
4. After about a minute the site is live at `https://<your-user>.github.io/kbf-site/`.
   Every push to `main` updates it automatically.

The `.nojekyll` file tells GitHub to serve the files as they are. The 404 page works at both
`user.github.io/repo/` and a root domain.

**Moving to the final hosting later:** the same repository can be connected to Cloudflare
Pages (Cloudflare also supports GitHub, not only GitLab). Then turn off GitHub Pages and
connect the .ch domain in Cloudflare, as described below.

---

## Deploying to Cloudflare Pages via GitLab

No build step is needed: Cloudflare serves the files as they are.

### 1. Create the GitLab repository

1. On gitlab.com, create a new project (for example `kbf-site`). Set visibility to **Private**.
2. In this folder:

```powershell
git init -b main
```

```powershell
git add .
```

```powershell
git commit -m "Initial KBF website"
```

```powershell
git remote add origin https://gitlab.com/<your-group>/kbf-site.git
```

```powershell
git push -u origin main
```

> Keep internal planning documents (contracts, budgets, safety plans) **out of this
> repository**. `.gitignore` already excludes `.docx`, `.pdf`, `.xlsx` and `.zip` files.

### 2. Connect Cloudflare Pages

1. Log in to the Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Choose **GitLab**, authorise Cloudflare and select the `kbf-site` repository.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | *(leave empty)* |
   | Build output directory | `/` |

4. Click **Save and Deploy**. The site is then available at `https://<project>.pages.dev`.

### 3. Automatic deployments

- Every push to **`main`** automatically deploys to production.
- Pushes to other branches create **preview deployments** with their own URL. Use a branch
  such as `preview` to review changes before merging into `main`.
- `_headers` (security headers, pre-launch noindex) and `404.html` are picked up by
  Cloudflare Pages automatically.

---

## Connecting a custom .ch domain

Do this only once the domain has been chosen and registered by the organisers.

1. Register the `.ch` domain with any Swiss registrar (the site does not depend on the registrar).
2. Cloudflare dashboard → your Pages project → **Custom domains** → **Set up a custom domain**.
3. Choose one of these:
   - **Recommended:** add the domain to Cloudflare (Add a site → Free plan) and change the
     domain's **nameservers** at the registrar to the two Cloudflare nameservers shown.
     Then add both `kbf-example.ch` and `www.kbf-example.ch` in Custom domains.
   - **Subdomain only** (keep DNS at the registrar): create a `CNAME` record
     `www → <project>.pages.dev` at the registrar, then add `www.kbf-example.ch` in Custom domains.
4. **HTTPS** certificates are issued and renewed automatically by Cloudflare, usually
   within minutes. In SSL/TLS settings, enable **Always Use HTTPS**.
5. Optional: redirect the apex domain to `www` (or the other way) with a Cloudflare
   Redirect Rule, so there is only one canonical address.
6. Update `canonical`, `og:url` and `og:image` in `index.html` to the final domain.

---

## Keeping the website private during development

Already built in:

- `<meta name="robots" content="noindex, nofollow">` on every page.
- `X-Robots-Tag: noindex, nofollow` in `_headers`.
- `robots.txt` disallows all crawlers.
- Preview deployments (`*.pages.dev`) are always `noindex`.

These measures keep search engines away, but **anyone with the link can still open the
site**. To require a login:

1. Cloudflare dashboard → your Pages project → **Settings** → **General** →
   **Access policy** → *Enable access policy*. This protects preview deployments.
2. To protect production as well (`<project>.pages.dev` and the custom domain), go to
   **Zero Trust** → **Access** → **Applications** → **Add an application** →
   *Self-hosted*. Enter the domain(s) and create a policy such as "Emails ending in …" or
   a list of specific email addresses. Visitors then receive a one-time PIN by email.
   (The Zero Trust free plan covers small teams.)
3. Keep the GitLab repository **Private**.

---

## Going public

When the organisers approve publication (planned communication start: around May 2027):

1. Remove the `<meta name="robots" content="noindex, nofollow">` tag from all HTML files.
2. Delete the `X-Robots-Tag: noindex, nofollow` line under `/*` in `_headers` (keep the
   `pages.dev` rule).
3. Replace `robots.txt` with the "launch" version written in its comments.
4. Remove or adjust the Cloudflare Access policy for production.
5. Set `canonical`, `og:url` and `og:image`.

---

## Before publication: checklist

- [ ] Approval from GZ Wollishofen for the website, the wording about the cooperation and any use of their name or logo
- [ ] Approval for publishing the phone number (or set `showPhone: false`)
- [ ] Privacy policy and legal notice completed and reviewed (they are placeholders now)
- [ ] Google Forms created, consent text included, links added to `KBF_LINKS`
- [ ] Volunteer insurance cover checked before opening the volunteer form
- [ ] Fonts self-hosted, or Google Fonts described in the privacy policy
- [ ] End time, admission and infrastructure statuses updated to match the approvals
- [ ] Real images added (with rights and consent), favicon and share image created
- [ ] Pre-launch noindex removed (see [Going public](#going-public))

---

### Design notes

- Colours, fonts, spacing, radii and motion are CSS custom properties at the top of
  `assets/css/main.css`. Each section sets its colour theme with a `theme-*` class.
- Fonts: **Anton** (display) and **DM Sans** (body) from Google Fonts, with system fallbacks.
- Animations respect the operating system's "reduce motion" setting.
- The site sets no cookies and has no tracking. The chosen language is stored in `localStorage`.
