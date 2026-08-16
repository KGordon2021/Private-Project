/* MERIDIAN — shared interactivity */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav: scroll shadow + mobile toggle ---------- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
    }));
  }

  /* highlight active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    // stagger index for children in reveal-stagger containers
    document.querySelectorAll('.reveal-stagger').forEach(container => {
      Array.from(container.children).forEach((child, i) => {
        child.style.setProperty('--i', i);
        child.classList.add('reveal');
        io.observe(child);
      });
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.count.includes('.') ? el.dataset.count.split('.')[1].length : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(decimals);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(c => cio.observe(c));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- Generic slider ---------- */
  document.querySelectorAll('.slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const dotsWrap = slider.querySelector('.slider-dots');
    if (!track || slides.length === 0) return;

    let index = 0;
    const auto = slider.dataset.autoplay === 'true';
    const interval = parseInt(slider.dataset.interval || '6000', 10);
    let timer = null;

    // build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => go(i));
        dotsWrap.appendChild(dot);
      });
    }

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));
      }
    };

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      update();
      resetTimer();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1));

    // swipe support
    let startX = 0, dragging = false;
    track.addEventListener('pointerdown', (e) => { dragging = true; startX = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (dx > 50) go(index - 1);
      else if (dx < -50) go(index + 1);
      dragging = false;
    });

    function resetTimer() {
      if (!auto) return;
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), interval);
    }
    resetTimer();
    update();
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    const body = item.querySelector('.accordion-body');
    if (!btn || !body) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close siblings within same accordion
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item.open').forEach(sib => {
          if (sib !== item) {
            sib.classList.remove('open');
            sib.querySelector('.accordion-body').style.maxHeight = 0;
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : 0;
    });
  });

  /* ---------- Quote / contact forms (front-end only) ---------- */
  ['#quote-form', '#contact-form'].forEach(sel => {
    const form = document.querySelector(sel);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success') || form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

});
