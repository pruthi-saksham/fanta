import gsap from 'gsap';
import type { Flavour } from './types';

const FLAVOURS: Flavour[] = [
  {
    id: 'orange',
    name: 'Orange',
    gradient: ['rgb(255, 145, 0)', 'rgb(255, 51, 0)'],
    blobColor: '#F1C21B',
  },
  {
    id: 'grape',
    name: 'Grape',
    gradient: ['rgb(140, 40, 210)', 'rgb(60, 0, 130)'],
    blobColor: '#A855F7',
  },
  {
    id: 'lemon',
    name: 'Lemon',
    gradient: ['rgb(210, 240, 20)', 'rgb(110, 175, 0)'],
    blobColor: '#EFD700',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    gradient: ['rgb(225, 30, 80)', 'rgb(140, 0, 55)'],
    blobColor: '#E74C6A',
  },
];

let currentFlavourId = 'orange';

export function initFlavourSwitcher(): void {
  const pills = document.querySelectorAll<HTMLElement>('.flavour-pill');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.dataset.flavour;
      const flavour = FLAVOURS.find((f) => f.id === id);
      if (!flavour || flavour.id === currentFlavourId) return;

      currentFlavourId = flavour.id;

      // Update active pill UI
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      // Animate hero gradient via CSS custom properties
      applyGradient(flavour);

      // Animate SVG blob fill
      gsap.to('#blob-shape', {
        attr: { fill: flavour.blobColor },
        duration: 0.7,
        ease: 'power2.inOut',
      });

      // Pulse the bottle
      gsap
        .timeline()
        .to('#fanta', { scale: 1.06, duration: 0.18, ease: 'power2.out' })
        .to('#fanta', { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' });

      // Animate pill indicator bar colour
      document.documentElement.style.setProperty(
        '--pill-accent',
        flavour.gradient[0]
      );
    });
  });
}

function applyGradient(f: Flavour): void {
  document.documentElement.style.setProperty('--g1', f.gradient[0]);
  document.documentElement.style.setProperty('--g2', f.gradient[1]);
}
