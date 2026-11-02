// Every project from the original umayair.com, with its own story and palette.
window.PROJECTS = [
  {
    slug: 'frame', title: 'Family Frame', year: '2026', cat: 'Product · Software', featured: true,
    tagline: 'A cheap photo frame, taught to run the family’s whole day.',
    colors: ['#3b1d5c', '#e0806a'],
    images: ['frame-1', 'frame-2', 'frame-3', 'frame-4', 'frame-5'],
    video: { src: 'assets/video/family-frame.mp4', poster: 'assets/video/family-frame-poster.webp' },
    text: [
      'A family display that runs entirely on a Frameo photo frame: 1 GB of RAM, Android 6 and a browser from 2015. There’s no server. It’s mostly photos, with small glass widgets for the time, weather, next prayer, next event and the 3D printer.',
      'Tap it for the calendar, prayer times, Spotify with word-by-word lyrics, and a printer screen that lists each warm-up step. Anyone in the family can send photos to it with a QR code or an iPhone shortcut.',
      'The chip can’t do blur, so the glass effect is faked with a 48×30 pixel image. The interface deploys over Wi-Fi in a few seconds and is served by a small Java app. About 13,000 lines, written with Claude Code.',
      '<a href="https://github.com/umsie121/frame" target="_blank" rel="noopener">Code on GitHub ↗</a>'
    ]
  },
  {
    slug: 'eden', title: 'Eden', year: '2024', cat: '3D product · Brand', featured: true,
    tagline: 'Plant care, personalised.',
    colors: ['#0f5c4c', '#1fa184'],
    images: ['eden-1', 'eden-2', 'eden-3'],
    text: [
      'Eden was my first proper 3D project: a concept plant probe you push into the soil, modelled from scratch.',
      'It checks five things (water, temperature, light, pH and nutrients) and sends them to your phone over Bluetooth. On paper it’s waterproof to IP68 and the battery lasts four months.',
      'I designed the product, the logo and the styling myself.'
    ]
  },
  {
    slug: 'mind-ink', title: 'Mind Ink', year: '', cat: 'Logo · Newsletter', featured: true,
    tagline: 'A logo for a friend’s newsletter.',
    colors: ['#0a2b18', '#2f6b45'],
    images: ['mind-ink-1'],
    text: [
      'My friend Arslan writes Mind Ink, a Substack he describes as “thinking at a mild volume about the world and the human experience”. It now has more than a thousand subscribers.',
      'I designed its logo: a stacked serif wordmark in cream on deep green, with a quill beside it. The quill’s nib comes down to the baseline, as if the name has just been written.',
      '<a href="https://arsl4n.substack.com/" target="_blank" rel="noopener">Read Mind Ink ↗</a>'
    ]
  },
  {
    slug: 'mipp', title: 'MIPP', year: '', cat: 'Branding', featured: true,
    tagline: 'The crescent is the dot on the i.',
    colors: ['#20263E', '#24499C'],
    images: ['mipp-1', 'mipp-2', 'mipp-3', 'mipp-4'],
    text: [
      'Branding for Muslims in Public Policy, run by friends of mine. MIPP is an independent organisation that helps government workforces represent the communities they serve.',
      'The whole identity comes from one detail: the dot on the i in “mipp” is a crescent. The type is rounded and friendly, set in Sofia Pro Soft, and there are five colours running from a bright blue to a deep slate.',
      'The wordmark also repeats as a pattern, which is what goes on their pull-up banners and event backdrops.',
      '<a href="https://www.muslimsinpp.org/" target="_blank" rel="noopener">Visit MIPP ↗</a>'
    ]
  },
  {
    slug: 'submissions', title: 'Submissions', year: '2020', cat: 'Podcast · Founder', featured: true,
    tagline: 'A podcast I started, built and ran for four years.',
    colors: ['#131313', '#f7c933'],
    images: ['submissions-1', 'submissions-4', 'submissions-2', 'submissions-3'],
    text: [
      '<a class="ov-cta" href="submissions.html">Read the full case study →</a>',
      'I created The Submissions Podcast in 2020 to share stories from Muslims, sent in as voicenotes by listeners. I put together a team of seven volunteers, found the storytellers and shaped the show, and designed everything it wore: the name’s logo, the episode cards and the team portraits.',
      'Over four years we made 24 episodes and reached listeners in 79 countries. Spotify picked it as a Ramadan Recommendation in 2021, it reached number 9 in the UK Religion & Spirituality chart, and in 2023 we held our first live show in London.',
      'The logo is the Ka‘bah seen from its corner, with the gold band left out as a gap. The case study walks through it step by step.'
    ]
  },
  {
    slug: 'submissions-illustrations', title: 'Submissions Illustrations', year: '2020', cat: 'Illustration series', featured: true,
    tagline: 'Five colours each, and no faces.',
    colors: ['#e0a40f', '#f7c933'],
    images: ['submissions-illustrations-1', 'submissions-illustrations-2', 'submissions-illustrations-3', 'submissions-illustrations-4', 'submissions-illustrations-5'],
    text: [
      'Portraits of the Submissions team, drawn for the launch in November 2020. None of them has a face, so they read as characters rather than likenesses.',
      'Each one uses five colours. With that few, every colour choice matters a lot more.',
      'It was a good exercise in leaving things out.'
    ]
  },
  {
    slug: 'kings-medtech', title: "King's MedTech", year: '2021', cat: 'Identity', featured: true,
    tagline: 'A DNA strand made of circuit traces.',
    colors: ['#0b2a52', '#1a6ed8'],
    images: ['kings-medtech-1'],
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
    text: [
      'A rebrand for a vegetarian catering company that needed something more modern. The wordmark pairs a serif with Devanagari.',
      'The symmetrical shape behind the type is drawn by hand, a little like the patterns you see at weddings.'
    ]
  },
  {
    slug: 'rounds', title: 'Rounds', year: '2021', cat: 'Product · Startup', featured: true,
    tagline: 'Your medical task manager.',
    colors: ['#3a1410', '#e8572e'],
    images: ['rounds-1'],
    text: [
      'Brand and product visuals for a medical startup making a task manager for doctors on the wards.',
      'The first project where my medical training shaped the design directly: I knew first-hand what a ward round needs from a task list.'
    ]
  },
  {
    slug: 'kcl-bsoc', title: 'KCL BSoc', year: '2021', cat: 'Identity',
    tagline: 'A shapla in bloom.',
    colors: ['#0c4d2e', '#d6293b'],
    images: ['kcl-bsoc-1'],
    text: [
      'A logo for King’s Bangladesh Society: the shapla, Bangladesh’s national flower, behind a map of the country.',
      'Circular logos are hard to get right. The gradients give this one some depth, and the green and red come from the flag.'
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
