/* ============================================================
   MUSA — PERSONAL CV WEBSITE
   script.js
   ============================================================ */

/* ── 1. PAGE LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    startTyping();
    triggerHeroReveal();
  }, 1200);
});

// Hide scroll while loading
document.body.style.overflow = 'hidden';


/* ── 2. CUSTOM CURSOR ── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower animation
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity         = '0';
  cursorFollower.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity         = '1';
  cursorFollower.style.opacity = '0.6';
});


/* ── 3. NAVBAR SCROLL BEHAVIOR ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Add scrolled class to navbar
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


/* ── 4. HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ── 5. TYPING ANIMATION ── */
function startTyping() {
  const target  = document.getElementById('typedName');
  const text    = 'Musa.';
  const speed   = 110;
  let i = 0;

  function type() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Stop blinking cursor after done
      setTimeout(() => {
        target.style.borderColor = 'transparent';
      }, 2000);
    }
  }

  type();
}


/* ── 6. HERO REVEAL ── */
function triggerHeroReveal() {
  const heroElements = document.querySelectorAll('.hero .reveal-up');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 150);
  });
}


/* ── 7. SCROLL REVEAL (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger skill bars if inside skills section
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
      });

      // Trigger counters if element has data-count
      const counter = entry.target.querySelector('[data-count]');
      if (counter) animateCounter(counter);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all reveal elements (skip hero — those trigger on load)
document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Observe skill groups separately for skill bars
document.querySelectorAll('.skill-group').forEach(group => {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          const width = fill.getAttribute('data-width');
          setTimeout(() => {
            fill.style.width = width + '%';
          }, i * 120);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillObserver.observe(group);
});


/* ── 8. COUNTER ANIMATION ── */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'));
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe hero stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


/* ── 9. PARALLAX ON HERO BG TEXT ── */
const heroBgText = document.querySelector('.hero-bg-text');

window.addEventListener('scroll', () => {
  if (heroBgText) {
    const scrollY = window.scrollY;
    heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.25}px))`;
  }
}, { passive: true });


/* ── 10. BUTTON RIPPLE EFFECT ── */
document.querySelectorAll('.btn, .contact-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);


/* ── 11. SMOOTH SCROLL FOR NAV LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── 12. PROJECT CARD GLOW FOLLOWS CURSOR ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const glow  = card.querySelector('.project-glow');
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    if (glow) {
      glow.style.transform = `translate(${x - 100}px, ${y - 100}px)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.project-glow');
    if (glow) glow.style.transform = 'translate(-60px, -60px)';
  });
});


/* ── 13. TAG HOVER STAGGER ── */
document.querySelectorAll('.tech-tags').forEach(wrapper => {
  const tags = wrapper.querySelectorAll('.tag');
  tags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 40}ms`;
  });
});


/* ── 14. CURRENT YEAR IN FOOTER ── */
const footer = document.querySelector('footer p');
if (footer) {
  footer.textContent = `Built by hand with HTML, CSS & JS · Musa · Kashmir, India · ${new Date().getFullYear()}`;
}
