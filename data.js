// Every project from the original umayair.com, with its own story and palette.
window.PROJECTS = [
  {
    slug: 'submissions', story: 'submissions.html', title: 'Submissions', year: '2020', cat: 'Podcast · Founder', featured: true,
    tagline: 'A podcast I started, built and ran for four years.',
    colors: ['#131313', '#f7c933'],
    images: ['submissions-1', 'submissions-4', 'submissions-2', 'submissions-3'],
    video: { src: 'assets/video/submissions.mp4', poster: 'assets/video/submissions-poster.webp', ar: '1' },
    text: [
      '<a class="ov-cta" href="submissions.html">Read the full case study →</a>',
      'I created The Submissions Podcast in 2020 to share stories from Muslims, sent in as voicenotes by listeners. I put together a team of seven volunteers, found the storytellers and shaped the show, and designed everything it wore: the name’s logo, the episode cards and the team portraits.',
      'Over four years we made 24 episodes and reached listeners in 79 countries. Spotify picked it as a Ramadan Recommendation in 2021 and it reached number 9 in the UK Religion & Spirituality chart.',
      'The logo is the Ka‘bah seen from its corner, with the gold band left out as a gap. The case study walks through it step by step.'
    ]
  },
  {
    slug: 'kcl-bsoc', story: 'bsoc.html', title: 'KCL BSOC', year: '2019', cat: 'Identity · President', featured: true,
    tagline: 'A shapla in bloom.',
    colors: ['#0c4d2e', '#d6293b'],
    images: ['kcl-bsoc-1'],
    video: { src: 'assets/video/kcl-bsoc.mp4', poster: 'assets/video/kcl-bsoc-poster.webp', ar: '1' },
    text: [
      '<a class="ov-cta" href="bsoc.html">Read the full case study →</a>',
      'I was president of King’s College London Bangladesh Society from September 2019 to August 2020, and redrew its logo that year.',
      'The old mark was an ornate circular stamp: hard to read, impossible to shrink and with no one-colour version. The new one is built from the flag and the shapla, Bangladesh’s national flower: a green circle, ten red petals turned around the centre, the name on a white band and the country in the middle.',
      'It works in full colour, in one colour on a hoodie, and at the size of a profile picture.'
    ]
  },
  {
    slug: 'odjo', story: 'odjo.html', title: 'Odjo', year: '', cat: 'Identity · Co-founder', featured: true,
    tagline: 'Five leaves, one stem.',
    colors: ['#2c3b2d', '#5f7d5c'],
    images: ['odjo-1'],
    video: { src: 'assets/video/odjo.mp4', poster: 'assets/video/odjo-poster.webp', ar: '1' },
    text: [
      '<a class="ov-cta" href="odjo.html">Read the full case study →</a>',
      'The identity for Odjo, the AI front desk I co-founded. A tree of five connected leaves growing from one stem, in forest green: many channels, tied back to one place.'
    ]
  },
  {
    slug: 'frame', title: 'Family Frame', year: '2026', cat: 'Product · Software', featured: true,
    tagline: 'A cheap photo frame, taught to run the family’s whole day.',
    colors: ['#3b1d5c', '#e0806a'],
    images: ['frame-1', 'frame-2', 'frame-3', 'frame-4', 'frame-5'],
    video: { src: 'assets/video/family-frame.mp4', poster: 'assets/video/family-frame-poster.webp', ar: '16/9' },
    text: [
      'A family display that runs entirely on a Frameo photo frame: 1 GB of RAM, Android 6 and a browser from 2015. There’s no server. It’s mostly photos, with small glass widgets for the time, weather, next prayer, next event and the 3D printer.',
      'Tap it for the calendar, prayer times, Spotify with word-by-word lyrics, and a printer screen that lists each warm-up step. Anyone in the family can send photos to it with a QR code or an iPhone shortcut.',
      'The chip can’t do blur, so the glass effect is faked with a 48×30 pixel image. The interface deploys over Wi-Fi in a few seconds and is served by a small Java app. About 13,000 lines, written with Claude Code.',
      'There’s also an easter egg. Open the printer camera full screen and there’s a red button marked “Do not click”. Press it and the frame gets “hacked”: TV static, then a terminal that types its way in over SSH, then a map that zooms from the whole world down to our street and locks on, with sirens and a robot voice. The camera comes back in night vision with a reticle and a live feed, and “Self destruct” counts down 3, 2, 1 and puts everything back. It’s all cosmetic and never sends anything anywhere.',
      'The button below does the same to this website.',
      '<button class="ov-hq" type="button" data-hq>Do not click</button>',
      '<a href="https://github.com/umsie121/frame" target="_blank" rel="noopener">Code on GitHub ↗</a>'
    ]
  },
  {
    slug: 'eden', title: 'Eden', year: '2024', cat: '3D product · Brand', featured: true,
    tagline: 'Plant care, personalised.',
    colors: ['#0f5c4c', '#1fa184'],
    images: ['eden-1', 'eden-2', 'eden-3'],
    video: { src: 'assets/video/eden.mp4?v=2', poster: 'assets/video/eden-poster.webp?v=2', ar: '16/9' },
    text: [
      'Eden was my first proper 3D project: a concept plant probe you push into the soil, modelled from scratch.',
      'It checks five things (water, temperature, light, pH and nutrients) and sends them to your phone over Bluetooth. On paper it’s waterproof to IP68 and the battery lasts four months.',
      'I designed the product, the logo and the styling myself.'
    ]
  },
  {
    slug: 'mind-ink', title: 'Mind Ink', year: '', cat: 'Logo · Substack', featured: true,
    tagline: 'A logo for a friend’s Substack.',
    colors: ['#0a2b18', '#2f6b45'],
    images: ['mind-ink-1'],
    video: { src: 'assets/video/mind-ink.mp4', poster: 'assets/video/mind-ink-poster.webp', ar: '1' },
    text: [
      'My friend Arslan writes Mind Ink, a Substack he describes as “thinking at a mild volume about the world and the human experience”. It now has more than a thousand subscribers.',
      'I designed its logo: a stacked serif wordmark in cream on deep green, with a quill beside it. The quill’s nib comes down to the baseline, as if the name has just been written.',
      '<a href="https://arsl4n.substack.com/" target="_blank" rel="noopener">Read Mind Ink ↗</a>'
    ]
  },
  {
    slug: 'mipp', title: 'MIPP', year: '2022', cat: 'Identity', featured: true,
    tagline: 'An i like a minaret, with a crescent for its dot.',
    colors: ['#20263E', '#24499C'],
    images: ['mipp-1', 'mipp-2', 'mipp-3', 'mipp-4'],
    video: { src: 'assets/video/mipp.mp4', poster: 'assets/video/mipp-poster.webp', ar: '4/3' },
    text: [
      'MIPP, Muslims in Public Policy, is my friend Irfan’s idea. When he applied to the civil service he really wanted mentorship and role models, so he set out to create that himself: a community for Muslims working together in public policy.',
      'On 19 February 2022 he was staying over at mine before our early-morning flight to Morocco, and said: let’s brainstorm for this idea I have. It was meant to be a quick, fun logo session. We stayed up for ages, and by the time we left for the airport it had its visual identity.',
      'Since then Irfan has grown it into an independent community of Muslims across the civil service, local government and arm’s-length bodies, now running events like its own leadership conference in central London.',
      'The i stands like a minaret, with a crescent for its dot. We wanted a nod to Islam, the thing that connects its members, but set in a rounded, friendly typeface so it never felt stiff, and simple enough to scale from a favicon to a banner. Five colours run from a bright blue to a deep slate.',
      'The wordmark also repeats as a pattern, which is what goes on their pull-up banners and event backdrops.',
      '<a href="https://www.muslimsinpp.org/" target="_blank" rel="noopener">Visit MIPP ↗</a>'
    ]
  },
  {
    slug: 'kings-medtech', title: "King's MedTech", year: '2021', cat: 'Identity', featured: true,
    tagline: 'A DNA strand made of circuit traces.',
    colors: ['#0b2a52', '#1a6ed8'],
    images: ['kings-medtech-1'],
    video: { src: 'assets/video/kings-medtech.mp4', poster: 'assets/video/kings-medtech-poster.webp', ar: '1' },
    text: [
      'A logo for the KCL Medical Technology Society. Everything is drawn from scratch. The DNA strand is built from circuit-board traces, a nod to genetic engineering.',
      'The outer shape is deliberately uneven, as if technology is pushing at the edges of medicine.'
    ]
  },
  {
    slug: 'keshavs-caterers', title: "Keshav's Caterers", year: '2021', cat: 'Rebrand', featured: true,
    tagline: 'A new look for a vegetarian caterer.',
    colors: ['#6e0b38', '#a3164f'],
    images: ['keshavs-caterers-1'],
    video: { src: 'assets/video/keshavs-caterers.mp4', poster: 'assets/video/keshavs-caterers-poster.webp', ar: '1' },
    text: [
      'A rebrand for a vegetarian catering company that needed something more modern. The wordmark pairs a serif with Devanagari.',
      'The symmetrical shape behind the type is drawn by hand, a little like the patterns you see at weddings.'
    ]
  },
  {
    slug: 'masque', title: 'Masque', year: '2021', cat: 'Identity',
    tagline: 'Simple shapes and a long shadow.',
    colors: ['#06306b', '#1c7de0'],
    images: ['masque-1'],
    text: [
      'An identity for a mask pop-up that appeared during the pandemic.',
      'Kept simple on purpose. The gradients and the long shadow give it depth.'
    ]
  },
  {
    slug: 'sarsoc', title: 'Sarsoc', year: '2021', cat: 'Logo redesign',
    tagline: 'Hands that hold the name.',
    colors: ['#5a3a22', '#a8774f'],
    images: ['sarsoc-1'],
    text: [
      'A quick logo redesign for the South Asian Relief Society.',
      'The type sits in the space between the hands, so the logo still reads on any colour or background.'
    ]
  },
  {
    slug: 'kclevate', title: 'KCLevate', year: '2019', cat: 'Co-founder · Identity',
    tagline: 'Three mountains, three futures.',
    colors: ['#3b0f33', '#7a2462'],
    images: ['kclevate-1'],
    text: [
      'KCLevate is a mentoring programme I co-founded for Year 12 students in Tower Hamlets and Newham applying to Medicine, Dentistry and Law. More than 200 students have been through it, and it still runs.',
      'I also made the logo, rebuilding an early Canva concept as a proper vector mark. The three peaks stand for the three subjects.'
    ]
  },
  {
    slug: 'humans-of-kcl', title: 'Humans of KCL', year: '2021', cat: 'Logo',
    tagline: 'Hiding in plain sight.',
    colors: ['#a5120f', '#e3261f'],
    images: ['humans-of-kcl-1'],
    text: [
      'A logo made to look like it belongs to King’s College London. Along the way I found out KCL has its own typeface, King’s Caslon.',
      'That was more exciting for me than for anyone else.'
    ]
  },
  {
    slug: 'lse-bangla-society', title: 'LSE Bangla Society', year: '2021', cat: 'Logo',
    tagline: 'A map at the centre.',
    colors: ['#1f2357', '#f2c94c'],
    images: ['lse-bangla-society-1'],
    text: [
      'A badge for the LSE Bangla Society, with a map of Bangladesh in the middle.',
      'The colours are the LSE Students’ Union’s, not mine.'
    ]
  },
  {
    slug: 'cw-posters', title: 'CW Posters', year: '2021', cat: 'Campaign',
    tagline: 'Superheroes for charity.',
    colors: ['#3a3d9a', '#c58fd9'],
    images: ['cw-posters-1'],
    text: [
      'Campaign posters for Charity Week, whose theme that year was superheroes.',
      'I like that it looks like a comic book cover: bold type, layered mountains and a 10km challenge.'
    ]
  }
];

