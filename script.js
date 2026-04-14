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

(async function renderNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  try {
    // 1. Κατεβάζουμε το JSON δυναμικά με cache-busting
    const response = await fetch(`AI_news.json?t=${new Date().getTime()}`);
    
    // Ελέγχουμε αν η απάντηση είναι ΟΚ (π.χ. όχι 404 error)
    if (!response.ok) {
        throw new Error('Δίκτυο ή αρχείο JSON δεν βρέθηκε');
    }
    
    // 2. Μετατρέπουμε την απάντηση σε αντικείμενο JavaScript
    const AI_NEWS = await response.json();

    // 3. Τρέχουμε την ίδια λούπα που είχες, χρησιμοποιώντας το φρέσκο AI_NEWS
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
  } catch (error) {
    console.error("Σφάλμα κατά τη φόρτωση των νέων:", error);
    grid.innerHTML = '<div style="color: white; padding: 20px;">Αδυναμία φόρτωσης νέων. Παρακαλώ δοκιμάστε ξανά αργότερα.</div>';
  }
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