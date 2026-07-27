# Photo brief — MM Transports website

Every photo on the site is currently a **stock placeholder** (generic foreign trucks from Unsplash).
Replacing them with real MM Transports photos is the single biggest credibility upgrade available,
and it costs nothing but an hour at the yard.

A good phone camera in morning light beats polished stock, because the whole point is that these are
*your* trucks.

## How to swap a photo in

Every slot is marked in the HTML with a comment and a `data-photo-slot` attribute. To find them all:

```bash
grep -rn "data-photo-slot" *.html
```

1. Save the image into a new `images/` folder in the project root, using the filename below.
2. Change the `src="https://images.unsplash.com/..."` to `src="images/<filename>"`.
3. Update the `alt` text to describe the real photo.
4. Delete the `<p class="media-caption">Photo needed…</p>` line where one is present.

---

## Priority 1 — the three that matter most

### 1. `hero-fleet.jpg` — homepage hero background
**Slot:** `index.html`, `data-photo-slot="hero-fleet"`
**Size:** 1920 × 1080 minimum, landscape

Several MM trucks together — lined up in the yard, or one shot from a low angle so it looks big.
Shoot early morning or late afternoon; harsh midday sun flattens everything. The left half of this
image sits under a dark navy overlay with the headline on top, so **keep the interesting content on
the right side** of the frame. The MM Transports name on the truck should be readable.

### 2. `father-son.jpg` — "Two generations" section
**Slot:** `index.html`, `data-photo-slot="father-son"`
**Size:** 1200 × 900, landscape

**This is the most valuable photograph on the entire site.** Manoharan Nagarajan and M Vishnu Prasad
together, in front of a truck or at the yard gate. Standing, relaxed, looking at the camera. Not a
formal studio portrait — the point is to show two real people in the place where the work happens.
No competitor and no aggregator can copy this.

### 3. `fleet-yard.jpg` — homepage fleet section
**Slot:** `index.html`, `data-photo-slot="fleet-yard"`
**Size:** 1200 × 900, landscape

The yard with trucks parked in a row. Wide enough to convey scale. Fifteen trucks looks like a real
operation when you can see them together.

---

## Priority 2 — About page

### 4. `yard-wide.jpg` — About page story section
**Slot:** `about.html`, `data-photo-slot="yard-wide"`
**Size:** 900 × 1200, **portrait** (this one is a tall frame)

The Willingdon Island office and yard, or a truck being loaded. Vertical composition.

### 5. `manoharan-nagarajan.jpg` — founder portrait
**Slot:** `about.html`, `data-photo-slot="person-manoharan"`
**Size:** 800 × 600, landscape (displays as a 4:3 crop)

Head-and-shoulders or waist-up, at the yard or office rather than a studio. Currently showing the
initials "MN" on a navy tile, which works but is obviously a placeholder.

Replace the whole inner `<div class="person-photo">` content with:
```html
<img src="images/manoharan-nagarajan.jpg" alt="Manoharan Nagarajan, founder of MM Transports" />
```

### 6. `vishnu-prasad.jpg` — operations portrait
**Slot:** `about.html`, `data-photo-slot="person-vishnu"`
**Size:** 800 × 600, landscape

Same treatment as above. Replace the `VP` initials tile the same way.

---

## Priority 3 — social sharing

### 7. `og-cover.jpg` — WhatsApp / social preview card
**Referenced by:** all four pages, in the `og:image` meta tag
**Size:** 1200 × 630 exactly

This is the image that appears when someone shares a link to the site **on WhatsApp** — which in
Kerala B2B is how most links actually travel. Right now the file does not exist, so shares render as
a plain grey box.

Best option: a wide shot of the fleet with the MM Transports name clearly visible. Keep any text well
inside the frame, since WhatsApp crops the edges on some devices.

---

## Shot list to hand to whoever takes the photos

Ask for these in one visit:

- [ ] Wide shot of several trucks in the yard (multiple angles)
- [ ] One truck three-quarter view, low angle, MM branding readable
- [ ] Manoharan Nagarajan and M Vishnu Prasad together
- [ ] Each of them individually
- [ ] A container being loaded or secured
- [ ] The office exterior at CDEA Building
- [ ] A driver with his truck — with his permission
- [ ] Trucks at or near the port gate, if permitted

**Practical notes:** shoot landscape (horizontal) unless the slot says portrait; clean the trucks
first; avoid photographing number plates you would rather not publish; morning light around
8–10 am is ideal. Send originals, not WhatsApp-compressed copies — WhatsApp destroys image quality,
which defeats the purpose.

## Before going live

Compress everything through [squoosh.app](https://squoosh.app) or similar. Target under 300 KB per
image, WebP if possible with a JPEG fallback. Large unoptimised photos will undo the page-speed work
and hurt the Google ranking these changes are meant to improve.
