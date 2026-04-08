// ── Mobile nav ────────────────────────────────────────────────
(function () {
  const burger  = document.getElementById('nav-burger');
  const links   = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  if (!burger) return;

  function close() {
    burger.classList.remove('open');
    links.classList.remove('open');
    overlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggle() {
    const isOpen = links.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', toggle);
  overlay.addEventListener('click', close);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ── Email modal ───────────────────────────────────────────────
(function () {
  const openBtn  = document.getElementById('open-email-modal');
  const closeBtn = document.getElementById('close-email-modal');
  const backdrop = document.getElementById('email-modal-backdrop');
  const sendBtn  = document.getElementById('send-email-btn');
  const status   = document.getElementById('email-status');
  if (!openBtn) return;

  function openModal() {
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('email-from').focus(), 300);
  }
  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    status.textContent = '';
    status.className = 'email-status';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Μετατροπή σε async για να λειτουργεί το Formspree fetch
  sendBtn.addEventListener('click', async () => {
    const from    = document.getElementById('email-from').value.trim();
    const subject = document.getElementById('email-subject').value.trim();
    const body    = document.getElementById('email-body').value.trim();

    if (!from || !subject || !body) {
      status.textContent = '// All fields are required.';
      status.className = 'email-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
      status.textContent = '// Invalid email address.';
      status.className = 'email-status error';
      return;
    }

    // Το endpoint URL από το Formspree
    const formspreeUrl = "https://formspree.io/f/xqegnowb";

    status.textContent = '// Sending...';
    status.className = 'email-status';
    sendBtn.disabled = true; // Αποτροπή διπλού κλικ

    try {
        const response = await fetch(formspreeUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: from,
                subject: subject,
                message: body
            })
        });

        if (response.ok) {
            status.textContent = '// Message sent successfully!';
            status.className = 'email-status success';
            
            // Καθαρισμός των πεδίων μετά την επιτυχία
            document.getElementById('email-from').value = '';
            document.getElementById('email-subject').value = '';
            document.getElementById('email-body').value = '';
            
            // Κλείσιμο του modal μετά από 2 δευτερόλεπτα
            setTimeout(closeModal, 2000);
        } else {
            const errorData = await response.json();
            if (Object.hasOwn(errorData, 'errors')) {
                status.textContent = '// ' + errorData.errors.map(err => err.message).join(", ");
            } else {
                status.textContent = '// Oops! Problem submitting form.';
            }
            status.className = 'email-status error';
        }
    } catch (error) {
        status.textContent = '// Network error. Please try again.';
        status.className = 'email-status error';
    } finally {
        sendBtn.disabled = false; // Επαναφορά του κουμπιού
    }
  });
})();


