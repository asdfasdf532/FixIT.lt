/* =========================================================
   FixIT.lt — shared behaviour
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- mark active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .diag-panel, .process-line');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- hero boot / typing effect ---------- */
  const bootEl = document.querySelector('.boot-line .typed-text');
  if (bootEl) {
    const lines = [
      'diagnostika.paleista() ... OK',
      'sistema.patikrinta() ... paruošta',
      'FixIT.lt — kompiuterių servisas'
    ];
    let li = 0, ci = 0;
    const type = () => {
      if (ci <= lines[li].length) {
        bootEl.textContent = lines[li].slice(0, ci);
        ci++;
        setTimeout(type, 34);
      } else {
        setTimeout(() => {
          if (li < lines.length - 1) { li++; ci = 0; type(); }
        }, 900);
      }
    };
    type();
  }

  /* ---------- cart (localStorage) ---------- */
  const CART_KEY = 'fixit_cart';
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const setCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const updateCartBadge = () => {
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = getCart().length;
  };
  updateCartBadge();

  const toast = document.querySelector('.toast');
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card?.dataset.name || 'Prekė';
      const cart = getCart();
      cart.push(name);
      setCart(cart);
      updateCartBadge();
      showToast('Pridėta į krepšelį: ' + name);
    });
  });

  /* ---------- shop filter tabs ---------- */
  const filterBtns = document.querySelectorAll('.filter-list button[data-filter]');
  const products = document.querySelectorAll('.product-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      products.forEach(p => {
        p.style.display = (f === 'all' || p.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ---------- accordion (paslaugos / kainos) ---------- */
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.acc-item').classList.toggle('open');
    });
  });
  // open first accordion item by default
  const firstAcc = document.querySelector('.acc-item');
  if (firstAcc) firstAcc.classList.add('open');

  /* ---------- repair order form ---------- */
  const repairForm = document.querySelector('#repair-form');
  if (repairForm) {
    repairForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!repairForm.checkValidity()) { repairForm.reportValidity(); return; }
      repairForm.style.display = 'none';
      document.querySelector('.form-success')?.classList.add('show');
    });
  }

  /* ---------- contact form ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      contactForm.style.display = 'none';
      document.querySelector('.form-success')?.classList.add('show');
    });
  }

  /* ---------- simple rule-based AI assistant demo ---------- */
  const chatLog = document.querySelector('.chat-log');
  const chatInput = document.querySelector('.chat-input input');
  const chatSend = document.querySelector('.chat-input button');
  const quickBtns = document.querySelectorAll('.chat-quick button');

  const KB = [
    { k: ['kaina', 'kainuoja', 'kiek'], a: 'Diagnostika kainuoja nuo 15 €, o remonto kaina priklauso nuo gedimo. Tikslią kainą pamatysite puslapyje „Paslaugos“ arba gausite po nemokamos diagnostikos.' },
    { k: ['ilgai', 'laikas', 'trukmė', 'kada bus'], a: 'Dažniausiai remontas trunka 1–3 darbo dienas. Sudėtingesni atvejai (pvz. plokštės remontas) gali užtrukti iki savaitės — apie tai visada informuojame iš anksto.' },
    { k: ['nešiojam', 'laptop'], a: 'Taip, remontuojame nešiojamus kompiuterius: ekranai, klaviatūros, aušinimas, komponentų keitimas. Užsakymą galite pateikti puslapyje „Remontas“.' },
    { k: ['virus', 'lėtai', 'užstringa'], a: 'Panašu į virusų ar užsikimšusios sistemos požymius. Atliekame virusų šalinimą ir kompiuterio pagreitinimą — pateikite užklausą, atliksime nemokamą diagnostiką.' },
    { k: ['pc', 'surinkti', 'konfigūrac', 'gaming'], a: 'Surenkame kompiuterius pagal biudžetą ir poreikius — nuo darbo PC iki gaming stočių. Pavyzdžius rasite puslapyje „Parduotuvė“.' },
    { k: ['garantij'], a: 'Visiems remonto darbams taikoma garantija, priklausomai nuo darbo tipo (dažniausiai 3–12 mėn.). Detalės aptariamos priėmimo metu.' },
    { k: ['adresas', 'kur esate', 'darbo laik'], a: 'Visą kontaktinę informaciją ir darbo laiką rasite puslapyje „Kontaktai“.' },
  ];

  const addMsg = (text, who) => {
    if (!chatLog) return;
    const div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const respond = (msg) => {
    const lower = msg.toLowerCase();
    const hit = KB.find(item => item.k.some(kw => lower.includes(kw)));
    const answer = hit ? hit.a : 'Ačiū už žinutę! Šis AI asistentas yra demonstracinė versija. Konkrečiu klausimu geriausia susisiekti per puslapį „Kontaktai“ arba pateikti užklausą puslapyje „Remontas“.';
    setTimeout(() => addMsg(answer, 'bot'), 420);
  };

  const sendChat = () => {
    if (!chatInput || !chatInput.value.trim()) return;
    const val = chatInput.value.trim();
    addMsg(val, 'user');
    chatInput.value = '';
    respond(val);
  };

  chatSend?.addEventListener('click', sendChat);
  chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      addMsg(btn.textContent, 'user');
      respond(btn.textContent);
    });
  });

});