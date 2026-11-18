// ===== INTRO ANIMATION (Plays once per visit) =====
if (!sessionStorage.getItem('masreIntroPlayed')) {
  const intro = document.createElement('div');
  intro.id = 'intro-screen';
  intro.innerHTML = `
    <div class="intro-logo">MASRE <i>GROUP</i></div>
    <div class="intro-line"></div>
  `;
  document.body.prepend(intro);

  window.addEventListener('load', () => {
    setTimeout(() => {
      intro.classList.add('hide');
      sessionStorage.setItem('masreIntroPlayed', 'true');
      setTimeout(() => intro.remove(), 750);
    }, 1500);
  });
}

// ===== EDIT YOUR DETAILS HERE (used on every page) =====
const SITE = {
  name: 'MASRE GROUP',
  phone: '+962 790 079 442',
  whatsapp: '962790079442',
  wechat: '+962 790 079 442',
  email: 'sales@masregroup.com',
  address: 'Amman, Jordan'
};
const PAGES = [['index','Home'],['enterprises','Enterprises'],['about','About'],['factory','Factory'],['contact','Contact']];
const cur = (location.pathname.split('/').pop() || 'index').replace('.html','') || 'index';

// DYNAMIC HEADER
document.getElementById('hdr').innerHTML = `
<div class="wrap nav">
  <a class="logo" href="index.html">MASRE <i>GROUP</i></a>
  <button id="menu" aria-label="Open menu" aria-expanded="false">Menu</button>
  <nav id="nav">
    ${PAGES.map(([f,t]) => `<a href="${f}.html" class="${f===cur?'on':''}">${t}</a>`).join('')}
    <a class="cta" href="contact.html#quote">Get a quote</a>
  </nav>
</div>`;

// DYNAMIC FOOTER
document.getElementById('ftr').innerHTML = `
<div class="wrap">
  <div class="cols">
    <div><h3>${SITE.name}</h3><p>A trading group based in Jordan, working across China, Sudan and the wider region. Steel is our core business.</p></div>
    <div><h3>Pages</h3>${PAGES.map(([f,t]) => `<a href="${f}.html">${t}</a>`).join('')}</div>
    <div><h3>Contact</h3>
      <a href="tel:+${SITE.whatsapp}">${SITE.phone}</a>
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}&su=${encodeURIComponent('Inquiry - MASRE GROUP')}" target="_blank" rel="noopener">${SITE.email}</a>
      <a href="https://wa.me/${SITE.whatsapp}">WhatsApp</a>
      <span>WeChat: ${SITE.wechat}</span>
      <span>${SITE.address}</span></div>
  </div>
  <small>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</small>
</div>`;

// FLOATING CONTACT BAR
const contactBar = document.createElement('div');
contactBar.style.cssText = 'position:fixed; right:20px; bottom:20px; z-index:60; display:flex; flex-direction:column; gap:10px; align-items:flex-end;';

const wa = document.createElement('a');
wa.className = 'wa';
wa.style.cssText = 'background:#1faa59; color:#fff; font-weight:700; padding:12px 18px; border-radius:30px; box-shadow:0 4px 14px #0005; display:inline-block; text-decoration:none;';
wa.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hello MASRE GROUP, I need a quote.')}`;
wa.target = '_blank'; wa.rel = 'noopener';
wa.textContent = 'Chat on WhatsApp';
contactBar.appendChild(wa);

const wechatBtn = document.createElement('button');
wechatBtn.style.cssText = 'background:#07c160; color:#fff; font-weight:700; padding:12px 18px; border-radius:30px; box-shadow:0 4px 14px #0005; border:none; cursor:pointer; font-family:inherit;';
wechatBtn.textContent = 'Copy WeChat Number';
wechatBtn.onclick = () => {
  navigator.clipboard.writeText(SITE.phone).then(() => {
    wechatBtn.textContent = 'WeChat Number Copied!';
    setTimeout(() => { wechatBtn.textContent = 'Copy WeChat Number'; }, 3000);
  });
};
contactBar.appendChild(wechatBtn);
document.body.appendChild(contactBar);

// MOBILE MENU TOGGLE
const menu = document.getElementById('menu'), nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});

// QUOTE FORM HANDLER
const q = document.getElementById('quote-form');
if (q) q.addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(q));
  const msg = `Quote request\nName: ${d.name}\nPhone: ${d.phone}\nProduct: ${d.product}\nQuantity: ${d.qty}\nDestination: ${d.dest}\nNotes: ${d.notes}`;
  window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
});

// HOMEPAGE SLIDESHOW
const sl = document.querySelector('.slider');
if (sl) {
  const slides = [...sl.querySelectorAll('.slide')], dots = sl.querySelector('.dots'), count = sl.querySelector('.count');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer;
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  };
  const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), 6500); };
  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Show company ' + (n + 1));
    b.onclick = () => { go(n); restart(); };
    dots.appendChild(b);
  });
  sl.querySelector('.prev').onclick = () => { go(i - 1); restart(); };
  sl.querySelector('.next').onclick = () => { go(i + 1); restart(); };
  sl.addEventListener('mouseenter', () => clearInterval(timer));
  sl.addEventListener('mouseleave', restart);
  go(0); restart();
}

// ===== 1. STEEL-BEAM HEADINGS & SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active', 'beam-on');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('section h2, .card, .steps li, .reveal').forEach(el => {
  if (el.tagName !== 'H2' && !el.classList.contains('reveal')) {
    el.classList.add('reveal');
  }
  revealObserver.observe(el);
});

// ===== 2. ANIMATED NUMBER COUNTERS FOR .stats =====
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr.replace(/,/g, ''), 10);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(ease * target).toLocaleString();
      el.textContent = `${prefix}${val}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    };
    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats b').forEach(b => statObserver.observe(b));

// ===== 3. INTERACTIVE PRODUCT / ENTERPRISE FILTER TABS =====
document.querySelectorAll('.grid').forEach(grid => {
  const cards = [...grid.querySelectorAll('.card')];
  const tags = [...new Set(cards.map(c => c.dataset.category || c.querySelector('.tag')?.textContent.trim()).filter(Boolean))];
  if (tags.length < 2) return;

  const bar = document.createElement('div');
  bar.className = 'filter-bar';
  ['All', ...tags].forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (idx === 0 ? ' active' : '');
    btn.textContent = label;
    btn.onclick = () => {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards.forEach(card => {
        const cardTag = card.dataset.category || card.querySelector('.tag')?.textContent.trim();
        const show = label === 'All' || cardTag === label;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.classList.remove('fade-in');
          void card.offsetWidth; // Force reflow to restart animation
          card.classList.add('fade-in');
        }
      });
    };
    bar.appendChild(btn);
  });
  grid.parentNode.insertBefore(bar, grid);
});