const AI_NEWS = {"totalArticles":307967,"articles":[{"title":"Majority of college students use AI for their coursework, poll finds","description":"A majority of college students in the United States uses artificial intelligence tools for their coursework at least once per week, a poll revealed.","url":"https://www.upi.com/Top_News/US/2026/04/02/survey-college-students-artificial-intelligence-coursework/5341775162201/","publishedAt":"2026-04-02T22:15:09Z","source":{"name":"UPI News"}},{"title":"Sony's gaming division just bought an AI startup that turns photos into 3D volumes","description":"Sony purchased an AI startup called Cinemersive Labs to help improve rendering techniques and gameplay visuals on future games.","url":"https://www.engadget.com/gaming/playstation/sonys-gaming-division-just-bought-an-ai-startup-that-turns-photos-into-3d-volumes-220648699.html","publishedAt":"2026-04-02T22:06:48Z","source":{"name":"Engadget"}},{"title":"Take-Two Reshuffles Its AI Team","description":"The AI division was working on 'cutting edge technology' to support game development","url":"https://kotaku.com/take-two-ai-zynga-layoffs-gta-2000684344","publishedAt":"2026-04-02T22:05:32Z","source":{"name":"Kotaku"}},{"title":"NY AG warns of AI tax scams and fraud tips","description":"New York Attorney General Letitia James warns residents about increasing AI-powered tax scams and offers tips to stay safe.","url":"https://www.lohud.com/story/news/ny-news/2026/04/02/ny-ag-warns-of-ai-tax-scams-and-fraud-tips/89442560007/","publishedAt":"2026-04-02T22:05:24Z","source":{"name":"White Plains Journal News"}},{"title":"Hacks Star Hannah Einbinder Did Not Hold Back About AI (And It's Hilarious)","description":"At a press conference for the final season of Hacks, star Hannah Einbinder had strong words for tech bros who are obsessed with artificial intelligence.","url":"https://www.slashfilm.com/2138871/hacks-hannah-einbinder-harsh-words-ai/","publishedAt":"2026-04-02T22:00:00Z","source":{"name":"/FILM"}},{"title":"'Today it's Oracle, tomorrow it'll be you': Ex-staffers share devastating aftermath","description":"30,000 jobs gone in a single morning. Oracle employees worldwide share shock, fear, and irony as AI reshapes the tech workforce.","url":"https://www.financialexpress.com/trending/today-its-oracle-tomorrow-itll-be-you-ex-staffers-share-devastating-aftermath-students-feel-the-anxiety-whats-next-for-big-tech/4193417/","publishedAt":"2026-04-02T22:00:00Z","source":{"name":"The Financial Express"}},{"title":"Meta's AI smart glasses have a creepy reputation, but they are finding a good purpose too","description":"Meta's Ray-Ban smart glasses have a growing privacy problem, but blind artist Clarke Reynolds is using them to do something remarkable — run a full marathon guided by strangers from around the world.","url":"https://www.digitaltrends.com/wearables/metas-ai-smart-glasses-have-a-creep-reputation-but-they-are-finding-a-good-purpose-too/","publishedAt":"2026-04-02T21:57:27Z","source":{"name":"Digital Trends"}},{"title":"PSA: Anyone with a link can view your Granola notes by default","description":"Granola, the AI-powered note-taking app, makes your notes viewable by anyone with a link by default. It also turns on AI training for anyone who's not an enterprise customer.","url":"https://www.theverge.com/ai-artificial-intelligence/906253/granola-note-links-ai-training-psa","publishedAt":"2026-04-02T21:56:16Z","source":{"name":"The Verge"}},{"title":"Are Micron (MU) and SanDisk (SNDK) Stocks Overvalued after AI-Driven Rally?","description":"Semiconductor giants Micron (MU) and SanDisk (SNDK) have emerged as key players riding the AI-driven memory boom. MU stock has surged 315.2% and SNDK stock has rocketed 1353% over the past year.","url":"https://markets.businessinsider.com/news/stocks/are-micron-mu-and-sandisk-sndk-stocks-overvalued-after-ai-driven-rally-1035992828","publishedAt":"2026-04-02T21:36:00Z","source":{"name":"Markets Insider"}},{"title":"Tech Advances on Hopes For AI Outlook - Tech Roundup","description":"Shares of technology companies rose as traders bet the artificial-intelligence boom will survive an energy shock. Chip makers continued a recent recovery rally, led by formerly embattled Intel.","url":"https://www.marketscreener.com/news/tech-advances-on-hopes-for-ai-outlook-tech-roundup-ce7e51dddc8ff320","publishedAt":"2026-04-02T21:31:45Z","source":{"name":"MarketScreener"}}]};

// Hardcoded permanent Unsplash CDN URLs — one per article, in order.
// These are direct image links (no redirect service) so they always work.
const ARTICLE_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', // students / education
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=400&fit=crop', // gaming controller
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop', // video game screen
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop', // cybersecurity
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=400&fit=crop', // film / cinema
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop', // office workers
  'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=400&fit=crop', // AR / wearables
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop', // data privacy
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop', // microchip
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop', // stock market
];

// Generic AI/tech backup images — used if a primary URL fails
const BACKUP_IMAGES = [
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1675557009875-436f7a3e3c78?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
];

