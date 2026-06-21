const LOCK_EVENT = "tidl:scroll-lock";

let lockCount = 0;
let savedScrollY = 0;

/** Lock page scroll (works with Lenis + mobile). Call unlock when done. */
export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  window.dispatchEvent(new CustomEvent(LOCK_EVENT, { detail: { locked: true } }));
}

/** Release page scroll lock. */
export function unlockPageScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  window.scrollTo(0, savedScrollY);

  window.dispatchEvent(new CustomEvent(LOCK_EVENT, { detail: { locked: false } }));
}

export { LOCK_EVENT };