// From @umayaircreates on Instagram, newest first. Hosted here, not embedded. kind: what the post is.
window.POSTS = [
  { id: 'DB7w17BoILL', date: '2024-11-04', kind: 'Photo', cap: 'Ponta de Piedade, Portugal. The rock is orange because iron-rich limestone oxidises like rust. Sony A7iii, f/8, 1/400s.' },
  { id: 'CY9kiYxjoc_', date: '2022-01-20', kind: 'Motion', cap: 'A few of my favourite things, this time as a looping GIF.' },
  { id: 'CY4WzXfPv5w', date: '2022-01-18', kind: 'Illustration', cap: 'My dad still asks why I like Polaroids: “why is it so small? Why are the colours all wrong?”' },
  { id: 'CY1nl4_tQ5V', date: '2022-01-17', kind: 'Illustration', cap: 'Cute little ice creams, from a @rishidraws tutorial.' },
  { id: 'CYzPdNnAMOh', date: '2022-01-16', kind: 'Illustration', cap: 'Snake plant, also known as mother-in-law’s tongue, because the leaves are so sharp.' },
  { id: 'CYt-YIsgmmd', date: '2022-01-14', kind: 'Illustration', cap: 'AirPods Pro. Symmetrical and shiny, which made the shading hard to get right.' },
  { id: 'CYo3qCxAvn6', date: '2022-01-12', kind: 'Illustration', cap: 'The piece that reawakened this page, from a @rishi.draws tutorial.' },
  { id: 'CKubW3OgY8g', date: '2021-01-31', kind: 'Photo', cap: 'The Taj Mahal. I called the account “creates”, not “designs”, so photos could live here too.' },
  { id: 'CIV06OBsep2', date: '2020-12-03', kind: 'Motion', cap: 'No fancy caption, just vibes.' },
  { id: 'CH0amWkAs5D', date: '2020-11-20', kind: 'Illustration', cap: 'Sat down for “five minutes” with a tutorial and lost the whole evening to it.' },
  { id: 'CHyHn82gMD1', date: '2020-11-19', kind: 'Illustration', cap: 'A second boat, Bangladeshi-style this time.' },
  { id: 'CHvmIO5gbt0', date: '2020-11-18', kind: 'Illustration', cap: 'One month into owning an iPad, following a video by @thegalshir.' },
  { id: 'CGIdJRxAT08', date: '2020-10-09', kind: 'Brand', cap: 'Keshav’s Caterers, on the table. Photoshop, Illustrator and a Wacom tablet.' },
  { id: 'CF5DllqDMgS', date: '2020-10-03', kind: 'Motion', cap: 'Getting the hang of Procreate by recreating things other people made.' },
  { id: 'CF2fHYrAGHg', date: '2020-10-02', kind: 'Illustration', cap: 'Another host portrait for @submissionspodcast. Illustrator, Wacom tablet.' },
  { id: 'CFz6AbQDqka', date: '2020-10-01', kind: 'Motion', cap: 'The first thing I ever made in Procreate.' },
  { id: 'CFPlRlgAhf8', date: '2020-09-17', kind: 'Illustration', cap: 'The first post. I’d put off starting this page forever.' }
];
