import gsap from 'gsap';

export function initNav(): void {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const searchBox = document.getElementById('search-box') as HTMLInputElement | null;

  // ── Scroll-aware nav ──────────────────────────────────────
  window.addEventListener(
    'scroll',
    () => {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 60);
    },
    { passive: true }
  );

  // ── Hamburger mobile menu ─────────────────────────────────
  let menuOpen = false;
  hamburger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu?.classList.add('open');
      gsap.fromTo(
        mobileMenu,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      hamburger.textContent = '✕';
    } else {
      gsap.to(mobileMenu, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => mobileMenu?.classList.remove('open'),
      });
      hamburger.textContent = '☰';
    }
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      hamburger && (hamburger.textContent = '☰');
    });
  });

  // ── Search: highlight matching cards ─────────────────────
  searchBox?.addEventListener('input', () => {
    const query = searchBox.value.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
      const name = (card.dataset.product ?? '').toLowerCase();
      const match = !query || name.includes(query);
      gsap.to(card, {
        opacity: match ? 1 : 0.3,
        scale: match ? 1 : 0.97,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}
