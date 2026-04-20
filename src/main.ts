import './style.css';
import { initNav } from './nav';
import { initFlavourSwitcher } from './flavourSwitcher';
import { initCart } from './cart';
import { initAnimations } from './animations';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFlavourSwitcher();
  initCart();
  initAnimations();
});
