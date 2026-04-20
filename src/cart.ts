import gsap from 'gsap';
import type { CartItem } from './types';

const STORAGE_KEY = 'fanta-cart-v1';

const PRODUCT_NAMES: Record<string, string> = {
  sprite: 'Sprite',
  fanta: 'Fanta Orange',
  mango: 'Mango Juice',
};

let cart: CartItem[] = loadCart();

// ── Persistence ───────────────────────────────────────────────────────────────

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function totalCount(): number {
  return cart.reduce((s, i) => s + i.quantity, 0);
}

function totalPrice(): number {
  return cart.reduce((s, i) => s + i.quantity * i.price, 0);
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function updateBadge(): void {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const n = totalCount();
  badge.textContent = String(n);
  badge.classList.toggle('hidden', n === 0);
  if (n > 0) {
    gsap.fromTo(badge, { scale: 1.5 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1.5, 0.5)' });
  }
}

// ── Cart DOM ──────────────────────────────────────────────────────────────────

function renderCartItems(): void {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty">Your cart is empty 🧃</div>`;
    totalEl.textContent = 'Total: $0.00';
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <span class="cart-item-name">${item.name}</span>
      <div class="cart-item-controls">
        <button class="qty-btn minus" data-id="${item.id}">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn plus" data-id="${item.id}">+</button>
      </div>
      <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-btn" data-id="${item.id}" aria-label="Remove">✕</button>
    </div>`
    )
    .join('');

  totalEl.textContent = `Total: $${totalPrice().toFixed(2)}`;

  container.querySelectorAll<HTMLButtonElement>('.qty-btn.minus').forEach((b) =>
    b.addEventListener('click', () => changeQty(b.dataset.id!, -1))
  );
  container.querySelectorAll<HTMLButtonElement>('.qty-btn.plus').forEach((b) =>
    b.addEventListener('click', () => changeQty(b.dataset.id!, 1))
  );
  container.querySelectorAll<HTMLButtonElement>('.remove-btn').forEach((b) =>
    b.addEventListener('click', () => removeItem(b.dataset.id!))
  );
}

function changeQty(id: string, delta: number): void {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) removeItem(id);
  else {
    saveCart();
    renderCartItems();
    updateBadge();
  }
}

function removeItem(id: string): void {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCartItems();
  updateBadge();
}

function addToCart(id: string, price: number): void {
  const name = PRODUCT_NAMES[id] ?? id;
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, name, price, quantity: 1 });
  saveCart();
  updateBadge();
  showToast(`${name} added to cart! 🧃`);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string): void {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  gsap.fromTo(
    toast,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
  );
  toastTimer = setTimeout(() => {
    gsap.to(toast, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => toast.classList.remove('show'),
    });
  }, 2500);
}

// ── Drawer ────────────────────────────────────────────────────────────────────

function openDrawer(): void {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  renderCartItems();
  drawer?.classList.add('open');
  overlay?.classList.add('visible');
  gsap.fromTo(drawer, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'power3.out' });
}

function closeDrawer(): void {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  gsap.to(drawer, {
    x: '100%',
    duration: 0.3,
    ease: 'power3.in',
    onComplete: () => {
      drawer?.classList.remove('open');
      overlay?.classList.remove('visible');
    },
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initCart(): void {
  updateBadge();

  // Buy buttons
  document.querySelectorAll<HTMLButtonElement>('.buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest<HTMLElement>('.card');
      const id = btn.dataset.product ?? 'unknown';
      const price = parseFloat(card?.dataset.price ?? '1.99');
      addToCart(id, price);
      gsap
        .timeline()
        .to(btn, { scale: 0.88, duration: 0.1 })
        .to(btn, { scale: 1, duration: 0.35, ease: 'elastic.out(1.5, 0.5)' });
    });
  });

  // Cart icon
  document.getElementById('cart-btn')?.addEventListener('click', openDrawer);
  document.getElementById('cart-close')?.addEventListener('click', closeDrawer);
  document.getElementById('cart-overlay')?.addEventListener('click', closeDrawer);

  // Checkout (mock)
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (!cart.length) {
      showToast('Your cart is empty!');
      return;
    }
    cart = [];
    saveCart();
    renderCartItems();
    updateBadge();
    closeDrawer();
    showToast('Order placed! Thanks for your purchase 🎉');
  });
}