(function renderNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  AI_NEWS.articles.forEach((article, index) => {
    const date    = new Date(article.publishedAt);
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const imgSrc  = ARTICLE_IMAGES[index] || ARTICLE_IMAGES[0];

    const card = document.createElement('a');
    card.className = 'news-card';
    card.href      = article.url;
    card.target    = '_blank';
    card.rel       = 'noopener noreferrer';
    card.innerHTML = `
      <img class="news-thumb" src="${imgSrc}" alt="" loading="lazy">
      <div class="news-body">
        <div class="news-meta">
          <span class="news-source">${article.source.name}</span>
          <span class="news-date">${dateStr}</span>
        </div>
        <div class="news-title">${article.title}</div>
        <div class="news-desc">${article.description}</div>
        <div class="news-footer">Read article</div>
      </div>
    `;
    grid.appendChild(card);

    const img = card.querySelector('.news-thumb');
    let retries = 0;
    img.addEventListener('error', () => {
      if (retries < BACKUP_IMAGES.length) {
        img.src = BACKUP_IMAGES[retries++];
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'news-thumb-placeholder';
        placeholder.textContent = 'No image';
        img.replaceWith(placeholder);
      }
    });
  });
})();


// ── Typing animation ──────────────────────────────────────────
const phrases = [
  "Building robust backend systems.",
  "Python enthusiast & C/C++ learner.",
  "Student @ ΣΑΕΚ Πάτρας.",
  "Fueled by coffee & curiosity."
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 70);
}
setTimeout(type, 1200);


// ── Starfield ─────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let W, H, stars;
  const NUM = 280, SPEED_BASE = 0.4, FOV = 400;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkStar() {
    return {
      x:    (Math.random() - 0.5) * W * 3,
      y:    (Math.random() - 0.5) * H * 3,
      z:    Math.random() * W,
      pz:   0,
      hue:  Math.random() < 0.15 ? 145 : Math.random() < 0.3 ? 195 : 0,
      size: Math.random() * 1.2 + 0.3
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: NUM }, mkStar);
    stars.forEach(s => s.pz = s.z);
  }

  let mx = 0, my = 0, targetMx = 0, targetMy = 0;
  document.addEventListener('mousemove', e => {
    targetMx = (e.clientX - W / 2) * 0.04;
    targetMy = (e.clientY - H / 2) * 0.04;
  });

  function draw() {
    ctx.fillStyle = 'rgba(8,11,15,0.25)';
    ctx.fillRect(0, 0, W, H);

    mx += (targetMx - mx) * 0.05;
    my += (targetMy - my) * 0.05;

    const cx    = W / 2 + mx;
    const cy    = H / 2 + my;
    const speed = SPEED_BASE + Math.hypot(targetMx, targetMy) * 0.008;

    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;
      if (s.z <= 0) { Object.assign(s, mkStar()); s.z = W; s.pz = W; }

      const sx  = (s.x / s.z)  * FOV + cx;
      const sy  = (s.y / s.z)  * FOV + cy;
      const spx = (s.x / s.pz) * FOV + cx;
      const spy = (s.y / s.pz) * FOV + cy;

      const r     = s.size * (1 - s.z / W) * 3;
      const alpha = Math.min(1, (1 - s.z / W) * 1.4);

      let color;
      if      (s.hue === 145) color = `rgba(0,232,122,${alpha})`;
      else if (s.hue === 195) color = `rgba(46,212,244,${alpha})`;
      else                    color = `rgba(200,214,229,${alpha})`;

      ctx.beginPath();
      ctx.moveTo(spx, spy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = color;
      ctx.lineWidth   = r;
      ctx.stroke();

      if (r > 0.8) {
        ctx.beginPath();
        ctx.arc(sx, sy, r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.pz = s.z; }); });
  init();
  draw();
})();


// ── Scroll reveal ─────────────────────────────────────────────
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
reveals.forEach(el => observer.observe(el));